import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export function useResponsive() {
  const [width, setWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => {
      setWidth(window.width);
    });
    return () => sub.remove();
  }, []);

  return {
    width,
    isMobile: width <= 480,
    isLargeMobile: width > 480 && width <= 767,
    isTablet: width >= 768 && width <= 1024,
    isDesktop: width > 1024,
  };
}

export default useResponsive;
