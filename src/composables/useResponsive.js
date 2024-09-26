import { useBreakpoints } from '@vueuse/core';

export default function useResponsive() {
  const breakpoints = useBreakpoints({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  });

  const isMobile = breakpoints.smaller('md'); // Screen width below 'md'
  const isTablet = breakpoints.between('md', 'lg'); // Screen width between 'md' and 'lg'
  const isDesktop = breakpoints.greater('lg'); // Screen width above 'lg'

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
