/**
 * FinTrack Platform - Active Breakpoint Utilities
 * Provides JavaScript/TypeScript utilities for responsive design
 * that actively use our standardized breakpoint system
 */

// Breakpoint definitions (matching our CSS)
export const BREAKPOINTS = {
  mobile: {
    max: 768,
    min: 0,
    mediaQuery: '(max-width: 768px)'
  },
  tablet: {
    max: 1023,
    min: 769,
    mediaQuery: '(min-width: 769px) and (max-width: 1023px)'
  },
  desktop: {
    max: Infinity,
    min: 1024,
    mediaQuery: '(min-width: 1024px)'
  }
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;

/**
 * Get current active breakpoint based on window width
 */
export const getCurrentBreakpoint = (): BreakpointName => {
  if (typeof window === 'undefined') return 'desktop'; // SSR fallback
  
  const width = window.innerWidth;
  
  if (width <= BREAKPOINTS.mobile.max) return 'mobile';
  if (width >= BREAKPOINTS.tablet.min && width <= BREAKPOINTS.tablet.max) return 'tablet';
  return 'desktop';
};

/**
 * Check if current viewport matches specific breakpoint
 */
export const isBreakpoint = (breakpoint: BreakpointName): boolean => {
  return getCurrentBreakpoint() === breakpoint;
};

/**
 * Check if current viewport is mobile
 */
export const isMobile = (): boolean => isBreakpoint('mobile');

/**
 * Check if current viewport is tablet
 */
export const isTablet = (): boolean => isBreakpoint('tablet');

/**
 * Check if current viewport is desktop
 */
export const isDesktop = (): boolean => isBreakpoint('desktop');

/**
 * Check if current viewport is mobile OR tablet (non-desktop)
 */
export const isMobileOrTablet = (): boolean => {
  const current = getCurrentBreakpoint();
  return current === 'mobile' || current === 'tablet';
};

/**
 * Check if current viewport is tablet OR desktop (non-mobile)
 */
export const isTabletOrDesktop = (): boolean => {
  const current = getCurrentBreakpoint();
  return current === 'tablet' || current === 'desktop';
};

/**
 * Create a media query listener for a specific breakpoint
 */
export const createBreakpointListener = (
  breakpoint: BreakpointName,
  callback: (matches: boolean) => void
): (() => void) => {
  if (typeof window === 'undefined') return () => {}; // SSR fallback
  
  const mediaQuery = window.matchMedia(BREAKPOINTS[breakpoint].mediaQuery);
  
  // Initial call
  callback(mediaQuery.matches);
  
  // Add listener
  const listener = (e: MediaQueryListEvent) => callback(e.matches);
  mediaQuery.addEventListener('change', listener);
  
  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', listener);
};

/**
 * Get responsive value based on current breakpoint
 */
export const getResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop: T;
}): T => {
  const current = getCurrentBreakpoint();
  
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
 * CSS class utilities for conditional styling
 */
export const getBreakpointClasses = (breakpoint?: BreakpointName) => {
  const current = breakpoint || getCurrentBreakpoint();
  
  return {
    base: `breakpoint-${current}`,
    mobile: current === 'mobile' ? 'is-mobile' : '',
    tablet: current === 'tablet' ? 'is-tablet' : '',
    desktop: current === 'desktop' ? 'is-desktop' : '',
    mobileOrTablet: (current === 'mobile' || current === 'tablet') ? 'is-mobile-or-tablet' : '',
    tabletOrDesktop: (current === 'tablet' || current === 'desktop') ? 'is-tablet-or-desktop' : ''
  };
};

/**
 * Debug utility to log current breakpoint info
 */
export const debugBreakpoint = () => {
  if (typeof window === 'undefined') return;
  
  const current = getCurrentBreakpoint();
  const width = window.innerWidth;
  
  console.log('🔍 Breakpoint Debug:', {
    current,
    windowWidth: width,
    breakpointRange: BREAKPOINTS[current],
    classes: getBreakpointClasses(current)
  });
};

/**
 * React hooks are available in '../hooks/useBreakpoint'
 * This utility file focuses on vanilla JavaScript/TypeScript utilities
 */ 