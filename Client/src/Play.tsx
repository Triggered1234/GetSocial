import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Header from './components/Header';
const Play = ({ history }: any) => {
  const [selectedPack, setSelectedPack] = useState('');
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const handlePackSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPack(event.target.value);
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = value;
    setPlayerNames(updatedNames);
  };

  const handleRemovePlayer = (index: number) => {
    const updatedNames = [...playerNames];
    updatedNames.splice(index, 1);
    setPlayerNames(updatedNames);
  };

  const handleAddPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const startGameSession = () => {
    if (selectedPack && playerNames.length > 0) {
      navigate(`/game-session/${selectedPack}`, {state: { playerNames } });
    } else {
      alert('Please select a card pack');
    }
  };

  return (
    <div className='h-screen bg-[#F1EFEF] '>
      <Header/>
      <div className='flex justify-center items-center text-center flex-col relative top-8 space-y-4'>
      <h1 className="text-4xl text-gray-500">Enter player names</h1>
        <div className="space-y-2">
          {playerNames.map((name, index) => (
            <div key={index} className="flex flex-row">
              <div className="space-y-2 text-gray-500 space-x-2">
              <input
                type='text'
                value={name}
                placeholder={`Player ${index + 1}`}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="text-center rounded-full text-gray-500"
              />
              <button onClick={() => handleRemovePlayer(index)}>X</button>
              </div>
            </div>
          ))}
          <button onClick={handleAddPlayer}>Add Player</button>
        </div>
        <h1 className="text-4xl text-gray-500">Select a card pack</h1>
        <select value={selectedPack} onChange={handlePackSelection}>
          <option value=''>Select a pack</option>
          <option value='starter'>Let's get started</option>
          <option value='experimental'>Experimental</option>
        </select>
        <button onClick={startGameSession}>Start Game</button>
      </div>
    </div>
  );
};

export default Play;
