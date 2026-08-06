import { firebaseReady, getPopularMentors } from './firebase-client.js';

const target = document.querySelector('#popularRank');
if (firebaseReady && target) {
  try {
    const mentors = await getPopularMentors();
    if (mentors.length) target.innerHTML = `<b>인기 멘토 순위</b><br>${mentors.slice(0, 3).map((mentor, index) => `${index + 1}위 · ${mentor.name} 어업인`).join('<br>')}`;
  } catch {
    target.textContent = '인기 멘토 순위를 불러오지 못했습니다.';
  }
}
