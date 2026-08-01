const ANSWERS_KEY = 'recommendAnswers';
const RESULTS_KEY = 'recommendResults';

export function getRecommendAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(ANSWERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveRecommendAnswer(questionId, selectedIndex) {
  const answers = getRecommendAnswers().filter((a) => a.questionId !== questionId);
  answers.push({ questionId, selectedIndex });
  sessionStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function clearRecommendData() {
  sessionStorage.removeItem(ANSWERS_KEY);
  sessionStorage.removeItem(RESULTS_KEY);
}

export function setRecommendResults(courses) {
  sessionStorage.setItem(RESULTS_KEY, JSON.stringify(courses));
}

export function getRecommendResults() {
  try {
    return JSON.parse(sessionStorage.getItem(RESULTS_KEY)) || [];
  } catch {
    return [];
  }
}
