const express = require('express');
const cors = require("cors");
const pool = require("./db")
const app = express();

//middleware
app.use(cors());
app.use(express.json())

//Routes

//get all todos
app.get('/todos', async(req,res) => {
    try {
        const allTodos = await pool.query('SELECT * FROM todo');
        res.json(allTodos.rows)
    } catch (err) {
        console.error(err.message);
    }
})

//get single todo
app.get('/todos/:id', async(req,res) => {
    try {
        const {id} = req.params;
        const Todo = await pool.query('SELECT * FROM todo WHERE todo_id = $1',[id]);
        res.json(Todo.rows)
    } catch (err) {
        console.error(err.message);
    }
})

//new todo
app.post('/todos', async(req,res) => {
    try {
        const {description} = req.body;
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING *",
        [description]);
        res.json(newTodo);
    } catch (err) {
        console.error(err.message);
    }
    
})

//update todo
app.put('/todos/:id', async(req,res) => {
    const {id} = req.params;
    const {description} = req.body;
    const updateTodo = await pool.query('UPDATE todo SET description = $1 WHERE todo_id = $2',
    [description,id]);

    res.json('todo was updated');
})

//delete todo
app.delete('/todos/:id', async (req,res) => {
    try {
        const {id} = req.params;
        const deleteTodo = await pool.query('DELETE FROM todo WHERE todo_id = $1',[id]);

        res.json('todo was deleted');
    } catch (err) {
        console.error(err.message)
    }
    
})

app.listen(5000, () => {
    console.log("server started at port 5000");
})