import { describe, it, expect, beforeEach } from 'vitest';
import {
  clearRecommendData,
  getRecommendAnswers,
  getRecommendResults,
  saveRecommendAnswer,
  setRecommendResults,
} from '@/features/recommend/utils/recommendStorage';

describe('recommendStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('stores and retrieves quiz answers', () => {
    saveRecommendAnswer(1, 2);
    saveRecommendAnswer(2, 0);

    expect(getRecommendAnswers()).toEqual([
      { questionId: 1, selectedIndex: 2 },
      { questionId: 2, selectedIndex: 0 },
    ]);
  });

  it('overwrites answer for the same question', () => {
    saveRecommendAnswer(1, 0);
    saveRecommendAnswer(1, 3);

    expect(getRecommendAnswers()).toEqual([{ questionId: 1, selectedIndex: 3 }]);
  });

  it('stores and clears recommendation results', () => {
    setRecommendResults([{ id: 1, title: 'Test Course' }]);
    expect(getRecommendResults()).toHaveLength(1);

    clearRecommendData();
    expect(getRecommendAnswers()).toEqual([]);
    expect(getRecommendResults()).toEqual([]);
  });
});
