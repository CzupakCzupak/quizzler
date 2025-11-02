import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const quizData = location.state?.data || [];
  //   const [questions, setQuestions] = useState([{ question: "", answers: [] }]);
  const [questions, setQuestions] = useState([...quizData]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [showCorrect, setShowCorrect] = useState(false);
  const [questionStates, setQuestionStates] = useState([]);

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function handleCheck(index) {
    setQuestionStates((prev) => {
      const updated = [...prev];
      const qState = { ...updated[currentQuestion] };
      const newAnswers = [...qState.answers];
      newAnswers[index] = !newAnswers[index];
      updated[currentQuestion] = { ...qState, answers: newAnswers };
      return updated;
    });
  }
  function handleCorrectAnswer() {
    setQuestionStates((prev) => {
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
    if (currentQuestion < questions.length - 1)
      setCurrentQuestion(currentQuestion + 1);
  }

  //   useEffect(() => {
  //     if (quizData?.length > 0) {
  //         const shuffledQuestions = shuffle(quizData).map((q) => ({
  //           ...q,
  //           answers: shuffle(q.answers),
  //         }));

  //       setQuestions(shuffledQuestions);
  //     }
  //   }, [quizData]);

  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStates(
        questions.map((q) => ({
          answers: Array(q.answers.length).fill(false),
          showCorrect: false,
        }))
      );
    }
  }, [questions]);

  return (
    <div className="text-[#343a40] bg-[#f8f9fa] rounded-xl border-2 px-12 py-8 shadow-lg w-full min-w-4xl flex flex-col items-start">
      <h2 className="text-4xl mb-4">
        {currentQuestion + 1}. {questions[currentQuestion].question}
      </h2>
      <div className="flex flex-col w-full gap-1  mb-8">
        {questions[currentQuestion].answers.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCheck(index)}
            className={`flex items-center p-4 w-full ${
              questionStates[currentQuestion]?.showCorrect && item.correct
                ? "bg-[#8ce99a]"
                : "hover:bg-[#e9ecef]"
            }`}
          >
            <input
              type="checkbox"
              checked={!!questionStates[currentQuestion]?.answers[index]}
              readOnly
              className="mr-3"
            />
            <p>{item.text}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center w-full justify-between">
        <NextPrev onClick={handlePrev}>Poprzednie pytanie</NextPrev>
        <NextPrev bgColor="bg-[#40c057]" onClick={handleCorrectAnswer}>
          Sprawdź odpowiedź
        </NextPrev>
        <NextPrev onClick={handleNext}>Następne pytanie</NextPrev>
      </div>
    </div>
  );
}
function NextPrev({ children, bgColor = "bg-[#1c7ed6]", onClick }) {
  return (
    <button className={`text-white ${bgColor} min-w-[182px]`} onClick={onClick}>
      {children}
    </button>
  );
}
