import { firebaseReady, transcribeAndSave } from './firebase-client.js';

const button = document.querySelector('#voice');
const recordBox = document.querySelector('#record');
let recorder;
let chunks = [];
let stream;

button.onclick = async () => {
  if (!firebaseReady) return alert('firebase-config.js에 Firebase 프로젝트 설정값을 먼저 입력해 주세요.');
  if (recorder?.state === 'recording') { recorder.stop(); button.textContent = '음성 인식 결과를 저장하고 있습니다…'; button.disabled = true; return; }
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    chunks = [];
    recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
    recorder.ondataavailable = event => chunks.push(event.data);
    recorder.onstop = async () => {
      recordBox.classList.remove('active');
      try { const transcript = await transcribeAndSave(new Blob(chunks, { type: recorder.mimeType }), '음성으로 기록한 노하우'); button.textContent = '🎙 다시 말로 노하우 기록하기'; alert(`음성 인식 결과\n\n${transcript}`); }
      catch (error) { alert(error.message || '음성 인식 결과를 저장하지 못했습니다.'); button.textContent = '🎙 말로 노하우 기록하기'; }
      finally { button.disabled = false; stream?.getTracks().forEach(track => track.stop()); }
    };
    recorder.start(); recordBox.classList.add('active'); button.textContent = '■ 녹음 멈추기';
  } catch { alert('마이크 사용 권한이 필요합니다. 브라우저에서 마이크를 허용한 뒤 다시 시도해 주세요.'); }
};
