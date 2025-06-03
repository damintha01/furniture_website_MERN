const router = require('express').Router();
const {User,validate} = require('../model/User');
const bcrypt = require('bcrypt');


router.post('/', async (req ,res) => {
    try{
        const {error} = validate(req.body);
        if(error) 
            return res.status(400).send(error.details[0].message);

        let user = await User.findOne({email: req.body.email});
        if(user) 
            return res.status(400).send('User already registered');

        const salt= await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        await new User({...req.body, password: hashPassword}).save();
        res.send('User created successfully');
    } catch(err) {
        console.log(err);
    }
});


