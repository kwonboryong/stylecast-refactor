import { getSeason } from '../data/constant';

export function useSeason() {

  // 기온 ------------------------------------
  const temperatureStr = localStorage.getItem('temperature');
  const temperature = parseInt(temperatureStr, 10) || 20;

  // 월
  let month;

  const lastAccessTime = localStorage.getItem('lastAccessTime');

  if (lastAccessTime) {
    const monthStr = lastAccessTime.split('.')[1];
    month = parseInt(monthStr, 10);
  } else {
    console.error('lastAccessTime 값이 없습니다.');
    month = new Date().getMonth() + 1; // 현재 월로 설정
  }

  // 계절 판별
  const season = getSeason(month, temperature);

  console.log('현재 계절은 ' + season + '입니다.');


  return season
}