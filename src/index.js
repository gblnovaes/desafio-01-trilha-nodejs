const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  
  const {username } = request.headers
  
  const user = users.find((user) => user.username===username)
   
  if(!user){
    return response.status(404).json({error : "Customer Not Found"})
  }
    
  request.user = user
  
  next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name,username} =request.body
  
  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  })
  
  response.status(201).json(users)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  
  const {todos} = request.user
    
  response.status(200).json(todos)

  
});

app.post('/todos',checksExistsUserAccount, (request, response) => {
  // Complete aqui
    const {username} = request.headers
    const {title,deadline} = request.body
    
    request.user.todos.push({
      id: uuidv4(),
      title ,
      done: false,
      deadline : new Date(deadline),
      created_at: new Date()
    })
    
    response.status(200).json(request.user)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title,deadline} = request.body
  const {todos} = request.user
  const {id} = request.params
    
  const todo = todos.find((todo) => todo.id === id)
  
  if(!todo){
    return response.status(404).json({error : "Todo Not Found"})
  }
  

  todos.map((todo) => {
    if(todo.id === id){
       todo.title = title
       todo.deadline = deadline
    }
   })
  
  response.status(200).json({"saved":"Salvo com sucesso."})
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {todos} = request.user
  const {id} = request.params
  
  const todo = todos.find((todo) => todo.id === id)
  
  if(!todo){
    return response.status(404).json({error : "Todo Not Found"})
  }
  
  
  todos.map((todo) => {
    if(todo.id === id){
      todo.done = true
    }
   })
  
   response.status(200).json({"saved":"Tarefa concluida.  "})

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {todos} = request.user
  const {id} = request.params

  const todo = todos.find((todo) => todo.id === id)
  console.log(todo)
  if(!todo){
    return response.status(404).json({error : "Todo Not Found"})
  }
  
  
  todos.splice(todo,1)
  response.status(200).json(todos)
  
});

module.exports = app;