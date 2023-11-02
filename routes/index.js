var express = require("express");
var router = express.Router();
const nodemailer = require("nodemailer");
const User = require("../models/usermodel");
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
// passport.use(User.createStrategy());

router.get("/", function (req, res, next) {
    res.render("index", { admin: req.user });
});

router.get("/about", function (req, res, next) {
    res.render("about", { admin: req.user });
});

router.get("/signup", function (req, res, next) {
    res.render("signup", { admin: req.user });
});

router.post("/signup", async function (req, res, next) {
    try {
        await User.register(
            { username: req.body.username, email: req.body.email },
            req.body.password
        );
        res.redirect("/signin");
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});

router.get("/signin", function (req, res, next) {
    res.render("signin", { admin: req.user });
});

router.post(
    "/signin",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/signin",
    }),
    function (req, res, next) {}
);

router.get("/signout", isLoggedIn, function (req, res, next) {
    req.logout(() => {
        res.redirect("/signin");
    });
});

router.get("/profile", isLoggedIn, async function (req, res, next) {
    try {
        // console.log(req.user);
        const users = await User.find();
        res.render("profile", { users: users, admin: req.user });
    } catch (error) {
        res.send(error);
    }
});

router.get("/delete/:id", isLoggedIn, async function (req, res, next) {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect("/profile");
    } catch (error) {
        res.send(error);
    }
});

router.get("/update/:id", isLoggedIn, async function (req, res, next) {
    try {
        const user = await User.findById(req.params.id);
        res.render("update", { user: user, admin: req.user });
    } catch (error) {
        res.send(error);
    }
});

router.post("/update/:id", isLoggedIn, async function (req, res, next) {
    try {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/profile");
    } catch (error) {
        res.send(error);
    }
});

router.post("/search", isLoggedIn, async function (req, res, next) {
    try {
        const user = await User.findOne({ username: req.body.username });
        res.json(user);
    } catch (error) {
        res.send(error);
    }
});

router.get("/forget", function (req, res, next) {
    res.render("forget", { admin: req.user });
});

router.post("/send-mail", async function (req, res, next) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.send("User not found");

        const otp = Math.floor(1000 + Math.random() * 9000);
        user.resetPasswordOtp = otp;
        await user.save();
        sendmailhandler(user.email, otp, res);
        // code to open new page and compare otp
    } catch (error) {
        res.send(error);
    }
});

function sendmailhandler(email, otp, res) {
    // admin mail address, which is going to be the sender
    const transport = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        auth: {
            user: process.env.mail_email,
            pass: process.env.mail_password,
        },
    });
    // receiver mailing info
    const mailOptions = {
        from: "Dhanesh Pvt. Ltd.<dhanesh1296@gmail.com>",
        to: email,
        subject: "Testing Mail Service",
        // text: req.body.message,
        html: `<h1>${otp}</h1>`,
    };
    // actual object which intregrate all info and send mail
    transport.sendMail(mailOptions, (err, info) => {
        if (err) return res.send(err);
        console.log(info);
        return;
    });
}

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/signin");
    }
}

module.exports = router;
