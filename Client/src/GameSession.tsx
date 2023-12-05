import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import  { Link } from 'react-router-dom';

const GameSession = () => {
  const { selectedPack } = useParams<{ selectedPack: string }>();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [backgroundColors] = useState<string[]>([
    '#F1EFEF', '#f77676', '#b6f776', '#76c4f7'
  ]);
  const [currentBackgroundColorIndex, setCurrentBackgroundColorIndex] = useState<number>(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:3002/fetch-cards?pack=${selectedPack}`);
        const data = await response.json();

        if (data.success) {
          const cards: string[] = data.cards;
          setSelectedCards(cards);
          console.log('Cards fetched:', cards);
        } else {
          alert('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        alert('Failed to fetch cards');
      }
    };

    fetchCards();
  }, [selectedPack]);

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => prevIndex + 1);

    if (currentBackgroundColorIndex < backgroundColors.length - 1) {
      setCurrentBackgroundColorIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentBackgroundColorIndex(0); 
    }
  };

  return (
    <div className='h-screen' style={{ backgroundColor: backgroundColors[currentBackgroundColorIndex] }}>
      <div className='flex flex-col h-full justify-center items-center text-center'>
        <h1 className='relative text-4xl top-4'>Get Social</h1>
        {selectedCards.length > 0 && (
          <div className='flex items-center justify-center h-full'>
            <h1 className='text-4xl'>{selectedCards[currentCardIndex]}</h1>
            {currentCardIndex < selectedCards.length - 1 && (
              <button className='absolute bottom-4 right-4 text-xl' onClick={handleNextCard}>Next</button>
            )}
            <Link to="/Play" className='absolute bottom-4 left-4 text-xl'>Go Back</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSession;
