const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const cors=require('cors')
const bodyParser = require('body-parser')

// Load Env
dotenv.config({ path: './config.env' })

const app = express()
const port = process.env.PORT || 8080

if (process.env.NODE_ENV ==='development'){
	app.use(morgan('dev'))
}
app.get(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false })) 

// routes
app.use('/api/todos', require('./routes/todos.js'))


// Handle production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static(__dirname + '/public/'))

	// Handle SPA
	app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))

}


// connect mongoDB
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(result=>{
	// console.log(result)
}).catch(err=>{
	console.log(err)
})

app.listen(port)