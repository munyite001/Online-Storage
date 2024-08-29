const expressAsyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


//  REGISTER A NEW USER
exports.registerNewUser = expressAsyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Check if user already exists with that username
    const userExists = await prisma.user.findUnique({
        where: {
            userName: username,
        }
    })

    if (userExists) {
        res.status(400).json({ message: 'That username has been taken' });
        throw new Error('User already exists');
    }

    // Check if user already exists with that email
    const emailExists = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })

    if (emailExists) {
        res.status(412).json({ message: 'A user with that Email already exists' });
        throw new Error('Email already exists');
    }

    //  If alse is good, create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
        data: {
            userName: username,
            email,
            password: hashedPassword
        }
    })

    res.status(201).json({ message: 'User created successfully', user: newUser });
});

//  LOGIN A USER
exports.loginUser = expressAsyncHandler(async (req, res) => {
    const { login_email, login_password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: {
            email: login_email
        }
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        throw new Error('User not found');
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(login_password, user.password);

    if(!isMatch) {
        res.status(401).json({ message: 'Invalid password' });
        throw new Error('Invalid password');
    }

    //  If all is good, create a token
    const token = jwt.sign({id: user.id, email:user.email}, 
        process.env.SECRET, 
        { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', id: user.id, token});
})


//  GET A USER
exports.getUser = expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        }
    });

    if (!user) {
        res.status(404).json({ message: 'User not found' });
        throw new Error('User not found');
    }

    res.status(200).json(user);
})
