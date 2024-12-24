const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const authController = {
    //REGISTER
    registerUser: async (req,res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            // create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            //save to database
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){

            res.status(500).json(err);
        }
    },
    //LOGIN
    loginUser: async (req, res) => {
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                res.status(404).json("Wrong username!");
            }
            const valiPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!valiPassword){
                res.status(404).json("Wrong password!");
            }
            if(user && valiPassword){
                const accessToken = jwt.sign(
                {
                    id: user.id,
                    admin: user.admin
                },
                process.env.JWT_ACCESS_KEY,
                {expiresIn: '2h'}
                );
                const {password, ...others} = user._doc;
                res.status(200).json({...others,accessToken});
            }
        }catch(err){
            console.log(err);
            
            res.status(500).json(err);
        }

    }
}

module.exports = authController;