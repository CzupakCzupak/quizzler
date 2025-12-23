import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const quizData = location.state?.data || navigate('/');

  const [questions, setQuestions] = useState([{ question: '', answers: [] }]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [showCorrect, setShowCorrect] = useState(false);
  const [questionStates, setQuestionStates] = useState([]);
  const photoDir = '../assets/images/';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleCheck(index) {
    setQuestionStates(prev => {
      const updated = [...prev];
      const qState = { ...updated[currentQuestion] };
      const newAnswers = [...qState.answers];
      newAnswers[index] = !newAnswers[index];
      updated[currentQuestion] = { ...qState, answers: newAnswers };
      return updated;
    });
  }

  function handleCorrectAnswer() {
    setQuestionStates(prev => {
      const updated = [...prev];
      const qState = { ...updated[currentQuestion], showCorrect: true };
      updated[currentQuestion] = qState;
      return updated;
    });
  }

  function resetQuestionState() {
    setShowCorrect(false);
    setCheckedAnswers([]);
  }

  function handlePrev() {
    resetQuestionState();
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1);
  }

  function handleNext() {
    resetQuestionState();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleReset();
    }
  }

  function generateShuffledQuestions(data) {
    return shuffle(data).map(q => ({
      ...q,
      answers: shuffle(q.answers),
    }));
  }

  function handleReset() {
    const reshuffled = generateShuffledQuestions(quizData);
    setQuestions(reshuffled);
    setCurrentQuestion(0);
    setQuestionStates(
      reshuffled.map(q => ({
        answers: Array(q.answers.length).fill(false),
        showCorrect: false,
      }))
    );
  }

  useEffect(() => {
    if (quizData?.length > 0) {
      const shuffled = generateShuffledQuestions(quizData);
      setQuestions(shuffled);
    }
  }, [quizData]);

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStates(
        questions.map(q => ({
          answers: Array(q.answers.length).fill(false),
          showCorrect: false,
        }))
      );
    }
  }, [questions]);

  useEffect(() => {
    function handlePress(event) {
      event.preventDefault();

      if (event.key === 'Enter') {
        handleCorrectAnswer();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      }
    }

    window.addEventListener('keydown', handlePress);
    return () => window.removeEventListener('keydown', handlePress);
  }, [currentQuestion]);

  const current = questions[currentQuestion] || { question: '', answers: [] };
  const currentState = questionStates[currentQuestion] || {
    answers: [],
    showCorrect: false,
  };

  return (
    <div className="min-h-screen w-full bg-[#e9ecef] flex items-center justify-center px-2 py-4 sm:px-4 sm:py-8">
      <div className="text-[#343a40] bg-[#f8f9fa] rounded-xl border-2 border-[#dee2e6] shadow-lg w-full max-w-4xl flex flex-col justify-between gap-6 min-h-[70vh] px-4 py-4 sm:px-8 sm:py-6 lg:px-12 lg:py-8">
        {/* Pytanie + ewentualne zdjęcie */}
        <div className="w-full">
          <h2 className="mb-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">
            {current.type === 'questionPhoto' ? (
              <>
                <p className="text-left">
                  {currentQuestion + 1}. {current.question}
                </p>
                <img
                  src={photoDir + current.img}
                  className="w-full max-w-xs mx-auto mt-4 rounded-lg sm:max-w-sm md:max-w-md"
                />
              </>
            ) : (
              <p className="text-left">
                {currentQuestion + 1}. {current.question}
              </p>
            )}
          </h2>

          {/* Odpowiedzi */}
          {current.type === 'photo' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {current.answers.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCheck(index)}
                  className={`flex flex-col items-center p-3 rounded-lg cursor-pointer border border-transparent transition-colors ${
                    currentState.showCorrect && item.correct
                      ? 'bg-[#8ce99a]'
                      : 'hover:bg-[#e9ecef]'
                  }`}
                >
                  <div className="flex items-center w-full mb-2">
                    <input
                      type="checkbox"
                      checked={!!currentState.answers[index]}
                      readOnly
                      className="w-4 h-4 mr-3"
                    />
                    <span className="text-sm text-left">
                      Odpowiedź {index + 1}
                    </span>
                  </div>
                  <img
                    src={photoDir + item.img}
                    className="object-contain w-full rounded-md max-h-64"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full gap-2 mb-4">
              {current.answers.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCheck(index)}
                  className={`flex items-center p-3 w-full rounded-lg cursor-pointer transition-colors ${
                    currentState.showCorrect && item.correct
                      ? 'bg-[#8ce99a]'
                      : 'hover:bg-[#e9ecef]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!currentState.answers[index]}
                    readOnly
                    className="w-4 h-4 mr-3"
                  />
                  <p className="text-sm text-left sm:text-base">{item.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Przyciski nawigacji */}
        <div className="flex flex-col w-full gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
          <Button onClick={handlePrev}>Poprzednie pytanie</Button>
          <Button
            bgColor="bg-[#ced4da]"
            textColor="text-black"
            onClick={handleReset}
          >
            Resetuj
          </Button>
          <Button bgColor="bg-[#40c057]" onClick={handleCorrectAnswer}>
            Sprawdź odpowiedź
          </Button>
          <Button onClick={handleNext}>Następne pytanie</Button>
        </div>
      </div>
    </div>
  );
}

function Button({
  children,
  bgColor = 'bg-[#1c7ed6]',
  textColor = 'text-white',
  onClick,
  onKeyDown,
}) {
  return (
    <button
      className={`${bgColor} ${textColor} w-full sm:flex-1 sm:min-w-[160px] text-sm sm:text-base px-4 py-2 rounded-md font-medium transition-colors`}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {children}
    </button>
  );
}
