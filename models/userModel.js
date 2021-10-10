const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
});

const User = new mongoose.model("user", userSchema);

module.exports = User;