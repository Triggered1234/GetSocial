import React from 'react'
import party from './party.png';
import RegistrationForm from './RegistrationForm';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import bgIndex from './bgIndex.jpg';
import { Link } from 'react-router-dom';
type Props = {}

function IndexMenu({}: Props) {
    const [isLoggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
    <div className='h-screen w-screen overflow-x-hidden overflow-y-hidden flex flex-col'>
        <div className="h-[10%] w-[100%] flex flex-row">
            <div className="h-[100%] w-[50%] bg-black items-center text-center align-middle">
                <h1 className="text-4xl text-gray-500 relative top-[25%]">Latest release</h1>
            </div>
            <div className="h-[100%] w-[50%] bg-[#CCC8AA] items-center text-center align-middle">
        {loading ? (
          <p>Loading...</p>
        ) : (
          isLoggedIn ? (
            <h1 className="text-4xl text-gray-500 relative top-[25%]">Play Now!</h1>
          ) : (
            <h1 className="text-4xl text-gray-500 relative top-[25%]">Create a free account now!</h1>
          )
        )}
      </div>
        </div>
        <div className="h-[80%] w-[100%] flex flex-row">
            <div className="h-[100%] w-[50%] bg-[#CCC8AA] flex items-center justify-center flex-col space-y-6">
                <h1 className="text-gray-500 text-center text-xl">The party pack everyone was waiting for is here! Try it out now!</h1>
                <img src={party} width="227" height="372" className="rounded-lg w-40"></img>
            </div>
            <div className="h-[100%] w-[50%] relative">
          <img src={bgIndex} className="w-[100%] h-[100%] object-cover" alt="Background"></img>
          {loading ? (
            <p>Loading...</p>
          ) : (
            isLoggedIn ? (
              <div className="absolute inset-0 flex flex-col items-center justify-start text-center">
                <h1 className="text-4xl text-white mx-8 relative top-12">
                  What are you waiting for? Start a game session right now!
                </h1>
                <button className="px-8 py-4 rounded-md bg-[#CCC8AA] text-gray-500 mt-12 relative top-32"><Link to="/Play">Play now</Link></button>
              </div>
            ) : (
              <RegistrationForm />
            )
          )}
        </div>
        </div>
        <div className="h-[10%] w-[100%] bg-black flex flex-row">
            <div className="h-[100%] w-[50%] bg-black">

            </div>
            <div className="h-[100%] w-[50%] bg-[#CCC8AA]">
  
            </div>
        </div>
    </div>
  )
}
export default IndexMenu