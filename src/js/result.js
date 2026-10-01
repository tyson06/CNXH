import '../css/global.css';
import { getQuizMeta, loadQuestions } from './data.js';
import { readResult, saveAttempt, clearAttempt } from './storage.js';

const root = document.querySelector('#result-app');
const result = readResult();
const quiz = result && getQuizMeta(result.quizId);

function error(message) {
  root.innerHTML = `<div class="message-card"><span class="message-icon" aria-hidden="true">!</span><h1>Chưa có kết quả</h1><p>${message}</p><a class="button button-primary" href="./">Về trang chủ</a></div>`;
}

if (!result || !quiz || !Number.isInteger(result.correct) || result.correct < 0 || result.correct > result.total) {
  error('Hãy hoàn thành một bộ đề để xem kết quả.');
} else {
  loadQuestions(quiz).then((questions) => {
    if (result.total !== questions.length) throw new Error('Số câu trong kết quả không khớp với dữ liệu bộ đề.');
    const percentage = Math.round((result.correct / result.total) * 100);
    const score = ((result.correct / result.total) * 10).toFixed(1);
    root.innerHTML = `<div class="result-card"><div class="completion-icon" aria-hidden="true">✓</div><p class="eyebrow">HOÀN THÀNH</p><h1>${quiz.title}</h1><p class="result-subtitle">Bạn đã hoàn thành bộ đề. Làm tốt lắm!</p><div class="score-ring" style="--score:${percentage}%"><div><strong>${percentage}<span>%</span></strong><small>chính xác</small></div></div><div class="score-summary"><div><strong>${result.correct} <span>/ ${result.total}</span></strong><span>Câu đúng</span></div><div><strong>${result.total - result.correct}</strong><span>Câu sai</span></div><div><strong>${score} <span>/ 10</span></strong><span>Điểm</span></div></div><div class="result-actions"><button class="button button-primary" type="button" data-retry>Làm lại <span aria-hidden="true">↻</span></button><a class="button button-secondary" href="./">Về trang chủ</a></div></div>`;
    root.addEventListener('click', (event) => {
      if (!event.target.closest('[data-retry]')) return;
      saveAttempt({ quizId: quiz.id, currentQuestionIndex: 0, answers: [] });
      window.location.href = new URL('quiz.html', window.location.href).href;
    });
  }).catch((issue) => error(issue.message || 'Đã xảy ra lỗi khi tải kết quả.'));
}
