import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

type RouteState = {
  playerNames: string[];
};

const GameSession = () => {
  const { selectedPack } = useParams<{ selectedPack: string }>();
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [backgroundColors] = useState<string[]>(['#F1EFEF', '#f77676', '#b6f776', '#76c4f7']);
  const [currentBackgroundColorIndex, setCurrentBackgroundColorIndex] = useState<number>(0);

  const location = useLocation();
  const routeState = location.state as RouteState;
  const playerNames: string[] = routeState ? routeState.playerNames : []; // Get player names from route state

  useEffect(() => {
    const fetchCards = async () => {
      try {
        if (selectedPack === 'experimental') {
          try {
            const response = await fetch('http://localhost:3002/fetch-experimental-cards');
            const data = await response.json();
        
            if (data.success) {
              const cards: string[] = data.cards.map((card: string) => replacePlaceholdersWithRandomNames(card, playerNames));
              setSelectedCards(cards);
              console.log('Experimental Cards fetched:', cards);
            } else {
              alert('Failed to fetch experimental cards');
            }
          } catch (error) {
            console.error('Error fetching experimental cards:', error);
            alert('Failed to fetch experimental cards');
          }
        }else {
          const response = await fetch(`http://localhost:3002/fetch-cards?pack=${selectedPack}`);
          const data = await response.json();
  
          if (data.success) {
            const cards: string[] = data.cards.map((card: string) => replacePlaceholdersWithRandomNames(card, playerNames));
            setSelectedCards(cards);
            console.log('Cards fetched:', cards);
          } else {
            alert('Failed to fetch cards');
          }
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
        alert('Failed to fetch cards');
      }
    };
  
    fetchCards();
  }, [selectedPack, playerNames]);

  const replacePlaceholdersWithRandomNames = (card: string, names: string[]): string => {
    let modifiedCard: string = card;
    const placeholderRegex = /\[Name\]/g; // Define a regex pattern to match all occurrences of [Name]
    const placeholders = modifiedCard.match(placeholderRegex) || []; // Get all placeholders in the card
    const shuffledNames = shuffleArray(names); // Shuffle the array of names
  
    placeholders.forEach((placeholder) => {
      const randomIndex = Math.floor(Math.random() * shuffledNames.length);
      modifiedCard = modifiedCard.replace(placeholder, shuffledNames[randomIndex] || '');
    });
  
    return modifiedCard;
  };
  
  // Function to shuffle array elements
  const shuffleArray = (array: any[]): any[] => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };
  
  

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
            <Link to="/" className='absolute bottom-4 left-4 text-xl'>Go Back</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSession;
