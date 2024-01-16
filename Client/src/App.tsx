import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Welcome from './components/Welcome';
import About from './components/About';
import Description from './components/Description';
import CardPacks from './components/CardPacks';
import IndexMenu from './components/IndexMenu';
import Login from './Login';
import bgHome from './components/homeBackground.jpg';
import {BrowserRouter, Routes, Route} from "react-router-dom";
function App() {
  return (
    
    <div className="overflow-hidden">
    <div style={{ backgroundImage: `url(${bgHome})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      className='h-screen w-screen overflow-x-hidden'>
    <Header/>
    <Welcome/>
    </div>
    <section id="about">
    <div className='bg-[#CCC8AA] h-screen w-screen overflow-x-hidden overflow-y-hidden'>
      <About/>
    </div>
    <div className='bg-[#191717] h-screen w-screen overflow-x-hidden overflow-y-hidden'>
      <Description/>
    </div>
    </section>
    <div className='bg-[#e4e4e4] h-screen w-screen overflow-x-hidden overflow-y-hidden'>
      <CardPacks/>
    </div>
    <IndexMenu/>
    </div>
  );
}

export default App;
