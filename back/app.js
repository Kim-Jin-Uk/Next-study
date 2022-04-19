const express = require('express');
const postRouter = require('./routes/post')
const postsRouter = require('./routes/posts')
const userRouter = require('./routes/user')
const hashtagRouter = require('./routes/hashtag')
const db = require('./models')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const passportConfig = require('./passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const path = require("path");

dotenv.config()
const app = express()
db.sequelize.sync()
    .then(()=>{
        console.log('db connect')
    })
    .catch(console.error)

passportConfig()

app.use(morgan('dev'))
app.use(cors({
    origin:true,
    credentials:true,
}))
app.use('/',express.static(path.join(__dirname,'uploads')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:process.env.COOKIE_SECRET,
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res)=>{
    res.send('hello express')
})

app.use('/post', postRouter)
app.use('/posts', postsRouter)
app.use('/user', userRouter)
app.use('/hashtag', hashtagRouter)

app.listen(3065,()=>{
    console.log('server start')
})
