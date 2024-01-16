import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import gmstart from './components/gmStart.jpg';
import knowyourfriends from './components/knowyourfriends.jpg';
import deep from './components/deep.jpg';
import couple from './components/couple.jpg';
import party from './components/party.png';
import bgLogin from './components/bgLogin.jpg';

const Play = ({ history }: any) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const navigate = useNavigate();
  const [playerNames, setPlayerNames] = useState<string[]>([]);

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

  const handleCardPackSelection = (selectedPack: string) => {
    if (playerNames.length > 0) {
      navigate(`/game-session/${selectedPack}`, { state: { playerNames } });
    } else {
      alert('Please enter player names first.');
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      className='h-screen bg-[#F1EFEF]'
    >
      <Header />
      <div className='flex justify-center items-center text-center flex-col relative top-8 space-y-4'>
        <h1 className="text-4xl text-gray-500">Enter player names</h1>
        <div className="space-y-2 flex flex-col">
          <div className="flex flex-row space-x-2">
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
          </div>
          <button onClick={handleAddPlayer}>Add Player</button>
        </div>
        <h1 className="text-4xl text-gray-500">Select a card pack</h1>
        <div className="text-2xl text-gray-500 relative flex flex-row items-start justify-center space-x-24 w-[90%] top-8">
          <CardPackLink title="Get started" image={gmstart} onSelect={() => handleCardPackSelection('starter')} />
          <CardPackLink title="My favorite color!?" image={knowyourfriends} onSelect={() => handleCardPackSelection('know_your_friends')} />
          <CardPackLink title="Go deep" image={deep} onSelect={() => handleCardPackSelection('deep')} />
          <CardPackLink title="For lovers" image={couple} onSelect={() => handleCardPackSelection('couples')} />
          <CardPackLink title="Party time" image={party} onSelect={() => handleCardPackSelection('party')} />
        </div>
      </div>
      <button onClick={() => handleCardPackSelection('experimental')}>
      <h1 className="text-4xl absolute bottom-2 right-2 text-gray-500">Experimental</h1>
      </button>
    </div>
  );
};

interface CardPackLinkProps {
  title: string;
  image: string;
  onSelect: () => void;
}

const CardPackLink: React.FC<CardPackLinkProps> = ({ title, image, onSelect }) => {
  return (
    <div className="w-64 relative flex flex-col items-center justify-between text-center space-y-2">
      <h1 className="text-xl mb-4">{title}</h1>
      <div className="items-center justify-center">
        <button onClick={onSelect}>
          <img src={image} width="227" height="372" className="relative rounded-lg w-36" alt={title} />
        </button>
      </div>
    </div>
  );
};


export default Play;
