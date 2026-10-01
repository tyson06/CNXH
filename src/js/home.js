import '../css/global.css';
import './theme.js';
import { QUIZZES } from './config.js';
import { saveAttempt, clearResult } from './storage.js';

const list = document.querySelector('#quiz-list');
list.innerHTML = QUIZZES.map((quiz, index) => `
  <article class="quiz-card">
    <div class="card-number">0${index + 1}</div>
    <div class="card-copy"><h2>${quiz.title}</h2><p>${quiz.description}</p><span class="question-count">${quiz.count} câu hỏi</span></div>
    <button class="button button-primary card-button" type="button" data-quiz="${quiz.id}">Bắt đầu <span aria-hidden="true">→</span></button>
  </article>`).join('');

list.addEventListener('click', (event) => {
  const button = event.target.closest('[data-quiz]');
  if (!button) return;
    const quiz = QUIZZES.find((item) => item.id === button.dataset.quiz);
    saveAttempt({ quizId: quiz.id, currentQuestionIndex: 0, answers: Array(quiz.count).fill(null), history: Array.from({ length: quiz.count }, () => []) });
    clearResult();
  window.location.href = new URL('quiz.html', window.location.href).href;
});
