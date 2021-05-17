// import dependencis
import express from 'express'
import mongoose from 'mongoose'
import Pusher from 'pusher'
// const Pusher = require("pusher");
import cors from 'cors'


import mongoMesseges from './messegeModel.js'

// app config
const app = express()
const port = process.env.PORT || 9000


const pusher = new Pusher({
    appId: "1204665",
    key: "5e241fb19bfc5debfc7d",
    secret: "fe775bb6df5db339ab15",
    cluster: "ap2",
    useTLS: true
  });

// middlewares

app.use(express.json())
app.use(cors())

// db config
const mongoURI = 'mongodb+srv://admin:8B0HXljUJskPlx9S@cluster0.flab8.mongodb.net/Messenger-DB?retryWrites=true&w=majority'
mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', ()=>{
    console.log('DB CONNECTED')

    const changeStream = mongoose.connection.collection('messeges').watch()
    changeStream.on('change', (change)=>{
        pusher.trigger('messege', 'newMessage',{
            'change':change
        });
    })
})
// api routes
app.get('/', (req, res) => res.status(200).send('Hello World'))

app.post('/save/message', (req, res)=>{
    const dbMessage = req.body

    mongoMesseges.create(dbMessage, (err, data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/retrieve/conversation',(req, res)=>{
    mongoMesseges.find((err, data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            // data.sort((b,a)=>{
            //     return a.timestamp - b.timestamp;
            // })
            res.status(200).send(data)
        }
    })
})

//listen
app.listen(port, () => console.log(`listening on localhost:${port}`))


// command ==== nodemon
// heroku diploy link: https://limitless-thicket-40874.herokuapp.com