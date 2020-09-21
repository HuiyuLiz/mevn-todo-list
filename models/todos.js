const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
	description: {
		type: String,
		required: true
	}, 
	date: {
		type: Date,
		default:Date.now 
	}
})

module.exports = mongoose.model('Todo', todoSchema)