const mongoose = require("mongoose");

const postModel = new mongoose.Schema(
    {
        title: String,
        description: String,
        like: [{ type: mongoose.Schema.Types.ObjectId, ref: "collectionname" }],
        user: { type: mongoose.Schema.Types.ObjectId, ref: "collectionname" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("post", postModel);
