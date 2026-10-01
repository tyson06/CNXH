import { QUIZZES, QUIZ_DATA_URLS } from './config.js';

export function getQuizMeta(id) {
  return QUIZZES.find((quiz) => quiz.id === id) ?? null;
}

export function validateQuestions(questions, expectedCount) {
  if (!Array.isArray(questions) || questions.length !== expectedCount) {
    throw new Error(`Bộ đề cần có đúng ${expectedCount} câu hỏi.`);
  }
  const ids = new Set();
  for (const [index, question] of questions.entries()) {
    const valid = question && Number.isInteger(question.id) && !ids.has(question.id)
      && typeof question.question === 'string' && question.question.trim()
      && Array.isArray(question.answers) && question.answers.length === 4
      && question.answers.every((answer) => typeof answer === 'string' && answer.trim())
      && Number.isInteger(question.correct) && question.correct >= 0 && question.correct < 4
      && typeof question.note === 'string';
    if (!valid) throw new Error(`Dữ liệu câu ${index + 1} không hợp lệ.`);
    ids.add(question.id);
  }
  return questions;
}

export async function loadQuestions(quiz) {
  const response = await fetch(QUIZ_DATA_URLS[quiz.id]);
  if (!response.ok) throw new Error('Không tải được dữ liệu bộ đề. Vui lòng tải lại trang.');
  let questions;
  try { questions = await response.json(); } catch { throw new Error('Tệp dữ liệu bộ đề không phải JSON hợp lệ.'); }
  return validateQuestions(questions, quiz.count);
}
