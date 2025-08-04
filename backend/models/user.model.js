import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    username: String,
    email: String, // Added email field
    password: String,
    role: String, // Added role
    company: String, // Added company
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = model('User',userSchema);
export default User;