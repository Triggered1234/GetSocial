import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
type Props = {}

function Account({}: Props) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
      // Check if the user is logged in
      const axiosInstance = axios.create({ withCredentials: true });
  
      axiosInstance.get('http://localhost:3002/check-session')
        .then(response => {
          setLoggedIn(response.data.loggedIn);
        })
        .catch(error => {
          console.error('Error checking session:', error);
        })
        .finally(() => {
          setLoading(false); // Set loading to false in all cases
        });
    }, []);
  
    const handleLogout = async () => {
        try {
          const axiosInstance = axios.create({ withCredentials: true });
    
          const response = await axiosInstance.post('http://localhost:3002/logout');
          if (response.status === 200) {
            setLoggedIn(false);
            navigate('/');
          } else {
            console.error('Logout failed:', response.data.message);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
    return (
    <div><button onClick={handleLogout} className="ml-4">Logout</button></div>
  )
}

export default Account