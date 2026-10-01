import '../css/global.css';
import { getQuizMeta } from './data.js';
import { loadQuestions } from './data.js';
import { readAttempt, saveAttempt, saveResult, clearAttempt } from './storage.js';

const root = document.querySelector('#quiz-app');
const attempt = readAttempt();
const quiz = attempt && getQuizMeta(attempt.quizId);

function showError(message, withHome = true) {
  root.innerHTML = `<div class="message-card"><span class="message-icon" aria-hidden="true">!</span><h1>Không thể mở bài trắc nghiệm</h1><p>${message}</p>${withHome ? '<a class="button button-primary" href="./">Về trang chủ</a>' : ''}</div>`;
}

if (!attempt || !quiz || !Array.isArray(attempt.answers) || !Number.isInteger(attempt.currentQuestionIndex)) {
  clearAttempt();
  showError('Hãy chọn một bộ đề từ trang chủ để bắt đầu.');
} else {
  loadQuestions(quiz).then((questions) => {
    if (attempt.currentQuestionIndex < 0 || attempt.currentQuestionIndex >= questions.length) throw new Error('Vị trí câu hỏi không hợp lệ. Vui lòng bắt đầu lại từ trang chủ.');
    let index = attempt.currentQuestionIndex;
    let answers = Array(questions.length).fill(null);
    if (attempt.answers.length === questions.length) answers = attempt.answers;

    function render() {
      const question = questions[index];
      const selected = answers[index];
      const answered = Number.isInteger(selected);
      const progress = Math.round(((index + 1) / questions.length) * 100);
      const options = question.answers.map((answer, optionIndex) => {
        let stateClass = '';
        if (answered && optionIndex === question.correct) stateClass = ' is-correct';
        else if (answered && optionIndex === selected) stateClass = ' is-wrong';
        return `<button class="answer-option${stateClass}" type="button" data-answer="${optionIndex}" ${answered ? 'disabled' : ''} aria-pressed="${answered && optionIndex === selected}"><span class="answer-letter">${String.fromCharCode(65 + optionIndex)}</span><span>${escapeHtml(answer)}</span><span class="answer-mark" aria-hidden="true">${stateClass.includes('correct') ? '✓' : stateClass.includes('wrong') ? '×' : ''}</span></button>`;
      }).join('');
      const isLast = index === questions.length - 1;
      root.innerHTML = `<div class="quiz-heading"><div><a class="back-link" href="./">← Danh sách bộ đề</a><h1>${quiz.title}</h1></div><span class="progress-label">Câu ${index + 1} <span>/ ${questions.length}</span></span></div>
        <div class="progress-track" role="progressbar" aria-label="Tiến trình làm bài" aria-valuenow="${index + 1}" aria-valuemin="1" aria-valuemax="${questions.length}"><span style="width:${progress}%"></span></div>
        <section class="question-card" aria-labelledby="question-title"><div class="question-meta">CÂU HỎI ${String(index + 1).padStart(2, '0')}</div><h2 id="question-title">${escapeHtml(question.question)}</h2><div class="answer-list">${options}</div>
        ${answered ? `<div class="feedback ${selected === question.correct ? 'feedback-correct' : 'feedback-wrong'}" role="status"><strong>${selected === question.correct ? 'Chính xác!' : `Chưa chính xác. Đáp án đúng là ${String.fromCharCode(65 + question.correct)}.`}</strong></div>${question.note.trim() ? `<aside class="note-card"><h3>💡 Ghi chú</h3><p>${escapeHtml(question.note).replaceAll('\n', '<br>')}</p></aside>` : ''}` : ''}
        <div class="quiz-actions"><span class="keyboard-hint">Chọn một đáp án để tiếp tục</span><button class="button button-primary next-button" type="button" data-next ${answered ? '' : 'disabled'}>${isLast ? 'Xem kết quả' : 'Câu tiếp'} <span aria-hidden="true">→</span></button></div></section>`;
    }

    function escapeHtml(value) { return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }

    root.addEventListener('click', (event) => {
      const answerButton = event.target.closest('[data-answer]');
      if (answerButton && !Number.isInteger(answers[index])) {
        answers[index] = Number(answerButton.dataset.answer);
        saveAttempt({ quizId: quiz.id, currentQuestionIndex: index, answers });
        render();
        return;
      }
      if (!event.target.closest('[data-next]') || !Number.isInteger(answers[index])) return;
      if (index < questions.length - 1) {
        index += 1;
        saveAttempt({ quizId: quiz.id, currentQuestionIndex: index, answers });
        render();
      } else {
        const correct = answers.reduce((total, answer, questionIndex) => total + (answer === questions[questionIndex].correct ? 1 : 0), 0);
        saveResult({ quizId: quiz.id, correct, total: questions.length, completedAt: new Date().toISOString() });
        clearAttempt();
        window.location.href = new URL('result.html', window.location.href).href;
      }
    });
    render();
  }).catch((error) => showError(error.message || 'Đã xảy ra lỗi khi tải câu hỏi.'));
}
