import { describe, it, expect } from 'vitest';
import {
  applyExploreFilters,
  matchesPriceRange,
} from '@/features/courses/utils/courseFilters';

const sampleCourses = [
  {
    id: 1,
    title: '商務會話',
    courseType: '影音課',
    dept: '商務英文',
    level: 'B2',
    price: 3200,
  },
  {
    id: 2,
    title: 'IELTS 衝刺',
    courseType: '直播課',
    dept: '檢定英文',
    level: 'C1',
    price: 5500,
  },
  {
    id: 3,
    title: '日常會話',
    courseType: '演講',
    dept: '生活英文',
    level: 'A2',
    price: 800,
  },
];

describe('matchesPriceRange', () => {
  it('matches price buckets correctly', () => {
    expect(matchesPriceRange(800, '$1,000 以下')).toBe(true);
    expect(matchesPriceRange(2800, '$1,000 - 3,000')).toBe(true);
    expect(matchesPriceRange(4500, '$3,000 - 5,000')).toBe(true);
    expect(matchesPriceRange(5500, '$5,000 以上')).toBe(true);
  });

  it('returns true for unknown range labels', () => {
    expect(matchesPriceRange(1000, '未知區間')).toBe(true);
  });
});

describe('applyExploreFilters', () => {
  it('returns all courses when no filters are set', () => {
    expect(applyExploreFilters(sampleCourses, {})).toHaveLength(3);
  });

  it('filters by course type', () => {
    const result = applyExploreFilters(sampleCourses, { types: ['直播課'] });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(2);
  });

  it('defaults missing courseType to 影音課', () => {
    const courses = [{ id: 9, dept: '生活英文', level: 'A1', price: 500 }];
    const result = applyExploreFilters(courses, { types: ['影音課'] });
    expect(result).toHaveLength(1);
  });

  it('filters by theme, level, and price together', () => {
    const result = applyExploreFilters(sampleCourses, {
      themes: ['商務英文'],
      levels: ['B2'],
      prices: ['$3,000 - 5,000'],
    });
    expect(result).toEqual([sampleCourses[0]]);
  });
});
