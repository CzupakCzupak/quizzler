import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import nowakOne from '../data/nowak1.json';
import nowakTwo from '../data/nowak2.json';

export default function StartPage() {
  const [contents, setContents] = useState(null); // będziemy trzymać już sparsowany JSON
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
    <div className="text-[#343a40] mx-auto">
      <h1 className="mb-8">Quizzler - utrwalanie bazy na studiach</h1>

      <div className="flex items-center justify-center mb-8 gap-x-8">
        <p className="text-xl">Wczytaj plik</p>
        <input
          type="file"
          accept=".json"
          className="cursor-pointer"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-4 text-white">
        {/* start z własnego pliku */}
        <button
          onClick={() => startQuiz(contents)}
          className="bg-[#212529] px-4 py-2 disabled:opacity-50"
          disabled={!contents}
        >
          Rozpocznij quiz z pliku
        </button>

        {/* gotowe bazy */}
        <div className="flex gap-4">
          <button
            className="bg-[#4c6ef5] px-4 py-2"
            onClick={() => startQuiz(nowakOne)}
          >
            Test Nowak 1
          </button>
          <button
            className="bg-[#4c6ef5] px-4 py-2"
            onClick={() => startQuiz(nowakTwo)}
          >
            Test Nowak 2
          </button>
        </div>
      </div>
    </div>
  );
}
