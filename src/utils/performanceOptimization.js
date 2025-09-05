// Performance Optimization Utilities
import React, { lazy, Suspense, memo, useMemo, useCallback, useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';

// Lazy Loading Wrapper
export const LazyWrapper = ({ children, fallback = <CircularProgress /> }) => {
  return (
    <Suspense fallback={
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        {fallback}
      </Box>
    }>
      {children}
    </Suspense>
  );
};

// Code Splitting - Lazy load components
export const LazyComponents = {
  // Admin Components
  AdminDashboard: lazy(() => import('../pages/admin/AdminDashboard')),
  UserManagement: lazy(() => import('../pages/admin/UserManagement')),
  SystemSettings: lazy(() => import('../pages/admin/SystemSettings')),
  
  // HR Components
  HrDashboard: lazy(() => import('../pages/hr/HRDashboard')),
  InternManagement: lazy(() => import('../pages/hr/InternManagement')),
  RecruitmentCampaigns: lazy(() => import('../pages/hr/RecruitmentCampaigns')),
  
  // Coordinator Components
  CoordinatorDashboard: lazy(() => import('../pages/coordinator/CoordinatorDashboard')),
  InterviewScheduling: lazy(() => import('../pages/coordinator/InterviewScheduling')),
  TrainingPrograms: lazy(() => import('../pages/coordinator/TrainingPrograms')),
  
  // Mentor Components
  MentorDashboard: lazy(() => import('../pages/mentor/MentorDashboard')),
  SkillAssessment: lazy(() => import('../pages/mentor/SkillAssessment')),
  ProgressTracking: lazy(() => import('../pages/mentor/ProgressTracking')),
  
  // Intern Components
  InternDashboard: lazy(() => import('../pages/intern/InternDashboard')),
  TaskManagement: lazy(() => import('../pages/intern/TaskManagement')),
  FeedbackSubmission: lazy(() => import('../pages/intern/FeedbackSubmission')),
  
  // Common Components
  Reports: lazy(() => import('../pages/common/Reports')),
  Analytics: lazy(() => import('../pages/common/Analytics')),
  Profile: lazy(() => import('../pages/common/Profile'))
};

// Memoization Utilities
export const MemoizedComponent = memo((Component) => {
  return React.forwardRef((props, ref) => {
    return <Component {...props} ref={ref} />;
  });
});

// Custom hooks for performance optimization
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useThrottle = (callback, delay) => {
  const [throttledCallback, setThrottledCallback] = useState(null);

  useEffect(() => {
    if (throttledCallback) {
      const timer = setTimeout(() => {
        setThrottledCallback(null);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [throttledCallback, delay]);

  return useCallback((...args) => {
    if (!throttledCallback) {
      setThrottledCallback(() => callback(...args));
      callback(...args);
    }
  }, [callback, throttledCallback]);
};

// Virtual Scrolling for large lists
export const useVirtualScroll = (items, itemHeight = 50, containerHeight = 400) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = useMemo(() => 
    items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index
    }))
  , [items, visibleStart, visibleEnd]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e) => setScrollTop(e.target.scrollTop)
  };
};

