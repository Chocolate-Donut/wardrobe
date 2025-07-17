import React, { useEffect, useState } from 'react';
import './TypewriterText.css'; // подключаем стили ниже

interface TypewriterTextProps {
  text: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text }) => {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false); // убираем анимацию после завершения печати
    }, 6000); // 5s анимация + 1s задержка как в твоём CSS

    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className={`cursor ${animate ? "typewriter-animation" : ""}`}>
      {text}
    </h1>
  );
};

export default TypewriterText;
