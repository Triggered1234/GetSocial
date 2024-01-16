import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Login from './Login';
import Account from './Account';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Play from './Play';
import GameSession from './GameSession';
import ResetPassword from './ResetPassword'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <BrowserRouter>
        <Routes>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path="/" element={<App/>}> </Route>
        <Route path="/Account" element={<Account/>}></Route>
        <Route path="/Play" element={<Play/>}></Route>
        <Route path="/ResetPassword" element={<ResetPassword/>}></Route>
        <Route path="/game-session/:selectedPack" element={<GameSession />} />
        </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
