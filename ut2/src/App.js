import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";

export default function App() {
  const [selectedOption, setSelectedOption] = useState("");
  const [hoveredOption, setHoveredOption] = useState(null);
  const [hoverPosition, setHoverPosition] = useState("left");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const imageData = [
    { image: "dog_1.gif", text: "This is image 1" },
    { image: "dog_2.gif", text: "This is image 2" },
    { image: "dog_1.gif", text: "This is image 3" },
  ];


  const handleNextClick = () => {
    if (selectedOption) {
      const newResponses = [
        ...responses,
        { index: currentIndex + 1, text: imageData[currentIndex].text, choice: selectedOption },
      ];
      setResponses(newResponses);
      setSelectedOption("");
      
      if (currentIndex + 1 < imageData.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsCompleted(true);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }
  };

  const handleEndClick = () => {
    if (selectedOption) {
      const finalResponses = [
        ...responses,
        { index: currentIndex + 1, text: imageData[currentIndex].text, choice: selectedOption },
      ];
      setResponses(finalResponses);
  
      // 상태 업데이트 후 엑셀 파일 다운로드 실행
      setTimeout(() => {
        const worksheet = XLSX.utils.json_to_sheet(finalResponses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Responses");
        XLSX.writeFile(workbook, "responses.xlsx");
      }, 100); // 상태 업데이트가 반영될 시간을 확보
    }
  };
  


  const radioOptions = [
    { name: "Plunge", description: "가속 운동으로 인해 쏠리는 느낌.\n Ex) 플레이어가 드리프트를 해서 느끼는 원심력", images: ["plunge_1.gif"], align: "left" },
    { name: "Collision", description: "두 물체가 맞닿을 때의 순간적인 충격 \n Ex) 진행중인 차량과 충돌했을 때의 충격", images: ["collision_1.gif"], align: "left" },
    { name: "Recoil", description: "어떤 행동의 결과로 느껴지는 반동 \n Ex) 권총을 사용했을 때의 반동", images: ["recoil_1.gif"], align: "left" },
    { name: "Body Quake", description: "온몸이 진동하는 느낌 \nEx) 지진", images: ["bodyquake_1.gif"], align: "left" },
    { name: "Roar", description: "특정 위치에서의 충격파 \nEx) 근거리에서 아이템 폭발, 눈 앞에서 울리는 괴물의 괴성", images: ["roar_1.gif", "roar_2.gif"], align: "left" },
    { name: "Rain", description: "불규칙한 입자들의 움직임이나 파동을 느끼는 경우 \nEx) 비를 맞는 경우, 플레이어가 배를 탔을 때의 출렁거림, 벌레가 플레이어 위를 기어다닐 때", images: ["rain_1.gif", "rain_2.gif", "rain_3.gif"], align: "right" },
    { name: "Inner State", description: "긴박감이나 에너지와 같이 플레이어 내적 상태의 변화 \nEx) 깊은 물 속의 수압을 느끼는 경우, 에너지를 충전하는 경우", images: ["innerstate_1.gif", "innerstate_2.gif"], align: "right" },
    { name: "Swipe", description: "물체와 플레이어가 서로 스칠 때의 느낌 \nEx) 물이 옆으로 스칠 때의 느낌, 풀 밭에서 풀 잎이 스쳐 지나가는 느낌", images: ["swipe_1.gif", "swipe_2.gif"], align: "right" },
    { name: "Push or Pull", description: "서로 밀고 당길 때에 플레이어가 받는 힘 혹은 반발력 \nEx) 줄다리기", images: ["pushorpull_1.gif"], align: "right" },
    { name: "Etc", description: "앞의 카테고리에 해당되지 않음.", images: [] }
  ];

  return (
    <div className="app-container content-shift">
      <div className="image-container">
        <img 
          src={`/images/${imageData[currentIndex].image}`} 
          alt="Displayed" 
          className="image" 
        />
        <p className="text text-spacing">{imageData[currentIndex].text}</p>
      </div>

      <div className="radio-container-inline">
        {radioOptions.map((option, index) => (
          <label 
            key={index} 
            className="radio-label fixed-width"
            onMouseEnter={() => {
              setHoveredOption(option);
              setHoverPosition(option.align);
            }}
            onMouseLeave={() => setHoveredOption(null)}
          >
            <input
              type="radio"
              name="options"
              value={option.name}
              checked={selectedOption === option.name}
              onChange={() => setSelectedOption(option.name)}
              className="radio-input"
            />
            <span className="radio-text">{option.name}</span>
          </label>
        ))}
      </div>

      <div className="hover-description-container">
        {hoveredOption && (
          <div className={`hover-description ${hoverPosition === "right" ? "align-right" : "align-left"}`}>
            <div className="hover-images">
              {hoveredOption.images.map((img, idx) => (
                <img key={idx} src={`/images/${img}`} alt={hoveredOption.name} className="hover-image" />
              ))}
            </div>
            <p className="hover-text">{hoveredOption.description}</p>
          </div>
        )}
      </div>

      <div className="button-container right-align">
        <button className="next-button" onClick={isCompleted ? handleEndClick : handleNextClick} disabled={!selectedOption}>
          {isCompleted ? "End" : "Next"}
        </button>
      </div>
    </div>
  );
}
