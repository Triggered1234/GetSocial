import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import bgLogin from './components/bgLogin.jpg';

interface Question {
  id: number;
  card_text: string;
}

interface PreCheckQuestion {
  id: number;
  card_text: string;
}

interface Review {
  id: number;
  card_text: string;
  status: number;
}

interface Props {
  // Define your props here if needed
}

const Account: React.FC<Props> = ({}) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [preCheckQuestions, setPreCheckQuestions] = useState<PreCheckQuestion[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCardPack, setSelectedCardPack] = useState<string>('');
  const [editedQuestion, setEditedQuestion] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false); 
  const [selectedApproveId, setSelectedApproveId] = useState<number | null>(null);
  const [showReviewQuestions, setShowReviewQuestions] = useState<boolean>(false);
  const [showQuestionRequests, setShowQuestionRequests] = useState<boolean>(false);
  const [showPreCheckQuestions, setShowPreCheckQuestions] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newRequestQuestion, setNewRequestQuestion] = useState<string>('');
  const [showAddNewQuestion, setShowAddNewQuestion] = useState<boolean>(false);
  const [showRequestQuestion, setShowRequestQuestion] = useState<boolean>(false);  // New state to toggle displaying the input and dropdown
  const [selectedNewQuestionCardPack, setSelectedNewQuestionCardPack] = useState<string>('');
  const [selectedPreCheckQuestion, setSelectedPreCheckQuestion] = useState<PreCheckQuestion | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const axiosInstance = axios.create({ withCredentials: true });

    axiosInstance.get('http://localhost:3002/check-session')
      .then(response => {
        setLoggedIn(response.data.loggedIn);
        setIsAdmin(response.data.user.is_admin === 1);
        setUserId(response.data.user.ID);
        fetchUserReviews();
        if (response.data.user.is_admin === 1) {
          preFetchSubmittedQuestions();
          fetchSubmittedQuestions();
        }
      })
      .catch(error => {
        console.error('Error checking session:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const preFetchSubmittedQuestions = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.get('http://localhost:3002/pre-fetch-submitted-questions');

      if (response.status === 200) {
        setPreCheckQuestions(response.data.questions as PreCheckQuestion[]);
      } else {
        console.error('Failed to fetch submitted questions');
      }
    } catch (error) {
      console.error('Error fetching submitted questions:', error);
    }
  };

  const fetchSubmittedQuestions = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.get('http://localhost:3002/fetch-submitted-questions');

      if (response.status === 200) {
        setQuestions(response.data.questions as Question[]);
      } else {
        console.error('Failed to fetch submitted questions');
      }
    } catch (error) {
      console.error('Error fetching submitted questions:', error);
    }
  };

  const fetchUserReviews = async () => {
    try {
      const response = await axios.get<{ reviews: Review[] }>('http://localhost:3002/user-reviews', {
        params: { userId }, // Sending the userId as a query parameter
        withCredentials: true,
      });
      setReviews(response.data.reviews);
      console.log('Reviews:', response.data.reviews); // Log fetched reviews to confirm
    } catch (error) {
      console.error('Error fetching user reviews:', error);
    }
  };
  

  const handlePreApprove = async (questionId: number) => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });

      const response = await axiosInstance.post('http://localhost:3002/pre-approve-question', {
        questionId, // Pass the questionId to the API endpoint
      });

      if (response.status === 200) {
        preFetchSubmittedQuestions();
        console.log('Question pre-approved for further review!');
        // Add logic here to update UI if needed
      } else {
        console.error('Failed to pre-approve the question');
        // Handle failure scenario
      }
    } catch (error) {
      console.error('Error pre-approving the question:', error);
      // Handle error scenario
    }
  };

  const handleApprove = async (questionId: number) => {
    if (selectedApproveId === questionId && showDropdown) {
      if (!selectedCardPack) {
        alert('Please select a card pack.');
        return;
      }

      try {
        const axiosInstance = axios.create({ withCredentials: true });
        const response = await axiosInstance.post('http://localhost:3002/approve-question', {
          questionId,
          cardPack: selectedCardPack,
          editedQuestion,
        });

        if (response.status === 200) {
          fetchSubmittedQuestions();
          setShowDropdown(false);
          setSelectedApproveId(null);
        } else {
          console.error('Failed to approve the question');
        }
      } catch (error) {
        console.error('Error approving the question:', error);
      }
    } else {
      setSelectedApproveId(questionId);
      setShowDropdown(true);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.post('http://localhost:3002/edit-question', {
        questionId: selectedQuestion?.id,
        newText: editedQuestion,
      });

      if (response.status === 200) {
        preFetchSubmittedQuestions();
        fetchSubmittedQuestions();
        setEditedQuestion('');
        setSelectedQuestion(null);
      } else {
        console.error('Failed to edit the question');
      }
    } catch (error) {
      console.error('Error editing the question:', error);
    }
  };

  const handleSubmitPreCheckEdit = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.post('http://localhost:3002/edit-question', {
        questionId: selectedPreCheckQuestion?.id,
        newText: editedQuestion,
      });

      if (response.status === 200) {
        preFetchSubmittedQuestions();
        // Fetch and update pre-check questions after edit
        fetchSubmittedQuestions();
        setEditedQuestion('');
        setSelectedPreCheckQuestion(null);
      } else {
        console.error('Failed to edit the pre-check question');
      }
    } catch (error) {
      console.error('Error editing the pre-check question:', error);
    }
  };

  const handleReject = async (questionId: number) => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.post('http://localhost:3002/reject-question', {
        questionId,
      });
  
      if (response.status === 200) {
        preFetchSubmittedQuestions();
        fetchSubmittedQuestions(); // Refresh the list after deletion
      } else {
        console.error('Failed to reject the question');
      }
    } catch (error) {
      console.error('Error rejecting the question:', error);
    }
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setEditedQuestion(question.card_text);
    setShowDropdown(false);
    setSelectedApproveId(null);
  };

  const handlePreCheckEdit = (question: PreCheckQuestion) => {
    setSelectedPreCheckQuestion(question);
    setEditedQuestion(question.card_text); 
    setShowDropdown(false);
    setSelectedApproveId(null);
  };

  const handleAddQuestion = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      const response = await axiosInstance.post('http://localhost:3002/add-question', {
        card_text: newQuestion,
        card_pack: selectedNewQuestionCardPack, // Include selected card pack when adding the question
      });

      if (response.status === 200) {
        preFetchSubmittedQuestions();
        setNewQuestion('');
        setSelectedNewQuestionCardPack('');
        setShowAddNewQuestion(false); // Hide the input and dropdown after adding
      } else {
        console.error('Failed to add the question');
      }
    } catch (error) {
      console.error('Error adding the question:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });

      const response = await axiosInstance.post('http://localhost:3002/logout');
      if (response.status === 200) {
        setLoggedIn(false);
        setIsAdmin(false);
        navigate('/');
      } else {
        console.error('Logout failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRequestQuestion = async () => {
    try {
      const axiosInstance = axios.create({ withCredentials: true });
      console.log('Request Payload:', { userId, newRequestQuestion });
      const response = await axiosInstance.post('http://localhost:3002/request-question', {
        userId: userId, // Include the stored user ID in the request payload
        question: newRequestQuestion,
      });

      if (response.status === 200) {
        console.log('Question request sent!');
        fetchUserReviews();
        setNewQuestion('');
      } else {
        console.error('Failed to send question request');
      }
    } catch (error) {
      console.error('Error sending question request:', error);
    }
  };

  const getStatusLabel = (status: number): string => {
    switch (status) {
      case 0:
        return 'Sent for Pre-Check';
      case 1:
        return 'Sent to Experimental Game Mode';
      default:
        return 'Sent for Final Review';
    }
  };
  

  return (
    <div style={{ backgroundImage: `url(${bgLogin})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} className="bg-[#F1EFEF] h-screen">
      <Header />
      <div className="flex flex-col space-y-2 justify-between items-center relative top-12 text-center">
      {isAdmin && (
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl pb-4">Welcome to your admin panel!</h1>

            <button className="text-xl p-1 rounded-full bg-slate-400" onClick={() => setShowPreCheckQuestions(!showPreCheckQuestions)}>
              {showPreCheckQuestions ? 'Hide Pre-Check Questions' : 'Pre-Check Questions'}
            </button>
            {showPreCheckQuestions && (
      <div className="space-y-2 items-center justify-center flex flex-col">
        <div>
          {preCheckQuestions.map((preCheckQuestion) => (
            <div key={preCheckQuestion.id}>
              <p>{preCheckQuestion.card_text}</p>
              <div className="flex flex-row space-x-2 justify-center items-center text-center">
                <button className="p-1 rounded-full bg-slate-300" onClick={() => handlePreApprove(preCheckQuestion.id)}>
                  {selectedApproveId === preCheckQuestion.id && showDropdown ? 'Confirm' : 'Approve'}
                </button>
                <button className="p-1 rounded-full bg-slate-300" onClick={() => handleReject(preCheckQuestion.id)}>Reject</button>
                <button className="p-1 rounded-full bg-slate-300" onClick={() => handlePreCheckEdit(preCheckQuestion)}>Edit</button>
                {selectedPreCheckQuestion && selectedPreCheckQuestion.id === preCheckQuestion.id && (
                  <input
                    className="text-center rounded-full px-12"
                    type="text"
                    placeholder="Edit question"
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                  />
                )}
                {/* Submit edit button for pre-check questions */}
                {selectedPreCheckQuestion && selectedPreCheckQuestion.id === preCheckQuestion.id && (
                  <button className="p-1 rounded-full bg-slate-300" onClick={handleSubmitPreCheckEdit}>Submit Edit</button>
                )}
              </div>
            </div>
          ))}
                </div>
              </div>
            )}

            <button className="text-xl p-1 rounded-full bg-slate-400" onClick={() => setShowReviewQuestions(!showReviewQuestions)}>
              {showReviewQuestions ? 'Hide Review Questions' : 'Review Questions'}
            </button>
            {showReviewQuestions && (
              <div className="space-y-2 items-center justify-center flex flex-col">
                <div>
                  {questions.map((question) => (
                    <div key={question.id}>
                      <p>{question.card_text}</p>
                      <div className="flex flex-row space-x-2 justify-center items-center text-center">                 
                        <button className="p-1 rounded-full bg-slate-300" onClick={() => handleApprove(question.id)}>
                          {selectedApproveId === question.id && showDropdown ? 'Confirm' : 'Approve'}
                        </button>
                        <button className="p-1 rounded-full bg-slate-300" onClick={() => handleReject(question.id)}>Reject</button>
                        <button className="p-1 rounded-full bg-slate-300" onClick={() => handleEdit(question)}>Edit</button>
                        {selectedQuestion && selectedQuestion.id === question.id && (
                          <input
                            className="text-center rounded-full px-12"
                            type="text"
                            placeholder="Edit question"
                            value={editedQuestion}
                            onChange={(e) => setEditedQuestion(e.target.value)}
                          />
                        )}
                        {showDropdown && selectedApproveId === question.id && (
                          <select value={selectedCardPack} onChange={(e) => setSelectedCardPack(e.target.value)}>
                            <option value="">Select Card Pack</option>
                            <option value="starter">Starter</option>
                            <option value="know_your_friends">Know Your Friends</option>
                            <option value="deep">Deep</option>
                            <option value="couples">Couples</option>
                            <option value="party">Party</option>
                          </select>
                        )}
                        {selectedQuestion && selectedQuestion.id === question.id && (
                          <button className="p-1 rounded-full bg-slate-300" onClick={handleSubmitEdit}>Submit Edit</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="text-xl p-1 rounded-full bg-slate-400" onClick={() => setShowAddNewQuestion(!showAddNewQuestion)}>
              {showAddNewQuestion ? 'Hide Add New Question' : 'Add New Question'}
            </button>
            {showAddNewQuestion && (
              <div className="space-y-2 items-center justify-center flex flex-col">
                <input
                  className="text-center rounded-full px-32 py-2"
                  type="text"
                  placeholder="Add New Question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                />
                {/* Dropdown for selecting card pack */}  
                <select value={selectedNewQuestionCardPack} onChange={(e) => setSelectedNewQuestionCardPack(e.target.value)}>
                  <option value="">Select Card Pack</option>
                  <option value="starter">Starter</option>
                  <option value="know_your_friends">Know Your Friends</option>
                  <option value="deep">Deep</option>
                  <option value="couples">Couples</option>
                  <option value="party">Party</option>
                </select>
                {/* Button to add the new question */}
                <button className="p-1 rounded-full bg-slate-300" onClick={handleAddQuestion}>Add Question</button>
              </div>
            )}
          </div>
        )}
        {!isAdmin && (
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl">Welcome to your user control panel!</h1>
            <button className="text-xl p-1 rounded-full bg-slate-400" onClick={() => setShowRequestQuestion(!showRequestQuestion)}>
              {showRequestQuestion ? 'Hide Request a question' : 'Request a question'}
            </button>
            {showRequestQuestion && (
              <div className="space-y-2 items-center justify-center flex flex-col">
                <input
                  className="text-center rounded-full px-12"
                  type="text"
                  placeholder="Add New Question"
                  value={newRequestQuestion}
                  onChange={(e) => setNewRequestQuestion(e.target.value)}
                />
                <button className="p-1 rounded-full bg-slate-300" onClick={handleRequestQuestion}>Add Question</button>
              </div>
            )}

<button className="text-xl p-1 rounded-full bg-slate-400" onClick={() => setShowQuestionRequests(!showQuestionRequests)}>
              {showQuestionRequests ? 'Hide your question requests status' : 'Show your question requests status'}
            </button>
            {showQuestionRequests && (
              <ul className="h-[250px] w-[100%] overflow-y-auto bg-slate-300 rounded-md">
              {reviews.map((review) => (
                <li key={review.id}>
                  Review: {review.card_text} - Status: {getStatusLabel(review.status)}
                </li>
              ))}
            </ul>
            )}
          </div>
        )}
      </div>
      <button onClick={handleLogout} className="absolute right-2 bottom-2 rounded-md text-xl text-gray-500 p-2">Logout</button>
    </div>
  );
}

export default Account;
