// let users = []; // In-memory user storage (temporary)
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function register(req, res){
    try{
    const { username, password, email } = req.body;
    const userExists = await User.findOne({username})
    if (userExists) {
        return res.status(400).json({message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user= new User({
        username, 
        password: hashedPassword, 
        email,
        role: 'User', // Default role
        company: 'Company' // Default company
    })
    await user.save()
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return res.status(201).json({ 
        message: 'User registered successfully',
        token,
        user: {
            username: user.username,
            role: user.role,
            company: user.company
        }
    });
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: 'Registration failed'});
    }
}

export async function login(req, res){
    try{
        console.log('ping');
        
        const {username, password } = req.body;
        const user = await User.findOne({ username});
        if (!user) return res.status(401).json({message: "User not found"});
    
        console.log('ping 2');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({message: "Invalid credentials"});

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({
            message: 'Logged In', 
            token,
            user: {
                username: user.username,
                role: user.role,
                company: user.company
            }
        });

    } 
    catch (e) {
        console.log(e);
        
        return res.status(500).json({message: 'Login failed'});
    }
}

