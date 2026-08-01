import { useEffect, useState, useRef } from 'react';
import { MdTune } from 'react-icons/md';

const COURSE_TYPES = ['影音課', '直播課', '演講', '說明會'];
const THEMES = ['生活英文', '旅遊英文', '商務英文', '學術英文', '檢定英文', '時事英文'];
const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const PRICES = ['$1,000 以下', '$1,000 - 3,000', '$3,000 - 5,000', '$5,000 以上'];

const DEFAULT_HOT_SEARCHES = [
  'Learn to write good English articles',
  'Increase vocabulary',
  'IELTS 7分衝刺',
  '商務英文',
  '托福閱讀',
  '日常會話',
];

export default function SearchFilter({ filters, onChange, onSearch, hotSearches = DEFAULT_HOT_SEARCHES }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState(filters.q || '');
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const wrapperRef = useRef(null);

  const toggle = (key, value) => {
    const current = filters[key] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
    setFocused(false);
  };

  const handleHotClick = (term) => {
    setQuery(term);
    onSearch(term);
    setFocused(false);
  };

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showHot = focused && !filterOpen;
  const showFilter = filterOpen;

  return (
    <div className="search-filter" ref={wrapperRef}>
      <div className={`search-filter__box ${showHot || showFilter ? 'search-filter__box--expanded' : ''}`}>
        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            type="text"
            name="search"
            placeholder={isMobile ? '搜尋課程' : '搜尋課程、演講、說明會'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { setFocused(true); setFilterOpen(false); }}
          />
          <button
            type="button"
            className={`search-bar__filter ${filterOpen ? 'search-bar__filter--active' : ''}`}
            onClick={() => { setFilterOpen(!filterOpen); setFocused(false); }}
            aria-label="篩選"
          >
            <MdTune size={22} />
          </button>
          <button type="submit" className="search-bar__btn">搜尋</button>
        </form>

        {showHot && (
          <div className="search-filter__dropdown">
            <h6>熱門搜尋</h6>
            <div className="search-filter__hot-tags">
              {hotSearches.map((term) => (
                <button key={term} type="button" className="hot-tag" onClick={() => handleHotClick(term)}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {showFilter && (
          <div className="search-filter__panel">
            <h5 className="search-filter__panel-title">篩選課程</h5>
            <div className="search-filter__group">
              <h6>類型</h6>
              <div className="search-filter__tags">
                {COURSE_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`filter-tag ${filters.types?.includes(t) ? 'active' : ''}`}
                    onClick={() => toggle('types', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-filter__group">
              <h6>主題</h6>
              <div className="search-filter__tags">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`filter-tag ${filters.themes?.includes(t) ? 'active' : ''}`}
                    onClick={() => toggle('themes', t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-filter__group">
              <h6>等級</h6>
              <div className="search-filter__tags">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`filter-tag filter-tag--round ${filters.levels?.includes(l) ? 'active' : ''}`}
                    onClick={() => toggle('levels', l)}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <div className="search-filter__group">
              <h6>價格</h6>
              <div className="search-filter__tags">
                {PRICES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`filter-tag ${filters.prices?.includes(p) ? 'active' : ''}`}
                    onClick={() => toggle('prices', p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
