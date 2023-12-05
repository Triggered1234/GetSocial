import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Props = {}

function RegistrationForm({}: Props) {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setMessage('Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3002/register', {
        username,
        email,
        password,
      });

      console.log(response.data);

      if (response.status === 200 && response.data.success) {
        setMessage('Registration successful');
      } else {
        console.error('Registration failed:', response.data.message);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <form className="text-center space-y-4 relative items-center justify-center top-[25%]">
      <div>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
          className="text-center rounded-full text-black bg-[#CCC8AA] px-[15%] py-[1%] placeholder:text-gray-600"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          className="placeholder:text-gray-600 rounded-full bg-[#CCC8AA] text-black px-[15%] py-[1%] text-center"
          type="email"
          placeholder="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          className="rounded-full placeholder:text-gray-600 bg-[#CCC8AA] text-black px-[15%] py-[1%] text-center"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="relative top-24 rounded-full bg-[#CCC8AA] px-[10%] py-[1%]" type="button" onClick={handleRegister}>Register</button>
      {message && <p className="text-gray-500">{message}</p>}
    </form>
  );
};
 

export default RegistrationForm