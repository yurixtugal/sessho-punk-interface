import Home from './views/home/Home.js'
import {Route,Routes} from 'react-router-dom'
import MainLayout from './layout/main/index.js';
import Punks from './views/Punks';
import Punk from './views/Punk';
import React from 'react';

function App() {

  
  return (
    <React.StrictMode>
      <MainLayout>
        <Routes>
          <Route path="/" exact element={<Home/>}/>
          <Route path="/Punks" exact element={<Punks/>}/>
          <Route path="/Punks/:tokenId" exact element={<Punk/>}/>
        </Routes>
      </MainLayout> 
    </React.StrictMode> 
  );
} 

export default App;
