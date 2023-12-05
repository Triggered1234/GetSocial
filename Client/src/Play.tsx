import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
const Play = ({ history }: any) => {
  const [selectedPack, setSelectedPack] = useState('');
  const navigate = useNavigate();
  const handlePackSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPack(event.target.value);
  };

  const startGameSession = () => {
    if (selectedPack) {
      navigate(`/game-session/${selectedPack}`);
    } else {
      alert('Please select a card pack');
    }
  };

  return (
    <div className='h-screen bg-[#F1EFEF] '>
      <div className='flex justify-center items-center text-center flex-col relative top-8'>
        <h1 className="text-4xl text-gray-500">Select a card pack</h1>
        <select value={selectedPack} onChange={handlePackSelection}>
          <option value=''>Select a pack</option>
          <option value='starter'>Let's get started</option>
        </select>
        <button onClick={startGameSession}>Start Game</button>
      </div>
    </div>
  );
};

export default Play;
