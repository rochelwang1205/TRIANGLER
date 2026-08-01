const PRICE_RANGES = {
  '$1,000 以下': (price) => price < 1000,
  '$1,000 - 3,000': (price) => price >= 1000 && price <= 3000,
  '$3,000 - 5,000': (price) => price > 3000 && price <= 5000,
  '$5,000 以上': (price) => price > 5000,
};

export function matchesPriceRange(price, rangeLabel) {
  const matcher = PRICE_RANGES[rangeLabel];
  return matcher ? matcher(price) : true;
}

export function applyExploreFilters(courses, filters = {}) {
  let result = [...courses];

  if (filters.types?.length) {
    result = result.filter((course) =>
      filters.types.includes(course.courseType || '影音課')
    );
  }

  if (filters.themes?.length) {
    result = result.filter((course) => filters.themes.includes(course.dept));
  }

  if (filters.levels?.length) {
    result = result.filter((course) => filters.levels.includes(course.level));
  }

  if (filters.prices?.length) {
    result = result.filter((course) =>
      filters.prices.some((range) => matchesPriceRange(course.price, range))
    );
  }

  return result;
}
