import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function QuizPage() {
  const location = useLocation();
  const quizData = location.state?.data || [];
  const [questions, setQuestions] = useState([{ question: "", answers: [] }]);
  // const [questions, setQuestions] = useState([...quizData]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [checkedAnswers, setCheckedAnswers] = useState([]);
  const [showCorrect, setShowCorrect] = useState(false);
  const [questionStates, setQuestionStates] = useState([]);
  const photoDir = "../../public/assets/images/";

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleReset();
    }
  }

  function generateShuffledQuestions(data) {
    return shuffle(data).map((q) => ({
      ...q,
      answers: shuffle(q.answers),
    }));
  }

  function handleReset() {
    const reshuffled = generateShuffledQuestions(quizData);
    setQuestions(reshuffled);
    setCurrentQuestion(0);
    setQuestionStates(
      reshuffled.map((q) => ({
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
        questions.map((q) => ({
          answers: Array(q.answers.length).fill(false),
          showCorrect: false,
        }))
      );
    }
  }, [questions]);

  return (
    <div className="box-border flex flex-col items-center justify-end w-screen h-screen pb-32">
      <div className="text-[#343a40] bg-[#f8f9fa] rounded-xl border-2 px-12 py-8 shadow-lg w-full w-full max-w-4xl flex flex-col items-start justify-between h-[80vh] ">
        <div className="w-full">
          <h2 className="mb-4 text-4xl">
            {questions[currentQuestion].type == "questionPhoto" ? (
              <>
                <p>
                  {currentQuestion + 1}. {questions[currentQuestion].question}
                </p>
                <img
                  src={photoDir + questions[currentQuestion].img}
                  className="max-w-[400px]"
                />
              </>
            ) : (
              <p>
                {currentQuestion + 1}. {questions[currentQuestion].question}
              </p>
            )}
          </h2>

          {questions[currentQuestion].type == "photo" ? (
            <div className="grid grid-cols-2">
              {questions[currentQuestion].answers.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleCheck(index)}
                  className={`flex items-center p-4  ${
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
                  <img src={photoDir + item.img} className="max-w-[400px]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col flex-wrap w-full gap-1 mb-8 shrink-0">
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
          )}
        </div>
        <div className="flex flex-wrap items-center justify-between w-full gap-4 shrink-0">
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
  bgColor = "bg-[#1c7ed6]",
  textColor = "text-white",
  onClick,
}) {
  return (
    <button
      className={` ${bgColor} ${textColor} min-w-[182px] `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
