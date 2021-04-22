const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err =>{
        console.log(err)
    })
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res)=>{
    const todoItem = await db.collection('todos').find().toArray() 
    const itemsLeft = await db.collection('todos').countDocuments({
        completed: false
    })
    res.render('index.ejs', {zebra: todoItem, left: itemsLeft})
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     res.render('index.ejs', {zebra: data})
    // })
    
})


app.post('/createTodo', (req, res)=>{
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result =>{
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.put('/markComplete', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('Marked Complete!')
        res.json('Marked Complete!')
        
    })
})

app.put('/undo', (req, res)=>{
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then(result => {
        console.log('Very Much Undone!')
        res.json('Very Much Undone!')
        
    })
})


app.delete('/deleteTodo', (req, res) => {
     
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result =>{
        console.log('Deleted Todo')
        res.json('Deleted It!') 
    })
})

app.listen(process.env.PORT || PORT, ()=>{
        console.log('connectione success')
        
    })
