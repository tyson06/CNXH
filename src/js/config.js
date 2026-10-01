export const QUIZZES = [
  { id: 'review1', title: 'Ôn tập phần 1', count: 40, description: 'Tổng hợp chương 1, 2, 3, 4.' },
  { id: 'review2', title: 'Ôn tập phần 2', count: 45, description: 'Tổng hợp chương 5, 6, 7.' },
];

export const QUIZ_DATA_URLS = {
  review1: new URL('../data/review1.json', import.meta.url),
  review2: new URL('../data/review2.json', import.meta.url),
};

export const STORAGE_KEYS = {
  active: 'quiz-web:active-attempt',
  result: 'quiz-web:last-result',
  theme: 'cnxh-quiz:theme',
};
