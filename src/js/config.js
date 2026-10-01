export const QUIZZES = [
  { id: 'review1', title: 'Ôn tập phần 1', count: 40, description: 'Củng cố kiến thức với 40 câu hỏi trắc nghiệm.' },
  { id: 'review2', title: 'Ôn tập phần 2', count: 45, description: 'Tiếp tục luyện tập với 45 câu hỏi trắc nghiệm.' },
];

export const QUIZ_DATA_URLS = {
  review1: new URL('../data/review1.json', import.meta.url),
  review2: new URL('../data/review2.json', import.meta.url),
};

export const STORAGE_KEYS = {
  active: 'quiz-web:active-attempt',
  result: 'quiz-web:last-result',
};
