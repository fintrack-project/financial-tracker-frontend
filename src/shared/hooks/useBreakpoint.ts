import { useState, useEffect } from 'react';
import { 
  BREAKPOINTS, 
  BreakpointName, 
  getCurrentBreakpoint, 
  createBreakpointListener 
} from '../utils/breakpoints';

/**
 * React hook for responsive breakpoint detection
 * Provides real-time breakpoint state and utility functions
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointName>(() => 
    getCurrentBreakpoint()
  );

  useEffect(() => {
    const updateBreakpoint = () => setBreakpoint(getCurrentBreakpoint());
    
    // Create listeners for all breakpoints
    const cleanupFunctions = Object.keys(BREAKPOINTS).map(bp => 
      createBreakpointListener(bp as BreakpointName, updateBreakpoint)
    );
    
    return () => cleanupFunctions.forEach(cleanup => cleanup());
  }, []);

  return {
    current: breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet', 
    isDesktop: breakpoint === 'desktop',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
    isTabletOrDesktop: breakpoint === 'tablet' || breakpoint === 'desktop'
  };
};

/**
 * Hook to get responsive values based on current breakpoint
 */
export const useResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}) => {
  const { current } = useBreakpoint();
  
  switch (current) {
    case 'mobile':
      return values.mobile;
    case 'tablet':
      return values.tablet ?? values.desktop;
    case 'desktop':
      return values.desktop;
    default:
      return values.desktop;
  }
};

/**
 * Hook to conditionally apply CSS classes based on breakpoint
 */
export const useBreakpointClasses = () => {
  const { current } = useBreakpoint();
  
  return {
    base: `breakpoint-${current}`,
    mobile: current === 'mobile' ? 'is-mobile' : '',
    tablet: current === 'tablet' ? 'is-tablet' : '',
    desktop: current === 'desktop' ? 'is-desktop' : '',
    mobileOrTablet: (current === 'mobile' || current === 'tablet') ? 'is-mobile-or-tablet' : '',
    tabletOrDesktop: (current === 'tablet' || current === 'desktop') ? 'is-tablet-or-desktop' : ''
  };
}; 