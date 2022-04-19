const express = require('express');
const multer = require('multer')
const path = require('path')
const {Post,Image,Comment,User,Hashtag} = require('../models')
const {isLoggendIn} = require('./middlewares')
const fs = require('fs')

const router = express.Router();

try{
    fs.accessSync('uploads')
}catch (e) {
    console.log('make uploads directory')
    fs.mkdirSync('uploads')
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req,file,done){
            done(null,'uploads')
        },
        filename(req,file,done){
            const ext = path.extname(file.originalname) // 확장자 추출
            const basename = path.basename(file.originalname, ext)// 파일명
            done(null,basename + '_' + new Date().getTime() + ext)
        }
    }),
    limits:{fileSize:20*1024*1024},
})

router.post('/',isLoggendIn,upload.none() ,async (req,res,next)=>{
    try{
        const hashtags = req.body.content.match(/#[^\s#]+/g)
        const post = await Post.create({
            content:req.body.content,
            UserId:req.user.id,
        })

        if (hashtags){
            Array.from(new Set(hashtags))
            const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
                where:{name:tag.slice(1).toLowerCase()},
            })))
            await post.addHashtags(result.map((v) => v[0]))
        }

        if (req.body.image){
            if (Array.isArray(req.body.image)){
                const images = await Promise.all(req.body.image.map((image) => Image.create({src:image})))
                await post.addImages(images)
            }else {
                const image = await Image.create({src:req.body.image})
                await post.addImages(image)
            }
        }

        const fullPost = await Post.findOne({
            where:{id:post.id},
            limit:10,
            order:[
                ['createdAt','DESC'],
                [Comment,'createdAt','DESC'],
            ],
            include:[{
                model:Image,
            },{
                model:Comment,
                include:[{
                    model:User,//comment user
                    attributes:['id','nickname']
                }]
            },{
                model:User,//post user
                attributes:['id','nickname']
            },{
                model:User,//like user
                as:'Likers',
                attributes:['id']
            }]
        })
        res.status(201).json(fullPost)
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.get('/:postId', async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
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
                    order: [['createdAt', 'DESC']],
                }],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }],
        });
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/:postId/comment',isLoggendIn,async (req,res,next)=>{
    try{
        const post = await Post.findOne({
            where:{id:req.params.postId}
        })
        if (!post){
            return res.status(403).send('no post')
        }
        const comment = await Comment.create({
            content:req.body.content,
            PostId:parseInt(req.params.postId,10),
            UserId:req.user.id,
        })
        const fullComment = await Comment.findOne({
            where:{id:comment.id},
            include:[{
                model:User,
                attributes:['id','nickname']
            }]
        })
        res.status(201).json(fullComment)
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.patch('/:postId/like',isLoggendIn,async (req,res,next)=>{
    try{
        const post = await Post.findOne({
            where:{id:req.params.postId}
        })
        if (!post){
            return res.status(403).send('no post')
        }
        await post.addLikers(req.user.id)
        res.status(201).json({
            PostId:post.id,
            UserId:req.user.id,
        })
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.delete('/:postId/like',isLoggendIn,async (req,res,next)=>{
    try{
        const post = await Post.findOne({
            where:{id:req.params.postId}
        })
        if (!post){
            return res.status(403).send('no post')
        }
        await post.removeLikers(req.user.id)
        res.status(201).json({
            PostId:post.id,
            UserId:req.user.id,
        })
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.delete('/:postId',isLoggendIn,async (req,res,next)=>{
    try{
        Post.destroy({
            where:{
                id:req.params.postId,
                UserId:req.user.id
            },
        })
        res.status(200).json({PostId:parseInt(req.params.postId,10)})
    }catch (err){
        console.error(err)
        next(err)
    }
})

router.post('/images',isLoggendIn, upload.array('image'), (req,res,next)=>{
    res.json(req.files.map((v) => v.filename))
})

router.post('/:postId/retweet',isLoggendIn,async (req,res,next)=>{
    try{
        const post = await Post.findOne({
            where:{id:parseInt(req.params.postId)},
            include:[{
                model:Post,
                as: 'Retweet'
            }]
        })
        if (!post){
            res.status(400).send('no post')
        }
        if (req.user.id === post.UserId || (post.Retweet && post.Retweet.UserId === req.user.id)){
            res.status(400).send('its your post')
        }
        const retweetTargetId = post.RetweetId || post.id
        const exPost = await Post.findOne({
            where:{
                UserId:req.user.id,
                RetweetId:retweetTargetId,
            }
        })
        if (exPost){
            res.status(400).send('overlap post')
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content:'retweet'
        })
        const retweetWithPrevPost = await Post.findOne({
            where:{id:retweet.id},
            include:[{
                model:Post,
                as:'Retweet',
                include:[{
                    model:User,
                    attributes: ['id','nickname']
                },{
                    model:Image,
                }]
            },{
                model:User,
                attributes:['id','nickname']
            },{
                model:Image,
            },{
                model:Comment,
                include:[{
                    model:User,
                    attributes:['id','nickname']
                }]
            },{
                model:User,
                as:'Likers',
                attributes:['id'],
            }]
        })
        res.status(200).json(retweetWithPrevPost)
    }catch (err){
        console.error(err)
        next(err)
    }
})

module.exports = router