// Image lazy loading
export const LazyImage = memo(({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  useEffect(() => {
    let observer;
    
    if (imageRef && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(imageRef);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(imageRef);
    }

    return () => {
      if (observer && imageRef) {
        observer.unobserve(imageRef);
      }
    };
  }, [imageRef, src]);

  return (
    <img
      ref={setImageRef}
      src={imageSrc || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNjY2MiLz48L3N2Zz4='}
      alt={alt}
      className={className}
      {...props}
    />
  );
});

// Memoized data processing
export const useMemoizedData = (data, processor, dependencies = []) => {
  return useMemo(() => {
    if (!data || !processor) return data;
    return processor(data);
  }, [data, ...dependencies]);
};

// Optimized event handlers
export const useOptimizedHandlers = (handlers) => {
  return useMemo(() => {
    const optimizedHandlers = {};
    
    Object.entries(handlers).forEach(([key, handler]) => {
      optimizedHandlers[key] = useCallback(handler, []);
    });
    
    return optimizedHandlers;
  }, [handlers]);
};

// Bundle splitting utilities
export const loadChunk = async (chunkName) => {
  try {
    const chunk = await import(`../chunks/${chunkName}`);
    return chunk.default || chunk;
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error);
    throw error;
  }
};

// Performance monitoring
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTimes: [],
      loadTimes: [],
      memoryUsage: [],
      userInteractions: []
    };
  }

  startTiming(label) {
    if (window.performance) {
      window.performance.mark(`${label}-start`);
    }
  }

  endTiming(label) {
    if (window.performance) {
      window.performance.mark(`${label}-end`);
      window.performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = window.performance.getEntriesByName(label)[0];
      this.metrics.renderTimes.push({
        label,
        duration: measure.duration,
        timestamp: Date.now()
      });
    }
  }

  measureComponentRender(Component, displayName) {
    return memo(React.forwardRef((props, ref) => {
      const renderStart = window.performance?.now();
      
      useEffect(() => {
        if (renderStart) {
          const renderEnd = window.performance.now();
          this.metrics.renderTimes.push({
            component: displayName || Component.name,
            duration: renderEnd - renderStart,
            timestamp: Date.now()
          });
        }
      });

      return <Component {...props} ref={ref} />;
    }));
  }

  trackUserInteraction(action, target) {
    this.metrics.userInteractions.push({
      action,
      target,
      timestamp: Date.now()
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      avgRenderTime: this.calculateAverage(this.metrics.renderTimes, 'duration'),
      slowestRenders: this.metrics.renderTimes
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10)
    };
  }

  calculateAverage(array, key) {
    if (array.length === 0) return 0;
    const sum = array.reduce((acc, item) => acc + item[key], 0);
    return sum / array.length;
  }

  exportMetrics() {
    const metrics = this.getMetrics();
    const blob = new Blob([JSON.stringify(metrics, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-metrics-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// React DevTools Profiler wrapper
export const ProfiledComponent = ({ id, children, onRender }) => {
  return (
    <React.Profiler id={id} onRender={onRender || ((id, phase, actualDuration) => {
      performanceMonitor.metrics.renderTimes.push({
        component: id,
        phase,
        duration: actualDuration,
        timestamp: Date.now()
      });
    })}>
      {children}
    </React.Profiler>
  );
};

// Memory usage tracking
export const useMemoryTracking = () => {
  useEffect(() => {
    const trackMemory = () => {
      if (window.performance && window.performance.memory) {
        performanceMonitor.metrics.memoryUsage.push({
          used: window.performance.memory.usedJSHeapSize,
          total: window.performance.memory.totalJSHeapSize,
          limit: window.performance.memory.jsHeapSizeLimit,
          timestamp: Date.now()
        });
      }
    };

    // Track memory usage every 30 seconds
    const interval = setInterval(trackMemory, 30000);
    trackMemory(); // Initial measurement

    return () => clearInterval(interval);
  }, []);
};

// Optimized table rendering for large datasets
export const OptimizedTable = memo(({ 
  data, 
  columns, 
  rowHeight = 50, 
  maxVisibleRows = 20,
  onRowClick 
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + maxVisibleRows, data.length);
  const visibleData = data.slice(startIndex, endIndex);
  
  const totalHeight = data.length * rowHeight;
  const offsetY = startIndex * rowHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div 
      style={{ height: maxVisibleRows * rowHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleData.map((row, index) => (
            <div
              key={startIndex + index}
              style={{ height: rowHeight, display: 'flex' }}
              onClick={() => onRowClick?.(row, startIndex + index)}
            >
              {columns.map((column, colIndex) => (
                <div key={colIndex} style={{ flex: column.flex || 1 }}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Web Workers for heavy computations
export class WebWorkerManager {
  constructor() {
    this.workers = new Map();
  }

  createWorker(name, workerScript) {
    if (this.workers.has(name)) {
      this.workers.get(name).terminate();
    }

    const worker = new Worker(
      URL.createObjectURL(new Blob([workerScript], { type: 'application/javascript' }))
    );

    this.workers.set(name, worker);
    return worker;
  }

  runTask(workerName, data) {
    return new Promise((resolve, reject) => {
      const worker = this.workers.get(workerName);
      
      if (!worker) {
        reject(new Error(`Worker ${workerName} not found`));
        return;
      }

      const handleMessage = (e) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        resolve(e.data);
      };

      const handleError = (error) => {
        worker.removeEventListener('message', handleMessage);
        worker.removeEventListener('error', handleError);
        reject(error);
      };

      worker.addEventListener('message', handleMessage);
      worker.addEventListener('error', handleError);
      worker.postMessage(data);
    });
  }

  terminateWorker(name) {
    const worker = this.workers.get(name);
    if (worker) {
      worker.terminate();
      this.workers.delete(name);
    }
  }

  terminateAll() {
    this.workers.forEach((worker, name) => {
      worker.terminate();
    });
    this.workers.clear();
  }
}

export const webWorkerManager = new WebWorkerManager();

// Service Worker registration for caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
};

// Cache management
export class CacheManager {
  constructor(cacheName = 'ims-cache-v1') {
    this.cacheName = cacheName;
  }

  async cacheData(key, data, ttl = 3600000) { // 1 hour default TTL
    const cacheData = {
      data,
      timestamp: Date.now(),
      ttl
    };

    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }

  async getCachedData(key) {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (!cached) return null;

      const { data, timestamp, ttl } = JSON.parse(cached);
      
      if (Date.now() - timestamp > ttl) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return null;
    }
  }

  clearCache(pattern = null) {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        if (!pattern || key.includes(pattern)) {
          localStorage.removeItem(key);
        }
      }
    });
  }
}

export const cacheManager = new CacheManager();
