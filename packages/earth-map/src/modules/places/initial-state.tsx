export default {
  // Preload
  cache: {
    featured: {
      data: [],
    },
  },

  // Selected
  data: {},
  loading: false,
  error: null,

  // Selected
  selectedOpen: false,
  selectedSearch: '',
  selectedFilter: '',
  selectedId: null,

  // Search
  search: {
    index: 0,
    loading: false,
    term: '',
    availableFilters: {},
    filters: {},
    open: false,
    search: '',
  },

  // Places list
  results: [],
  nextPageCursor: null,
};
