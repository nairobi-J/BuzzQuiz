
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/user.js'


// Helper function to generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// Create (Register) User
export async function registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, role } = req.body;

    try {
          const hashedPassword = await bcrypt.hash(password, 10);
         const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
            role,
        });
       
       
        const token = generateToken(newUser._id, newUser.role);
        res.status(201).json({ userId: newUser._id, token });
        console.log('user created successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Login (Get User)
export async function loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({username});
        if(!user){
            return res.status(404).send('User not found');
        }


        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Invalid credentials');
        }

        const userId = user._id;
        const role = user.role;
        const token = generateToken(userId, role);
        res.json({ userId, token, role });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Internal Server Error');
    }
}

//
export async function logout(req, res) {
    // Clear the user session or any data associated with the user
    res.json({ message: 'Logout successful' });
    //await new Promise((resolve) => db.close(resolve));
}

// Get User by ID
export async function getUserById(req, res) {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found 101');
        }

        res.json(user);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(500).send('Internal Server Error');
    }
}




export const getAllUser = async(req, res) => {
    try{
        const users = await User.find({});
        res.json(users);
         if(!users){
        throw new Error('Users not found');
   }
    }
    catch(error){
      console.error('Error getting users', error);
        throw error;
    }
};

export async function getUserId(userId) {
   try{
   const user = await User.findById(userId);
   if(!user){
    throw new Error('User not found');
   }
   return user;
   }catch(error){
        console.error('Error getting user:', error);
        throw error;
   }
}

// Update User
export async function updateUser(req, res) {
    console.log('heree........');
    try {
        const userId = req.params.id;
        const { email, role } = req.body;
        console.log({ email, role, userId });

       
       

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {email,role},
            {new:true}
        );
        if(!updatedUser){
            return res.status(404).send("User not found");
        }

        
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete User
export async function deleteUser(req, res) {
    try {
        const userId = req.params.id;

       const deletedUser = await User.findByIdAndDelete(userId);
       if(!deletedUser){
        return res.status(404).send("user not found");
       }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

