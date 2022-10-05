const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
   
  const {username } = request.headers
  
  const user = users.find((user) => user.username===username)
   
  if(!user){
    return response.status(404).json({error : "Customer Not Found"})
  }
    
  request.user = user
  
  next()
}



app.post('/users', (request, response) => {
  const { name, username } = request.body
   

   if(users.length >0){
    
      let existsUser = users.find((user)=> user.username === username)
      
      if(existsUser){return response.status(400).json({error : 'Users Exists'})} 
       
   }
   
   const user = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
  }
  
   users.push(user)
  
  // console.log(user)
    
     
  response.status(201).json(user)
});

app.get('/users', (request, response) => {
   
   response.status(200).json(users)

 });


app.get('/todos', checksExistsUserAccount, (request, response) => {
   
  const {todos} = request.user
    
  response.status(200).json(todos)

  
});

app.post('/todos',checksExistsUserAccount, (request, response) => {
    const {title,deadline} = request.body
    let newTodo = []
    
    newTodo = {
      id: uuidv4(),
      title ,
      done: false,
      deadline : new Date(deadline),
      created_at: new Date()
    }
     
    request.user.todos.push(newTodo)
    
    response.status(201).json(newTodo)
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
 
  const {title,deadline} = request.body
  const {todos} = request.user
  const {id} = request.params
  
  // console.log(todos)
  let todo = todos.find((todo) => todo.id === id)
  
  if(!todo){
    return response.status(404).json({error : "Todo Not Exists"})
  }
  

  todos.map((todo) => {
    if(todo.id === id){
       todo.title = title
       todo.deadline = deadline
       return response.status(200).json(todo)
    }
   })
 
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
   const {todos} = request.user
  const {id} = request.params
  
  const todo = todos.find((todo) => todo.id === id)
  
  if(!todo){
    return response.status(404).json({error : "Todo Not Found"})
  }
  
  // console.log(todos)
  todos.map((todo) => {
    if(todo.id === id){
      todo.done = true
      return response.status(200).json(todo)
    }
   })
  
   response.status(204).json()

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
   const {todos} = request.user
  const {id} = request.params

  const todo = todos.find((todo) => todo.id === id)
  // console.log(todo)
  if(!todo){
    return response.status(404).json({error : "Todo Not Found"})
  }
  
  
  todos.splice(todo,1)
  response.status(204).json()
  
});

module.exports = app;