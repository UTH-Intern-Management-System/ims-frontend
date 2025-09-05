// Advanced Search Service - Enhanced search functionality with AI-powered features
class AdvancedSearchService {
  constructor() {
    this.searchHistory = this.loadSearchHistory();
    this.savedSearches = this.loadSavedSearches();
    this.searchSuggestions = new Map();
    this.popularSearches = new Map();
    this.searchAnalytics = {
      totalSearches: 0,
      avgSearchTime: 0,
      topKeywords: new Map(),
      searchPatterns: []
    };
  }

  // Search History Management
  loadSearchHistory() {
    try {
      const history = localStorage.getItem('searchHistory');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading search history:', error);
      return [];
    }
  }

  saveSearchHistory() {
    try {
      localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  addToHistory(searchData) {
    const historyItem = {
      id: Date.now() + Math.random(),
      query: searchData.query,
      filters: searchData.filters,
      timestamp: new Date().toISOString(),
      resultsCount: searchData.resultsCount || 0,
      searchTime: searchData.searchTime || 0
    };

    // Remove duplicate searches
    this.searchHistory = this.searchHistory.filter(
      item => !(item.query === searchData.query && 
                JSON.stringify(item.filters) === JSON.stringify(searchData.filters))
    );

    // Add to beginning and limit to 50 items
    this.searchHistory.unshift(historyItem);
    this.searchHistory = this.searchHistory.slice(0, 50);
    
    this.saveSearchHistory();
    this.updateSearchAnalytics(historyItem);
    
    return historyItem;
  }

  getSearchHistory(limit = 10) {
    return this.searchHistory.slice(0, limit);
  }

  clearSearchHistory() {
    this.searchHistory = [];
    this.saveSearchHistory();
  }

  // Saved Searches Management
  loadSavedSearches() {
    try {
      const saved = localStorage.getItem('savedSearches');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved searches:', error);
      return [];
    }
  }

  saveSavedSearches() {
    try {
      localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
    } catch (error) {
      console.error('Error saving saved searches:', error);
    }
  }

  saveSearch(name, searchData) {
    const savedSearch = {
      id: Date.now() + Math.random(),
      name,
      query: searchData.query,
      filters: searchData.filters,
      timestamp: new Date().toISOString(),
      usageCount: 0,
      lastUsed: null
    };

    // Check for duplicate names
    const existingIndex = this.savedSearches.findIndex(s => s.name === name);
    if (existingIndex >= 0) {
      this.savedSearches[existingIndex] = savedSearch;
    } else {
      this.savedSearches.push(savedSearch);
    }

    this.saveSavedSearches();
    return savedSearch;
  }

  getSavedSearches() {
    return this.savedSearches.sort((a, b) => b.usageCount - a.usageCount);
  }

  deleteSavedSearch(id) {
    this.savedSearches = this.savedSearches.filter(s => s.id !== id);
    this.saveSavedSearches();
  }

  useSavedSearch(id) {
    const search = this.savedSearches.find(s => s.id === id);
    if (search) {
      search.usageCount++;
      search.lastUsed = new Date().toISOString();
      this.saveSavedSearches();
    }
    return search;
  }

  // Smart Search Suggestions
  generateSuggestions(query, context = {}) {
    const suggestions = [];
    
    // History-based suggestions
    const historySuggestions = this.searchHistory
      .filter(item => item.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(item => ({
        type: 'history',
        text: item.query,
        filters: item.filters,
        icon: 'history'
      }));

    // Saved search suggestions
    const savedSuggestions = this.savedSearches
      .filter(item => item.name.toLowerCase().includes(query.toLowerCase()) || 
                     item.query.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 2)
      .map(item => ({
        type: 'saved',
        text: item.name,
        query: item.query,
        filters: item.filters,
        icon: 'bookmark'
      }));

    // Smart keyword suggestions based on context
    const keywordSuggestions = this.generateKeywordSuggestions(query, context);

    suggestions.push(...historySuggestions, ...savedSuggestions, ...keywordSuggestions);
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }

  generateKeywordSuggestions(query, context) {
    const suggestions = [];
    const keywords = query.toLowerCase().split(' ').filter(w => w.length > 2);
    
    // Context-based suggestions
    if (context.entity === 'intern') {
      const internKeywords = ['thực tập sinh', 'sinh viên', 'tốt nghiệp', 'kỹ năng', 'đánh giá'];
      internKeywords.forEach(keyword => {
        if (keyword.includes(query.toLowerCase()) || query.toLowerCase().includes(keyword)) {
          suggestions.push({
            type: 'keyword',
            text: keyword,
            icon: 'search'
          });
        }
      });
    }

    if (context.entity === 'task') {
      const taskKeywords = ['nhiệm vụ', 'dự án', 'deadline', 'hoàn thành', 'tiến độ'];
      taskKeywords.forEach(keyword => {
        if (keyword.includes(query.toLowerCase()) || query.toLowerCase().includes(keyword)) {
          suggestions.push({
            type: 'keyword',
            text: keyword,
            icon: 'search'
          });
        }
      });
    }

    return suggestions;
  }

  // Search Analytics
  updateSearchAnalytics(searchItem) {
    this.searchAnalytics.totalSearches++;
    
    // Update average search time
    if (searchItem.searchTime) {
      const currentAvg = this.searchAnalytics.avgSearchTime;
      const total = this.searchAnalytics.totalSearches;
      this.searchAnalytics.avgSearchTime = 
        (currentAvg * (total - 1) + searchItem.searchTime) / total;
    }

    // Update top keywords
    if (searchItem.query) {
      const keywords = searchItem.query.toLowerCase().split(' ').filter(w => w.length > 2);
      keywords.forEach(keyword => {
        const count = this.searchAnalytics.topKeywords.get(keyword) || 0;
        this.searchAnalytics.topKeywords.set(keyword, count + 1);
      });
    }

    // Store search patterns for ML analysis
    this.searchAnalytics.searchPatterns.push({
      query: searchItem.query,
      filters: Object.keys(searchItem.filters || {}),
      timestamp: searchItem.timestamp,
      resultsCount: searchItem.resultsCount
    });

    // Keep only last 1000 patterns
    if (this.searchAnalytics.searchPatterns.length > 1000) {
      this.searchAnalytics.searchPatterns = this.searchAnalytics.searchPatterns.slice(-1000);
    }
  }

  getSearchAnalytics() {
    return {
      ...this.searchAnalytics,
      topKeywords: Array.from(this.searchAnalytics.topKeywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      popularFilters: this.getPopularFilters()
    };
  }

  getPopularFilters() {
    const filterCounts = new Map();
    
    this.searchHistory.forEach(item => {
      if (item.filters) {
        Object.keys(item.filters).forEach(filterKey => {
          const count = filterCounts.get(filterKey) || 0;
          filterCounts.set(filterKey, count + 1);
        });
      }
    });

    return Array.from(filterCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }

  // Advanced Search Features
  performFuzzySearch(query, data, fields) {
    if (!query || !data || !Array.isArray(data)) return data;

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return data.filter(item => {
      return searchTerms.some(term => {
        return fields.some(field => {
          const value = this.getNestedValue(item, field);
          if (typeof value === 'string') {
            return this.fuzzyMatch(value.toLowerCase(), term);
          }
          return false;
        });
      });
    });
  }

  fuzzyMatch(text, term) {
    // Simple fuzzy matching algorithm
    if (text.includes(term)) return true;
    
    // Check for typos (Levenshtein distance <= 1)
    if (term.length > 3) {
      const words = text.split(' ');
      return words.some(word => this.levenshteinDistance(word, term) <= 1);
    }
    
    return false;
  }

  levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill().map(() => Array(str1.length + 1).fill(0));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,     // deletion
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i - 1] + cost // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Smart Filter Suggestions
  suggestFilters(query, context = {}) {
    const suggestions = [];
    
    // Analyze query for potential filter values
    const queryLower = query.toLowerCase();
    
    // Date-related suggestions
    const dateKeywords = ['hôm nay', 'tuần này', 'tháng này', 'năm nay', 'hôm qua'];
    dateKeywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        suggestions.push({
          type: 'date',
          filter: 'dateRange',
          value: this.parseDateKeyword(keyword),
          display: `Lọc theo ${keyword}`
        });
      }
    });

    // Status-related suggestions
    const statusKeywords = ['hoàn thành', 'đang làm', 'chưa làm', 'quá hạn'];
    statusKeywords.forEach(keyword => {
      if (queryLower.includes(keyword)) {
        suggestions.push({
          type: 'status',
          filter: 'status',
          value: this.mapStatusKeyword(keyword),
          display: `Lọc theo trạng thái: ${keyword}`
        });
      }
    });

    return suggestions;
  }

  parseDateKeyword(keyword) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (keyword) {
      case 'hôm nay':
        return { from: today.toISOString(), to: new Date(today.getTime() + 24*60*60*1000).toISOString() };
      case 'hôm qua':
        const yesterday = new Date(today.getTime() - 24*60*60*1000);
        return { from: yesterday.toISOString(), to: today.toISOString() };
      case 'tuần này':
        const startOfWeek = new Date(today.getTime() - today.getDay() * 24*60*60*1000);
        return { from: startOfWeek.toISOString(), to: null };
      case 'tháng này':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return { from: startOfMonth.toISOString(), to: null };
      case 'năm nay':
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        return { from: startOfYear.toISOString(), to: null };
      default:
        return null;
    }
  }

