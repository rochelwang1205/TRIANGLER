import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import CourseCardWide from '../components/CourseCardWide';
import CourseCarousel from '../components/CourseCarousel';
import SearchFilter from '../components/SearchFilter';
import {
  useCourses,
  useThemes,
  usePopularSearches,
} from '@/features/courses/api/useCourses';
import { resolveCourses, themeIcons, THEME_TAG_MAP, SORT_PARAMS } from '../utils/courseImages';
import { applyExploreFilters } from '../utils/courseFilters';
import recommandImg from '@/assets/material/img_illustration/img_home-recommand-lg.png';

export default function Explore() {
  const [activeTheme, setActiveTheme] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ types: [], themes: [], levels: [], prices: [] });

  const { data: themes = [] } = useThemes();
  const { data: hotSearches = [] } = usePopularSearches();
  const { data: hotData = [] } = useCourses({ isHot: true });

  const courseParams = useMemo(() => {
    const params = { ...SORT_PARAMS[sortBy] };
    const tag = THEME_TAG_MAP[activeTheme];
    if (tag) params.tag = tag;
    if (searchQuery.trim()) params.q = searchQuery.trim();
    return params;
  }, [activeTheme, sortBy, searchQuery]);

  const {
    data: exploreData = [],
    isPending: loading,
    error,
  } = useCourses(courseParams);

  const hotCourses = useMemo(() => resolveCourses(hotData), [hotData]);
  const exploreCourses = useMemo(
    () => applyExploreFilters(resolveCourses(exploreData), filters),
    [exploreData, filters]
  );

  return (
    <main className="explore-page">
      <div className="container">
        <h1 className="page-title">尋找課程</h1>

        <div className="explore-recommend">
          <div className="explore-recommend__image">
            <img src={recommandImg} alt="客製化課程推薦" />
          </div>
          <div className="explore-recommend__text">
            <h3>客製化課程推薦</h3>
            <p>免費、免註冊。推薦適合您的課程與學習建議！</p>
            <Link to="/recommend" className="btn-yellow">立即體驗</Link>
          </div>
        </div>

        <SearchFilter
          filters={filters}
          onChange={setFilters}
          onSearch={setSearchQuery}
          hotSearches={hotSearches.length ? hotSearches : undefined}
        />

        {error && <p>載入失敗：{error.message}</p>}

        <section className="popular-section">
          <h2 className="section-title">熱門課程</h2>
          <CourseCarousel className="popular-carousel">
            {hotCourses.map((course) => (
              <CourseCardWide key={course.id} course={course} />
            ))}
          </CourseCarousel>
        </section>

        <section className="theme-section">
          <h2 className="section-title">主題</h2>
          <div className="theme-grid">
            {themes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                className={`theme-btn ${activeTheme === theme.id ? 'theme-btn--active' : ''}`}
                onClick={() => setActiveTheme(theme.id)}
              >
                {themeIcons[theme.id] && (
                  <img src={themeIcons[theme.id]} alt={theme.label} />
                )}
                <span>{theme.label === 'ALL' ? '全部' : theme.label}</span>
              </button>
            ))}
          </div>
          <div className="sort-filters">
            {[
              { id: 'latest', label: '最新' },
              { id: 'popular', label: '最熱門' },
              { id: 'price', label: '價格最佳' },
            ].map((sort, idx) => (
              <span key={sort.id}>
                {idx > 0 && <span className="sort-divider">|</span>}
                <button
                  type="button"
                  className={sortBy === sort.id ? 'active' : ''}
                  onClick={() => setSortBy(sort.id)}
                >
                  {sort.label}
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="course-grid-section">
          {loading ? (
            <p>載入中...</p>
          ) : (
            <div className="course-grid">
              {exploreCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          <p className="more-link"><a href="#!">更多課程</a></p>
        </section>
      </div>
    </main>
  );
}
