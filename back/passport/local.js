const passport = require('passport')
const { Strategy:LocalStrategy } = require('passport-local')
const {User} = require('../models')
const bcrypt = require('bcrypt')

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField:'email',
        passwordField:'password',
    },async (email, password, done) => {
        try{
            const user = await User.findOne({
                where:{email}
            })
            if (!user){
                return done(null, false, {reason:'non user info'})
            }
            const result = await bcrypt.compare(password,user.password)
            if (result){
                return done(null, user)
            }
            return done(null, false, {reason:'password error'})
        }catch (err){
            console.error(err)
            return done(err)
        }

    }))
}

