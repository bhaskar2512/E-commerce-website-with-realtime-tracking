const LocalStrategy = require('passport-local');
const User = require('../models/user');
const bcrypt = require('bcrypt');

function init(passport){
    passport.use(new LocalStrategy({usernameField:'email'},async (email,password,done)=>{
        //Login
        //Checking if user exists.
        const user=await User.findOne({email:email});
        if(!user){
            return done(null,false,{message:'No user with this email'});
        }
        bcrypt.compare(password,user.password).then(match=>{
            if(match){
                return done(null,user,{message:'Logged In successfully'});
            }
            return done(null,false,{message:'Wrong Email or Password!'});
        }).catch(err=>{
            return done(null,false,{message:'Something went wrong!'});
        })
    }))
    //To store user into session
    passport.serializeUser((user,done)=>{
        done(null,user._id);
    })
    //To retrieve the user from the session 
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user);
        })
    })
}

module.exports= init;