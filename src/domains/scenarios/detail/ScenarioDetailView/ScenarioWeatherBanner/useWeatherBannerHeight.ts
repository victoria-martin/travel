import { useEffect, useRef } from 'react';

// Publishes the banner's height on .main, so the route trail can stick right under it.
export function useWeatherBannerHeight() {
  const bannerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const banner = bannerRef.current;
    const main = banner?.closest<HTMLElement>('.main');
    if (!banner || !main) return;
    const observer = new ResizeObserver(() =>
      main.style.setProperty('--weather-banner-h', `${banner.offsetHeight}px`),
    );
    observer.observe(banner);
    return () => {
      observer.disconnect();
      main.style.removeProperty('--weather-banner-h');
    };
  }, []);
  return bannerRef;
}
