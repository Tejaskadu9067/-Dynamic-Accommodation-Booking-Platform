const express = require("express")
const cors = require("cors");
const Place = require("./models/Place.js")
const mongoose  = require("mongoose");
const User = require("./models/User.js");
const bcrypt = require("bcryptjs")
const jwt = require ("jsonwebtoken")
const cookieParser = require("cookie-parser");
const imageDownlaoder = require('image-downloader')
const multer = require("multer")
const fs = require('fs')
const app =express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "shjvefjsevf7t564783r537f346tf3674f"


app.use(express.json());
app.use(cookieParser());
app.use('/uploads' , express.static(__dirname+'/uploads'))
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}));


mongoose.connect("mongodb://localhost:27017/Booking-app");


app.get('/test', (req,res)=>{
    res.json('test ok')
})


app.post('/register', async (req,res)=>{
    const {name, email, password} = req.body;
    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt)
        })
    
        res.json(userDoc)
    } catch (error) {
        res.status(422).json(error)
    }
    
    
})

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    
        const userDoc = await User.findOne({
            email,
            
        })
    
    if(userDoc){
        const passOk = bcrypt.compareSync(password, userDoc.password)
        if (passOk) {
             jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (error,token)=>{
                if(error) throw error
                  res.cookie('token', token).json(userDoc)
        
            })
            
        }else{
            res.status(422).json("password declined")
        }
    }else{
        "not found"
    }
    
    
    
})


app.get('/profile', (req,res)=>{
    const {token} = req.cookies;
    if(token){
        jwt.verify(token, jwtSecret, {}, async (error, userData)=>{
            if (error) throw error;
            const {name,email,id} = await User.findById(userData.id)
            res.json({name,email,id});

        })
    }else{
        res.json(null)
    }
    
})

app.post('/logout', (req,res)=>{
    res.cookie('token', '').json(true);
})

app.post('/upload-by-link' , async(req,res)=>{
    const {link} = req.body
    const newName = 'photo' + Date.now() + '.jpg'
    await imageDownlaoder.image({
        url: link,
        dest: __dirname + '/uploads/' +newName,
        });
        res.json(newName);

})

const photosMiddleware = multer({dest:'uploads/'})
app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => {
    const uploadedFiles = []
for(let i=0; i<req.files.length; i++){
    // const fileInfo = req.files[i]
    const {path, originalname} = req.files[i]
    const parts = originalname.split('.')
    const ext = parts[parts.length-1];
    const newPath = path + '.' + ext
    fs.renameSync(path, newPath)
    uploadedFiles.push(newPath.replace('uploads\\', ''))
}
res.json(uploadedFiles)
} )

app.post('/places', (req,res) => {
    const {token} = req.cookies;
    const {title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests} = req.body;
    jwt.verify(token, jwtSecret, {}, async (error, userData)=>{
        if (error) throw error;

        const placeDoc = await Place.create({
            owner: userData.id,
            title, 
            address, 
            photos:addedPhotos, 
            description, 
            perks, 
            extraInfo, 
            checkIn, 
            checkOut, 
            maxGuests
        })
        res.json(placeDoc)
    })
    
})

app.get('/places', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (error, userData)=>{
        if (error) throw error;
        const {id} = userData;
        res.json(await Place.find({owner:id}))
    })
})

app.get('/places/:id', async(req,res) => {
    const {id} = req.params;
    res.json(await Place.findById(id))
})

app.put('/places/:id', async(req,res) => {
    const {token} = req.cookies;
    const {id, title, address, addedPhotos, description, perks, extraInfo, checkIn, checkOut, maxGuests} = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (error, userData)=>{
        if (error) throw error;
        const placeDoc = await Place.findById(id)
        if (userData.id === placeDoc.owner.toString()){
            placeDoc.set({
                title, 
                address, 
                photos:addedPhotos, 
                description, 
                perks, 
                extraInfo, 
                checkIn, 
                checkOut, 
                maxGuests
            });
            await placeDoc.save()
            res.json('ok')
        }
    })
})


app.listen(8000)