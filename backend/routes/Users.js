const router = require('express').Router();
const {User, validate} = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
    try {
        // Validate request body
        const {error} = validate(req.body);
        if (error) 
            return res.status(400).send(error.details[0].message);

        // Check if user already exists
        let user = await User.findOne({email: req.body.email});
        if (user) 
            return res.status(400).send('User already registered');

        // Create new user
        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        
        user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashPassword
        });

        await user.save();
        
        // Generate auth token
        const token = user.generateAuthToken();
        
        // Send response
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).send('Error: ' + err.message);
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).send('Invalid email or password');
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).send('Invalid email or password');
        
        // Generate token
        const token = user.generateAuthToken();
        
        // Send response
        res.json({
            token,
            user: {
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).send('Error: ' + err.message);
    }
});

module.exports = router;


