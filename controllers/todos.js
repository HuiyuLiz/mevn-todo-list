const Todo = require('../models/todos')

async function getTodos (req, res){
	try {
		let todos =await Todo.find()
		if (!todos) throw new Error('No Todos.')
		let sortedTodos = todos.sort((a,b)=>{
			return new Date(a.date).getTime() - new Date(b.date).getTime()		
		})
		res.status(200).json({
			message:'success',
			todos:todos
		})
	} catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
	
}

async function postTodo(req, res) {
	let newTodo=new Todo(req.body)
	try {
		let todo = await newTodo.save()
		if (!todo) throw new Error('Something went wrong.')
		res.status(200).json({
			message: 'success',
			todo: todo
		})
	} catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
	
}

async function putTodo(req, res) {
	const id = req.params.id
	try {
		const updated = await Todo.findByIdAndUpdate(id,req.body)
		if (!updated) throw new Error('Something went wrong.')
		const updatedTodo = { ...updated._doc, ...req.body}
		res.status(200).json({
			message: 'success',
			todo: updatedTodo
		})
		console.log(updated)
	} catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
}

async function deleteTodo(req, res) {
	const id = req.params.id
	try {
		const removed = await Todo.findByIdAndDelete(id)
		if (!removed) throw new Error('Something went wrong.')
		res.status(200).json({
			message: 'success',
			todo: removed
		})
	} catch (error) {
		res.status(500).json({
			message: error.message
		})
	}
}

module.exports = {
	getTodos,
	postTodo,
	putTodo,
	deleteTodo
}