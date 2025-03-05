const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 4000;


// on -> escutando - receptor
// emit -> enviando algum dado


const users = [];

io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);
  
    socket.on("register", ({ username, password }) => {
      const exists = users.find(u => u.username === username);
      if (exists) {
        socket.emit("auth-error", "Usuário já existe.");
      } else {
        users.push({ username, password });
        socket.emit("auth-success", { username });
      }
    });
  
    socket.on("login", ({ username, password }) => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        socket.emit("auth-success", { username });
      } else {
        socket.emit("auth-error", "Credenciais inválidas.");
      }
    });
  
    socket.on("message", (message) => {
      io.emit("message", message);
    });
  });



io.on('connection', (socket) =>{
    socket.on("disconnect", () =>{

    })

    socket.on("join", (name) =>{
        const user = {id: socket.id, name}
        users.push(user);
        //io.emit("message", {name:null , message: `${name} entrou no chat`});
        io.emit("users", users)
    })

    socket.on("message" , (message) => {
        io.emit("message", message);
    })
})

server.listen(port, () => console.log(`servidor rodando na porta ${port}`))