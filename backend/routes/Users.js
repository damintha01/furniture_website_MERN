const router = require('express').Router();
const {User,validate} = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req ,res) => {
    try{
        const {error} = validate(req.body);
        if(error) 
            return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(user) 
            return res.status(400).send('User already registered');

        const salt= await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        user = await new User({...req.body, password: hashPassword}).save();
        
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email
        });
    } catch(err) {
        console.log(err);
        res.status(500).send('Something went wrong');
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
        console.log(err);
        res.status(500).send('Something went wrong');
    }
});

module.exports = router;


