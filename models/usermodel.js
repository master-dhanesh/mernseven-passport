const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const userModel = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username is required!"],
        minLength: [4, "Username field must have atleast 4 characters"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Email is required!"],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        // required: [true, "Password is required!"],
        // minLength: [6, "Password field must have atleast 6 characters"],
        // maxLength: [15, "Password field must have atmost 15 characters"],
    },
    resetPasswordOtp: {
        type: Number,
        default: -1,
    },
});

// userModel.plugin(plm, { usernameField: "email" });
userModel.plugin(plm);

module.exports = mongoose.model("collectionname", userModel);
