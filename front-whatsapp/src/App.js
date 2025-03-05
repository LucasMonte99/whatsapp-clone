import { useEffect, useState } from 'react';
import './App.css';
import Image from './assets/profissao-programador.jpg';
import ImagePaulo from './assets/295509094_100422586103264_5950280448140763401_n.png';
import ImageLucas from './assets/IMG-20240130-WA0026.jpg';
import WhatsImage from './assets/whatsapp-logo-.png';
import SendMensageIcon from './assets/send.png';
import socket from 'socket.io-client';




const io = socket('http://localhost:4000');


function App() {
  const [name,setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState('NetWorking Profissão Programador');
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registred, setRegistred] = useState(false);


  useEffect(() =>{
    io.on("users", (users) => setUsers(users));
    io.on("message", (message) => setMessages((messages) => [...messages, message]))
    io.on("auth-success", (user) =>{
      setName(user.username);
      setJoined(true);
    });
    io.on("auth-error", (error) => {
      alert(error);
    })
  }, [])

  const handleAuth = () => {
    if (username && password) {
      io.emit(registred ? "login" : "register", { username, password });
    }
  };

  const handleMessage = () => {
    if (message && activeChat){
      io.emit("message", {message,name, chat: activeChat});
      setMessage("");
    }
  };

  

  if(!joined){
    return(
      <div className='first-page'>
        <img src={WhatsImage} className='image-whats' alt='' />
        <div className='background-color'>
        

          <span>
            <h2>{registred ? "Login" : "Criar Conta"}</h2>
            
            <input className='user-login'
              placeholder="Nome de usuário"
              value={username}
               onChange={(e) => setUsername(e.target.value)}
            />
            
            <input className='user-password'
              placeholder='Senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            <p onClick={() => setRegistred (!registred)}>
              {registred ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
            </p>

            <button onClick={handleAuth}>
              {registred ? "Entrar" : "Registrar"}
            </button>
          </span>
            
        </div>


       
      </div>
    )
  }


  return (
    <div className='container'>
      <div className='back-ground'></div>
      <div className='chat-container'>

        <div className='chat-contacts'>
          <div className='chat-options'>
            <span className='chat-option'>Conversas</span>
            <div>
              <input
              className='chat-input-option'
              placeholder='Pesquisar' 
              
             
              />
            
            </div>

          </div>
          
          

          <div className='chat-item' onClick={() => setActiveChat("NetWorking Profissão Programador")}>
            <img src={Image} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>NetWorking Profissão Programador</span>
              <span className='last-message'>
                {messages
                .filter((m) => m.chat === "NetWorking Profissão Programador")
                .slice(-1)
                .map((m) => `${m.name}: ${m.message}`)}
              </span>
              
            </div>
          </div>
          
          <div className='chat-item' onClick={() => setActiveChat("Paulo Borges - Profissão Programador")}>
            <img src={ImagePaulo} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>Paulo Borges - Profissão Programador</span>
              <span className='last-message'>
                {messages
                .filter((m) => m.chat === "Paulo Borges - Profissão Programador")
                .slice(-1)
                .map((m) => `${m.name}: ${m.message}`)}
              </span>
            </div>
          </div>

          <div className='chat-item' onClick={() => setActiveChat("Lucas Matheus - Programador")}>
            <img src={ImageLucas} className='image-profile' alt='' />
            <div className='title-chat-container'>
              <span className='title-message'>Lucas Matheus - Programador</span>
              <span className='last-message'>
                {messages
                .filter((m) => m.chat === "Lucas Matheus - Programador")
                .slice(-1)
                .map((m) => `${m.name}: ${m.message}`)}
              </span>
            </div>
          </div>
        
        </div>



        <div className='chat-messages'>
          <div className='chat-options'>
            <div className='chat-item'>
              <img src={
                activeChat === "Paulo Borges - Profissão Programador"
                ? ImagePaulo
                : activeChat === "Lucas Matheus - Programador"
                ? ImageLucas
                : Image} 
                className='image-profile' alt='' 
              />

              <div className='title-chat-container'>
                <span className='title-message'>{activeChat}</span>
                {activeChat === "NetWorking Profissão Programador" && (
                  <span className='last-message'>
                    {users.map((user, index) => (
                    <span key={index}>{user.name}{index + 1 < users.length ? ', ' : ''}</span>
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className='chat-messages-area'>
            {messages
              .filter((message) => message.chat === activeChat)
              .map((message,index) => (
              <div className={message.name === name?  'user-container-message right' : 'user-container-message left'}>
                <span  
                  key={index}
                  className={message.name === name?  'user-my-message' : 'user-other-message'}
                  data-name={message.name}
                >
                  {message.message}
                </span>
              </div>

            ))}
          </div>

          <div className='chat-input-area'>
            <input 
              className='chat-input'
             placeholder='Mensagem' 
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleMessage()}
            />
            <img src={SendMensageIcon} className='send-message-icon' alt='' onClick={() => handleMessage()}/>
          </div>
        </div>







      </div>
    </div>
  );
}

export default App;
