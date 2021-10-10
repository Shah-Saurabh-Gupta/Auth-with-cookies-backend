const router = require('express').Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

//Register a User
router.post("/", async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;

        //Validations
        if (!email || !password || !passwordVerify) {
            return res.status(400).json({
                errorMessage: "Please enter all required fields",
            });
        }
        if (password.length < 6)
            return res.status(400).json({
                errorMessage: "Please enter password more than 6 characters",
            });
        if (password !== passwordVerify)
            return res.status(400).json({
                errorMessage: "Please enter the same password twice",
            });
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({
                errorMessage: "User with this email already exists",
            });

        //Hashing the password
        const salt = await bcrypt.genSalt();
        passwordHash = await bcrypt.hash(password, salt);

        //Save a new User account to the db
        const newUser = new User({
            email, passwordHash
        });
        const savedUser = await newUser.save();

        //Sign the token
        const token = jwt.sign({
            user: savedUser._id
        }, process.env.JWT_SECRET);

        //Send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

//LogIn a user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        //Validations
        if (!email || !password) {
            return res.status(400).json({
                errorMessage: "Please enter all required fields",
            });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser)
            return res.status(401).json({ errorMessage: "Wrong email or password" });
        const passwordCorrect = await bcrypt.compare(
            password,
            existingUser.passwordHash
        );
        if (!passwordCorrect)
            return res.status(401).json({ errorMessage: "Wrong email or password" });

        //Sign the token
        const token = jwt.sign({
            user: existingUser._id
        }, process.env.JWT_SECRET);

        //Send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
        }).send();

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

//Logout a user
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0)
    }).send();
});

module.exports = router;