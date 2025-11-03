import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nowakData from "../assets/nowak.json";

export default function StartPage() {
  const [contents, setContents] = useState();
  const navigate = useNavigate();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    setContents(text);
  };

  const handleTest = async () => {
    setContents(nowakData);
    navigate("/quiz", { state: { data: nowakData } });
  };

  return (
    <div className="text-[#343a40]">
      <h1 className="mb-8 ">Quizzler - utrwalanie bazy na studiach</h1>
      <div className="flex items-center justify-center mb-8 gap-x-8">
        <p className="text-xl ">Wczytaj plik</p>
        <input
          type="file"
          accept=".json"
          className="cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
      <div className="flex items-center justify-center gap-8 text-white">
        <button
          onClick={() => {
            navigate("/quiz", { state: { data: JSON.parse(contents) } });
          }}
          className=" bg-[#212529]"
        >
          Rozpocznij quiz
        </button>
        <button className="bg-[#4c6ef5]" onClick={handleTest}>
          Test
        </button>
      </div>
    </div>
  );
}
