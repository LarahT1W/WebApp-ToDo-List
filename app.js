const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
// init app

const app = express();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/todoapp";
const ObjectID = require('mongodb').ObjectID;
//body partser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

//view setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

//connect to mongodb

MongoClient.connect(url, (err, database) =>{
	console.log('MongoDB connected ...');
	if(err) console.log(err);

	const DB = database.db('todoapp');
	Todos = DB.collection('todos');
	app.listen(port, () => {
	console.log('server running on port ' + port);
	}); 
});
 
app.get('/', (req, res, next) => { 
	// res.render('index'); 
	Todos.find({}).toArray((err,todos) => {
		if(err){
			return console.log(err);
		}
		//console.log(todos);
		res.render('index',{
			todos: todos
		});
	});
})
app.post('/todo/add', (req, res, next) => { 
	// create todo
	const todo = {
		text: req.body.text,
		body: req.body.body
	}

	Todos.insert(todo, (err, result) =>{
		if(err){
			return console.log(err);
		}
		console.log('Todo Added...');
		res.redirect('/');
	});
});

app.delete('/todo/delete/:id', (req, res, next) => {
	const query = {_id: ObjectID(req.params.id)} // wrapped this into the new object in Mongodb
	Todos. deleteOne(query, (err, response) =>{
		if(err){
			return console.log(err);
		}
		console.log('Todo Removed');
		res.send(200);
	});
});

app.get('/todo/edit/:id', (req, res, next) => { 
	// res.render('index'); 
	const query = {_id: ObjectID(req.params.id)} 
	Todos.find(query).next((err,todo) => {
		if(err){
			return console.log(err);
		}
		//console.log(todos);
		res.render('edit',{
			todo: todo
		});
	});
});


app.post('/todo/edit/:id', (req, res, next) => { 
	// create todo
	const query = {_id: ObjectID(req.params.id)} 
	const todo = {
		text: req.body.text,
		body: req.body.body
	}
	//update todo
	Todos.updateOne(query, {$set: todo}, (err, result) =>{
		if(err){
			return console.log(err);
		}
		console.log('Todo Updated...');
		res.redirect('/');
	});
});



