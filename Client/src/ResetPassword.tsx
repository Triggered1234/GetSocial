import React, { useState } from 'react';
import axios from 'axios';
import bgLogin from './components/bgLogin.jpg';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetPassword = async () => {
    try {
      if (!email || !password || !confirmPassword) {
        console.error('Email, password, and confirmPassword are required.');
        return;
      }

      if (password !== confirmPassword) {
        console.error('Password and confirmPassword do not match.');
        return;
      }

      // Send a request to the server to reset the password
      const response = await axios.post(
        'http://localhost:3002/reset-password',
        { email, newPassword: password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Reset Password response:', response.data);

      if (response.status === 200 && response.data.success) {
        alert('Password reset link sent to your email!');
        // Redirect to login or another page after successful password reset
      } else {
        console.error('Password reset failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} className="items-center h-screen">
      <form className="text-center relative top-72">
        <div className="py-4">
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center rounded-full"
          />
        </div>
        <div className="py-4">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-center rounded-full"
          />
        </div>
        <div>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-center rounded-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <button
            className="text-center py-2 px-8 rounded-md text-l relative top-12"
            type="button"
            onClick={handleResetPassword}
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