  mapStatusKeyword(keyword) {
    const statusMap = {
      'hoàn thành': 'Completed',
      'đang làm': 'In Progress',
      'chưa làm': 'Todo',
      'quá hạn': 'Overdue'
    };
    return statusMap[keyword] || keyword;
  }

  // Export/Import functionality
  exportSearchData() {
    return {
      searchHistory: this.searchHistory,
      savedSearches: this.savedSearches,
      searchAnalytics: this.searchAnalytics,
      exportDate: new Date().toISOString()
    };
  }

  importSearchData(data) {
    try {
      if (data.searchHistory) {
        this.searchHistory = data.searchHistory;
        this.saveSearchHistory();
      }
      
      if (data.savedSearches) {
        this.savedSearches = data.savedSearches;
        this.saveSavedSearches();
      }
      
      if (data.searchAnalytics) {
        this.searchAnalytics = {
          ...this.searchAnalytics,
          ...data.searchAnalytics
        };
      }
      
      return true;
    } catch (error) {
      console.error('Error importing search data:', error);
      return false;
    }
  }
}

// Singleton instance
const advancedSearchService = new AdvancedSearchService();

export default advancedSearchService;

// Helper hook for React components
export const useAdvancedSearch = () => {
  const [searchHistory, setSearchHistory] = React.useState([]);
  const [savedSearches, setSavedSearches] = React.useState([]);
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    setSearchHistory(advancedSearchService.getSearchHistory());
    setSavedSearches(advancedSearchService.getSavedSearches());
  }, []);

  const performSearch = React.useCallback((searchData) => {
    const startTime = Date.now();
    
    // Add to history
    const historyItem = advancedSearchService.addToHistory({
      ...searchData,
      searchTime: Date.now() - startTime
    });
    
    // Update state
    setSearchHistory(advancedSearchService.getSearchHistory());
    
    return historyItem;
  }, []);

  const saveSearch = React.useCallback((name, searchData) => {
    const saved = advancedSearchService.saveSearch(name, searchData);
    setSavedSearches(advancedSearchService.getSavedSearches());
    return saved;
  }, []);

  const getSuggestions = React.useCallback((query, context) => {
    const newSuggestions = advancedSearchService.generateSuggestions(query, context);
    setSuggestions(newSuggestions);
    return newSuggestions;
  }, []);

  return {
    searchHistory,
    savedSearches,
    suggestions,
    performSearch,
    saveSearch,
    getSuggestions,
    clearHistory: () => {
      advancedSearchService.clearSearchHistory();
      setSearchHistory([]);
    },
    getAnalytics: () => advancedSearchService.getSearchAnalytics()
  };
};
