const express = require('express')
const app = express()
const cors = require('cors')
const { checkSchema, validationResult } = require('express-validator')
const mongoose = require('mongoose')
const port = 3080

//application level middleware 
app.use(express.json())
app.use(cors())

//db connection
mongoose.connect('mongodb://127.0.0.1:27017/TaskManagementApp-2024')
    .then(() => {
        console.log('Connected Successfully to db')
    })
    .catch(() => {
        console.log('error connecting to db')
    })

//destructuring Schema and model
const { Schema, model } = mongoose

//modelScehma definition
const TaskSchema = new Schema({
    title: String,
    description: String,
    status: String,
    priority: String
}, { timestamps: true })

//model definition
const Task = model('Task', TaskSchema)

//expressValidationSchema 
const taskValidationSchema = {
    title: {
        notEmpty: {
            errorMessage: 'Title field is required'
        }
    },
    description: {
        notEmpty: {
            errorMessage: 'Description field is required'
        }
    },
    status: {
        notEmpty: {
            errorMessage: 'Status Field is required'
        }
    },
    priority: {
        notEmpty: {
            errorMessage: 'Priority field is required'
        }
    }
}

//Create a task
app.post('/api/tasks', checkSchema(taskValidationSchema), (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { body } = req
    const task1 = new Task(body)
    task1.save()
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

//to get all tasks
app.get('/api/tasks', (req, res) => {
    Task.find()
        .then((tasks) => {
            res.json(tasks)
        })
        .catch((err) => {
            res.json(err)
        })
})

//to get a particular task
app.get('/api/tasks/:id', (req, res) => {
    const id = req.params.id
    Task.findById(id)
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

//to update a task
app.put('/api/tasks/:id', checkSchema(taskValidationSchema), (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const id = req.params.id
    const { body } = req
    Task.findByIdAndUpdate(id, body, { new: true })
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

//to delete a task
app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id
    Task.findByIdAndDelete(id)
        .then((task) => {
            res.json(task)
        })
        .catch((err) => {
            res.json(err)
        })
})

//Server listening on Port 3080
app.listen(port, () => {
    console.log(`Server is running on port : ${port}`)
})
