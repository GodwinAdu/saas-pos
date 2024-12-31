"use client";


import React, { useState } from "react";


const Calculator: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | string>(0);
  const [memory, setMemory] = useState<number | null>(null);

  const handleButtonClick = (value: string) => {
    if (value === '=') {
      try {
        const evalResult = eval(input); // Avoid eval in production, use safer libraries like math.js
        setResult(evalResult);
        setInput('');
      } catch (error) {
        setResult('Error' + error);
      }
    } else if (value === 'C') {
      setInput('');
      setResult(0);
    } else if (value === 'M+') {
      setMemory(result as number);
    } else if (value === 'MR') {
      setInput(memory?.toString() || '');
    } else if (value === 'MC') {
      setMemory(null);
    } else if (value === '√') {
      const sqrtResult = Math.sqrt(Number(input));
      setResult(sqrtResult);
      setInput('');
    } else if (value === '%') {
      const percentResult = Number(input) / 100;
      setResult(percentResult);
      setInput('');
    } else {
      setInput(input + value);
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white text-black">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-semibold text-right flex-grow">{input || result}</div>
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {['MR', 'MC'].map((value) => (
          <button key={value} className="col-span-2 p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['C', '√', '%', 'M+'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['7', '8', '9', '/'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['4', '5', '6', '*'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['1', '2', '3', '-'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}
        {['0', '.', '=', '+'].map((value) => (
          <button key={value} className="p-2 bg-gray-200 rounded" onClick={() => handleButtonClick(value)}>
            {value}
          </button>
        ))}


      </div>
    </div>
  );
};

export default Calculator;
