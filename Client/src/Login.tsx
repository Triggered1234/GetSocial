import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import axios from 'axios';
import bgLogin from './components/bgLogin.jpg';
import { useState } from 'react';


type Props = {}


function Logare({}: Props) {
  
  return (
    <div className="h-screen">
      <img src={bgLogin} className="w-[100%] h-[100%] object-cover" alt="Background"></img>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
            <div>
                <Link to="/Meniu" className="text-4xl  text-gray-500" style={{ fontWeight: 'bold' }}>Get Social</Link>
            </div>
            <div className="relative flex flex-col justify-evenly items-center top-24">
                <h1 className="text-l">Log into your account</h1>
                <LoginForm/>
            </div>
        </div>

    </div>
  )
}

export default Logare