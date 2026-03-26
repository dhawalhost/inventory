import React from 'react';

export default function VoiceInputAddItem({ onResult }) {
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };
    recognition.start();
  };

  return (
    <button onClick={startListening}>
      🎤 Add item by voice
    </button>
  );
}