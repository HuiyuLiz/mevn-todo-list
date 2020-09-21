const express = require('express')
const router = express.Router()

const todoController=require('../controllers/todos')

// GET Todos
router.get('/', todoController.getTodos)

// Post Todo
router.post('/', todoController.postTodo)

// Update Todo
router.put('/:id', todoController.putTodo)

// Delete Todo
router.delete('/:id', todoController.deleteTodo)




module.exports = router