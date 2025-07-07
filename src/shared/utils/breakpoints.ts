/**
 * Common responsive breakpoints used across the application
 */
export const BREAKPOINTS = {
  TABLET: 768,     // 768px and up
  DESKTOP: 1024,   // 1024px and up
} as const;

/**
 * Helper function to check if current window width matches a breakpoint
 */
export const isBreakpoint = {
  mobile: () => window.innerWidth < BREAKPOINTS.TABLET,
  tablet: () => window.innerWidth >= BREAKPOINTS.TABLET && window.innerWidth < BREAKPOINTS.DESKTOP,
  desktop: () => window.innerWidth >= BREAKPOINTS.DESKTOP,
};

/**
 * Get responsive values based on current screen size
 */
export const getResponsiveValue = <T>(
  mobileValue: T,
  tabletValue: T,
  desktopValue: T
): T => {
  const width = window.innerWidth;
  if (width >= BREAKPOINTS.DESKTOP) {
    return desktopValue;
  } else if (width >= BREAKPOINTS.TABLET) {
    return tabletValue;
  } else {
    return mobileValue;
  }
}; 