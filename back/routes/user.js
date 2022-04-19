const express = require('express');
const {User,Post, Comment, Image} = require('../models')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router();
const {isLoggendIn, isNotLoggendIn} = require('./middlewares')
const {Op} = require("sequelize");

router.get('/',async (req,res,next)=>{
    try {
        if (req.user){
            const user = await User.findOne({
                where:{id:req.user.id}
            })
            const fullUserWithoutPassword = await User.findOne({
                where:{id:user.id},
                attributes: {
                    exclude:['password'],
                },
                include:[
                    {
                        model: Post,
                        attributes:['id'],
                    },
                    {
                        model: User,
                        as: 'Followings',
                        attributes:['id'],
                    },
                    {
                        model: User,
                        as: 'Followers',
                        attributes:['id'],
                    },
                ]
            })
            res.status(200).json(fullUserWithoutPassword)
        }else {
            res.status(200).json(null)
        }
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.post('/login',isNotLoggendIn,(req, res, next) =>{
    passport.authenticate('local',(err, user, clientErr) => {
        if (err){
            console.error(err)
            return next(err)
        }
        if (clientErr){
            return res.status(401).send(clientErr.reason)
        }
        return req.login(user, async (loginErr) => {
            if (loginErr){
                console.error(loginErr)
                return next(loginErr)
            }
            const fullUserWithoutPassword = await User.findOne({
                where:{id:user.id},
                attributes: {
                    exclude:['password'],
                },
                include:[
                    {
                        model: Post,
                        attributes:['id'],
                    },
                    {
                        model: User,
                        as: 'Followings',
                        attributes:['id'],
                    },
                    {
                        model: User,
                        as: 'Followers',
                        attributes:['id'],
                    },
                ]
            })
            return res.status(200).json(fullUserWithoutPassword)
        })
    })(req,res,next)
})

router.post('/',isNotLoggendIn, async (req,res, next)=>{
    try{
        const exUser = await User.findOne({
            where:{
                email:req.body.email
            }
        })
        if (exUser){
            return res.status(403).send('overlap email')
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12)
        await User.create({
            email: req.body.email,
            nickname: req.body.nick,
            password: hashedPassword,
        })
        res.status(200).send('ok')
    }catch (err){
        console.error(err)
        next(err)
    }

})

router.post('/logout',isLoggendIn, (req, res) => {
    req.logout()
    req.session.destroy()
    res.send('ok')
})

router.patch('/nickname',isLoggendIn,async (req, res, next) => {
    try{
        await User.update({
            nickname: req.body.nickname,
        },{
            where:{id:req.user.id},
        })
        res.status(200).json({nickname: req.body.nickname})
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.get('/followers',isLoggendIn,async (req, res, next) => {
    try{
        const user = await User.findOne({
            where:{id:req.user.id}
        })
        const followers = await user.getFollowers({
            limit:parseInt(req.query.limit,10),
        })
        res.status(200).json(followers)
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.get('/followings',isLoggendIn,async (req, res, next) => {
    try{
        const user = await User.findOne({
            where:{id:req.user.id}
        })
        const followings = await user.getFollowings({
            limit:parseInt(req.query.limit,10),
        })
        res.status(200).json(followings)
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.delete('/follower/:userId',isLoggendIn,async (req, res, next) => {
    try{
        const user = await User.findOne({where:{id:req.params.userId}})
        if (!user){
            return res.status(400).send('no user')
        }
        await user.removeFollowings(req.params.userId)
        res.status(200).json({UserId:parseInt(req.params.userId,10)})
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.get('/:userId/posts',async (req,res,next)=>{
    try{
        const where = {UserId:req.params.userId};
        if (parseInt(req.query.lastId, 10)) {
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10)}
        }else {
            console.log('else')
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        res.status(200).json(posts)
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.patch('/:userId/follow',isLoggendIn,async (req, res, next) => {
    try{
        const user = await User.findOne({
            where:{id:req.params.userId}
        })
        if (!user){
            return res.status(400).send('no user')
        }
        await user.addFollowers(req.user.id)
        res.status(200).json({UserId:parseInt(req.params.userId,10)})
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.delete('/:userId/follow',isLoggendIn,async (req, res, next) => {
    try{
        const user = await User.findOne({
            where:{id:req.params.userId}
        })
        if (!user){
            return res.status(400).send('no user')
        }
        await user.removeFollowers(req.user.id)
        res.status(200).json({UserId:parseInt(req.params.userId,10)})
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.get('/:id', async (req, res, next) => { // GET /user/3
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.id },
            attributes: {
                exclude: ['password']
            },
            include: [{
                model: Post,
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followings',
                attributes: ['id'],
            }, {
                model: User,
                as: 'Followers',
                attributes: ['id'],
            }]
        })
        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length;
            data.Followings = data.Followings.length;
            data.Followers = data.Followers.length;
            res.status(200).json(data);
        } else {
            res.status(404).json('존재하지 않는 사용자입니다.');
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router
