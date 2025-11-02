import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StartPage() {
  const [contents, setContents] = useState();
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    setContents(text);
  };

  return (
    <div className="text-[#343a40]">
      <h1 className=" mb-8">Quizzler - utrwalanie bazy na studiach</h1>
      <div className="flex items-center gap-x-8 justify-center  mb-8">
        <p className=" text-xl">Wczytaj plik</p>
        <input
          type="file"
          accept=".json"
          className="cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
      <button
        onClick={() => {
          navigate("/quiz", { state: { data: JSON.parse(contents) } });
        }}
        className="text-white mb-4 bg-[#212529]"
      >
        Rozpocznij quiz
      </button>
    </div>
  );
}
