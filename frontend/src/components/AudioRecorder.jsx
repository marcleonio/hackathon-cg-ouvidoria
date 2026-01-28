import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, Play, CircleStop } from 'lucide-react';

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        onRecordingComplete(blob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Timer
        setElapsedTime(0);
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioUrl(null);
    onRecordingComplete(null);
    setElapsedTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 flex flex-col items-center gap-3">
        <label className="text-sm font-semibold text-gray-700 self-start">Gravar Relato (Áudio)</label>
        
      {!audioUrl ? (
        <div className="flex flex-col items-center gap-2">
            
          {isRecording ? (
            <div className="flex flex-col items-center animate-pulse">
                <span className="text-red-600 font-bold mb-2">Gravando: {formatTime(elapsedTime)}</span>
                <button
                    onClick={stopRecording}
                    type="button"
                    className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
                    aria-label="Parar gravação"
                >
                    <Square size={24} fill="currentColor" />
                </button>
            </div>
          ) : (
            <button
              onClick={startRecording}
              type="button"
              className="bg-gov-blue text-white p-4 rounded-full hover:bg-gov-dark focus:outline-none focus:ring-4 focus:ring-blue-300 transition-transform hover:scale-105"
              aria-label="Iniciar gravação de áudio"
            >
              <Mic size={24} />
            </button>
          )}
          <span className="text-xs text-gray-500 mt-1">Toque para gravar</span>
        </div>
      ) : (
        <div className="w-full flex items-center justify-between gap-2 p-2 bg-white rounded shadow-sm">
          <audio controls src={audioUrl} className="flex-1 h-10 w-full" />
          <button
            onClick={deleteRecording}
            type="button"
            className="text-red-500 p-2 hover:bg-red-50 rounded"
            aria-label="Excluir gravação"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
