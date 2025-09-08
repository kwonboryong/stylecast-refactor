import { useMemo } from 'react';
import { getWeatherIcon } from '../utils/weatherIcons';

export function useWeatherData() {
  const weatherIcon = useMemo(() => {
    let weatherData = null;

    try {
      const stored = localStorage.getItem('weatherData')

      if (stored) {
        weatherData = JSON.parse(stored)
      }
    } catch (error) {
      console.warn('날씨 데이터를 불러오는데 실패했습니다:', error);
    }

    const skyCondition = weatherData ? weatherData.skyCondition : '';

    return getWeatherIcon(skyCondition);
  }, [])

  return weatherIcon
}