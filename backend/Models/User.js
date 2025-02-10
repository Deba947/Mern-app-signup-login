const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String,   // Make sure password is explicitly defined
        required: true 
    }
});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;

