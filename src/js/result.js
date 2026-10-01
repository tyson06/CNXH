import '../css/global.css';
import './theme.js';
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
    const answers = Array.isArray(result.answers) ? result.answers : Array(questions.length).fill(null);
    const histories = Array.isArray(result.history) ? result.history : [];
    const review = questions.map((question, index) => {
      const selected = answers[index];
      const attempts = Array.isArray(histories[index]) ? histories[index] : (Number.isInteger(selected) ? [selected] : []);
      const finalCorrect = selected === question.correct;
      const attemptRows = attempts.length ? attempts.map((choice, attemptIndex) => {
        const isCorrect = choice === question.correct;
        return `<li class="review-attempt ${isCorrect ? 'is-correct' : 'is-wrong'}"><span>Lần ${attemptIndex + 1} · ${isCorrect ? 'Đúng' : 'Sai'}</span><span>${String.fromCharCode(65 + choice)}. ${escapeHtml(question.answers[choice])}</span></li>`;
      }).join('') : '<li class="review-attempt is-unanswered">Chưa có đáp án được lưu cho lần làm này.</li>';
      return `<details class="review-question"><summary><span>Câu ${index + 1}</span><span class="review-status ${finalCorrect ? 'is-correct' : 'is-wrong'}">${finalCorrect ? 'Đúng' : 'Sai'}</span></summary><h3>${escapeHtml(question.question)}</h3><ol class="review-attempts">${attemptRows}</ol><p class="correct-answer"><strong>Đáp án đúng:</strong> ${String.fromCharCode(65 + question.correct)}. ${escapeHtml(question.answers[question.correct])}</p></details>`;
    }).join('');
    root.innerHTML = `<div class="result-card"><div class="completion-icon" aria-hidden="true">✓</div><p class="eyebrow">HOÀN THÀNH</p><h1>${quiz.title}</h1><p class="result-subtitle">Bạn đã hoàn thành bộ đề. Làm tốt lắm!</p><div class="score-ring" style="--score:${percentage}%"><div><strong>${percentage}<span>%</span></strong><small>chính xác</small></div></div><div class="score-summary"><div><strong>${result.correct} <span>/ ${result.total}</span></strong><span>Câu đúng</span></div><div><strong>${result.total - result.correct}</strong><span>Câu sai</span></div><div><strong>${score} <span>/ 10</span></strong><span>Điểm</span></div></div><div class="result-actions"><button class="button button-primary" type="button" data-retry>Thi lại từ đầu <span aria-hidden="true">↻</span></button><a class="button button-secondary" href="./">Về trang chủ</a></div></div><section class="review-panel"><h2>Xem lại đáp án</h2><p class="review-intro">Các lần chọn được lưu theo từng câu; đáp án đúng được đánh dấu màu xanh.</p><div class="review-list">${review}</div></section>`;
    root.addEventListener('click', (event) => {
      if (!event.target.closest('[data-retry]')) return;
      clearAttempt();
      saveAttempt({ quizId: quiz.id, currentQuestionIndex: 0, answers: Array(quiz.count).fill(null), history: Array.from({ length: quiz.count }, () => []) });
      window.location.href = new URL('quiz.html', window.location.href).href;
    });
  }).catch((issue) => error(issue.message || 'Đã xảy ra lỗi khi tải kết quả.'));
}

function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
