import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, addDoc, collection, doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, query, orderBy, limit, getDocs } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { getFunctions, httpsCallable } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-functions.js';
import { firebaseConfig } from './firebase-config.js';

const missing = firebaseConfig.apiKey.startsWith('YOUR_');
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app, 'asia-northeast3');

function requireUser() {
  if (!auth.currentUser) throw new Error('먼저 Firebase 로그인 화면에서 로그인해 주세요.');
  return auth.currentUser;
}
export async function saveReturneeProfile({ name, region, interests, consent }) {
  if (!consent) throw new Error('개인정보 수집·이용 동의가 필요합니다.');
  const user = requireUser();
  await setDoc(doc(db, 'users', user.uid), { role: 'returnee', name, region, interests, consentAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}
export async function submitConsultation({ mentorId, mentorName, learningGoal }) {
  const user = requireUser();
  const profile = await getDoc(doc(db, 'users', user.uid));
  if (!profile.exists()) throw new Error('상담 전 귀어인 정보를 먼저 저장해 주세요.');
  await addDoc(collection(db, 'consultRequests'), { returneeId: user.uid, mentorId, mentorName, applicant: profile.data(), learningGoal, status: 'pending', createdAt: serverTimestamp() });
  await updateDoc(doc(db, 'mentorProfiles', mentorId), { consultationCount: increment(1), popularityScore: increment(1) });
}
export async function transcribeAndSave(audioBlob, title) {
  const user = requireUser();
  const audioBase64 = await blobToBase64(audioBlob);
  const transcribeAudio = httpsCallable(functions, 'transcribeAudio');
  const result = await transcribeAudio({ audioBase64, mimeType: audioBlob.type || 'audio/webm' });
  await addDoc(collection(db, 'knowledgePosts'), { mentorId: user.uid, title, transcript: result.data.transcript, createdAt: serverTimestamp() });
  return result.data.transcript;
}
export async function getPopularMentors() {
  const snapshot = await getDocs(query(collection(db, 'mentorProfiles'), orderBy('popularityScore', 'desc'), limit(10)));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}
function blobToBase64(blob) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(blob); }); }
export const firebaseReady = !missing;
