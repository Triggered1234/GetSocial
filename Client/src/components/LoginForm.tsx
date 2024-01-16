import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState(''); // State to hold reCAPTCHA token


  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3002/login',
        {
          email,
          password,
          captchaToken,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json', 
          },
        }
      );

      console.log('Login response:', response.data);

      if (response.status === 200 && response.data.success) {

        const checkSessionResponse = await axios.get('http://localhost:3002/check-session', {
          withCredentials: true,
        });

        console.log('Check session response:', checkSessionResponse.data);

        if (checkSessionResponse.data.loggedIn) {

          navigate('/');
        } else {
          console.error('Login failed:', 'User not logged in');
        }
      } else {
        console.error('Login failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setCaptchaToken(token);
    }
  };

  const handleForgotPassword = async () => {
    try {
      // Send a request to the server to initiate the password reset process
      const response = await axios.post(
        'http://localhost:3002/forgot-password',
        { email },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Forgot Password response:', response.data);

      if (response.status === 200 && response.data.success) {
        alert('Password reset link sent to your email address.');
      } else {
        console.error('Forgot Password failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className="items-center">
      <form className="text-center">
        <div className="py-4">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center rounded-full"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center rounded-full"
          />
        </div>

        <div className="relative top-2">
          <ReCAPTCHA
            sitekey="6LdB9kQpAAAAAJLjP10Fw0rEa-3UxuvvDSzzBHJ1"
            onChange={handleRecaptchaChange}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button className="text-center py-2 px-8 bg-white rounded-md text-l relative top-12" type="button" onClick={handleLogin}>
            Login
          </button>

          <button
            className="text-center py-2 px-4 bg-white rounded-md text-l relative top-12"
            type="button"
            >
              <Link to="/ResetPassword">
            Forgot Password
            </Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;