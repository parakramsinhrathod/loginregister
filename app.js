const express = require('express')
const app = express()
const port = 3000
const ejs = require('ejs')
const mongoose = require('mongoose')
const User = require('./models/user')
const session  = require('express-session')

app.use(session({
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: true
  }));


app.use((req,res,next) => {
    console.log('all session is', req.session)
    next()
})
// mongo db 
const dbUrl = 'mongodb+srv://vishwajeet:vishwajeet@cluster0.eiablla.mongodb.net/loginregistertest'

// connecting to mongo
const uri = dbUrl
async function connect(){
    try{
        await mongoose.connect(uri)
        console.log('connected to online MDB')
    }catch(error){
        console.log(error)
    }
}
connect()
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open',() =>{
    console.log('dababase connected :)')
})



app.use(express.urlencoded({extended:true}))

app.set('view engine', 'ejs')

app.get('/' , async(req,res) => { 
    const userName = await User.findById(req.session.curUser) 
    console.log(userName)
    res.render('main', {userName})
})  

// login routes
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => { 
    const {mobile, password} = req.body
    const checkIfMobileExist = await User.uniqueMobile(mobile)
    if (checkIfMobileExist){
        res.send('mobile number does not exist in our database')
    }else {
        const checkCorrectPwd = await User.validatePassword(mobile, password)
        const user = await User.findOne({mobile})
        req.session.curUser = user._id
        req.session.save()
        res.redirect('/')
    }
    
})


// register route
app.get('/register', (req,res) => { 
    res.render('register')
})

app.post('/register', async(req,res) => { 
const {mobile, name, password} = req.body
    const user = new User({mobile, name, password})
    const mobileNumberAlreadyInUse = await User.uniqueMobile(mobile)
    if(!mobileNumberAlreadyInUse) { 
        res.send('please try new mobile number')
    }else { 
        await user.save()
        req.session.curUser = user._id
        res.redirect('/')
        console.log('register success', req.session)
    }
})


// logout 
app.post('/logout', (req,res) => { 
    req.session.curUser = null
    res.redirect('/')
})




app.listen(port, () => {
    console.log(`Your App running on http://localhost:${port}`)
})