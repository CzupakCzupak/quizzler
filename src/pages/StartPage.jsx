import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nowakOne from '../data/nowak1.json';
import nowakTwo from '../data/nowak2.json';

export default function StartPage() {
  const [contents, setContents] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const json = JSON.parse(text);
      setContents(json);
    } catch (err) {
      console.error('Niepoprawny JSON:', err);
      alert('Plik nie jest poprawnym JSON-em');
    }
  };

  const startQuiz = data => {
    if (!data) return;
    navigate('/quiz', { state: { data } });
  };

  return (
    <div className="min-h-screen w-full bg-[#e9ecef] flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-md border border-[#dee2e6] px-6 py-6 sm:px-8 sm:py-8 text-[#343a40]">
        <h1 className="mb-8 text-2xl font-semibold text-center sm:text-3xl">
          Quizzler - utrwalanie bazy na studiach
        </h1>

        <div className="flex flex-col items-center gap-3 mb-8 sm:flex-row sm:justify-center sm:gap-6">
          <p className="text-base sm:text-xl">Wczytaj plik</p>
          <input
            type="file"
            accept=".json"
            className="max-w-full text-sm cursor-pointer"
            onChange={handleFileChange}
          />
        </div>

        <div className="flex flex-col items-stretch justify-center gap-4 text-white sm:items-center">
          <button
            onClick={() => startQuiz(contents)}
            className="bg-[#212529] px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-64"
            disabled={!contents}
          >
            Rozpocznij quiz z pliku
          </button>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <button
              className="bg-[#4c6ef5] px-4 py-2 rounded-md w-full sm:w-40"
              onClick={() => startQuiz(nowakOne)}
            >
              Test Nowak 1
            </button>
            <button
              className="bg-[#4c6ef5] px-4 py-2 rounded-md w-full sm:w-40"
              onClick={() => startQuiz(nowakTwo)}
            >
              Test Nowak 2
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
