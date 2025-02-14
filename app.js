const express = require('express');
const bodyParser = require('body-parser');
const { handleWriteResponse, handleGetResponse,  handleUpdateResponse} = require('./utils/posts');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  console.log('Started the Server');
  next();
});

app.get('/canary', async (req, res) => {
  res.json({status: "Canary Up"});
});


app.get('/get/todoItem/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id); 
    console.log(id);
    const allTodos = await handleGetResponse();
    const parsedTodos = allTodos.map(todo => JSON.parse(todo));
    const todoItem = parsedTodos.find(todo => todo.id === id);
    if (todoItem) {
      console.log('Todo:', todoItem);
      res.json(todoItem);
    } else {
      res.status(404).json({ message: 'Todo item not found' });
    }
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({  message: 'Error' });
  }
});

app.post('/add/todoItem', async (req, res) => {
  try {
    const body = req.body; 
    console.log(body); 
    const response = await handleWriteResponse(body);
    res.json(response); 
  } catch (error) {
    console.error('Error handling /add/todoItem:', error);
    res.status(500).json({ message: 'Error' });
  }
});

app.get('/getAllTodoItems', async (req, res) => {
  try {
    const allTodos = await handleGetResponse();
    const sortedTodos = allTodos.sort((a, b) => {
      const statusOrder = (status) => {
        if (status === 'Completed' || status === 'Cancelled') return 1;
        return -1;
      };

      const statusComparison = statusOrder(a.status) - statusOrder(b.status);
      if (statusComparison !== 0) return statusComparison;

      return new Date(a.dueDate) - new Date(b.dueDate);
    });
    res.json(sortedTodos); 
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error' });
  }
});

app.put('/update/todoItem/:id', async (req, res) => {
  try {
    const todoId = req.params.id;
    const body = req.body; 
    console.log(`Updating todo item with ID: ${todoId}`, body);
    const response = await handleUpdateResponse(todoId, body);

    res.json(response);
  } catch (error) {
    console.error('Error handling /update/todoItem:', error);
    res.status(500).json({ message: 'Error' });
  }
});


app.listen(8080);
