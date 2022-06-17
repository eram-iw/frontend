import React from 'react';
import {Routes,Route} from 'react-router-dom'
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='' element={<HomePage/>}/>
        <Route path='chats' element={<ChatPage/>}/>
        <Route path='*' element={<h1>404!!! Page Not Foundd!!!</h1>}/>
      </Routes>
    </div>
  );
}

export default App;
