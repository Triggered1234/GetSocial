import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { once } from 'events'
import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
type Props = {}

function Header({}: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {

    const axiosInstance = axios.create({ withCredentials: true });

    axiosInstance.get('http://localhost:3002/check-session')
      .then(response => {
        setLoggedIn(response.data.loggedIn);
      })
      .catch(error => {
        console.error('Error checking session:', error);
      })
      .finally(() => {
        setLoading(false); 
      });
  }, []);

  return (
    <div>
 <motion.div 
 initial={{
  x:-5000
 }}
 transition={{
  duration: 2,
  repeat: 0,
  type: "spring"
 }}
 animate={{
  x:0
 }}
 className="relative flex flex-row md:flex-row text-center md:text-left
       px-10 justify-between mx-28 items-center overflow-hidden xl:flex-row top-5  py-1">
    <div>
    <a href="/" className='text-xl text-gray-500'>Home</a>
    </div>
    <div>
    <Link to="/Play" className="text-xl text-gray-500">Play</Link>
    </div>
    <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            loggedIn ? (
              <>
                <Link to="/Account" className="text-xl text-gray-500">Account</Link>
              </>
            ) : (
              <Link to="/Login" className="text-xl text-gray-500">Login</Link>
            )
          )}
        </div>
  </motion.div>
  </div>
  )
}

export default Header