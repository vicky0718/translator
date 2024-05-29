import React, { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Speech = ({ onTranscriptChange }) => {
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    onTranscriptChange(transcript);
  }, [transcript, onTranscriptChange]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="speech-text">
      <button onClick={() => SpeechRecognition.startListening({ continuous: true })}>Speak</button>
      <button onClick={SpeechRecognition.stopListening}>Stop</button>
      <button onClick={resetTranscript}>Reset</button>
    </div>
  );
};

export default Speech;