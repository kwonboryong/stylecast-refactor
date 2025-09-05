import { useCallback } from 'react';
import pb from './../api/pocketbase';

export function useRefresh({ lookBookItems, setLookBookItems, season, swiperRef }) {
  const handleRefresh = useCallback(async () => {
    try {
      const items = await pb.collection('lookBook').getFullList();

      // 현재 착용샷의 id 배열로 만듦(중복 방지)
      const currentSeasonItemIds = lookBookItems.map((item) => item.id);

      // 계절용 - 새로운 아이템(중복 X)
      const newSeasonItems = items
        .filter(
          (item) => item.lookBookSeason.includes(season) && !currentSeasonItemIds.includes(item.id)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

      // 범용 - 새로운 아이템(중복 X)
      const newAllSeasonItems = items
        .filter(
          (item) => item.lookBookSeason.includes('범용') && !currentSeasonItemIds.includes(item.id)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      // 새로운 착용샷(계절용 + 범용) 업데이트
      const newLookBookItems = [...newSeasonItems, ...newAllSeasonItems];

      setLookBookItems(newLookBookItems);

      // 새로운 착용샷 세션에 저장
      // - 상세 페이지에서 돌아올 시 착용샷 유지를 위함
      sessionStorage.setItem('lookBookItems', JSON.stringify(newLookBookItems));

      // 첫 번째 슬라이드로 돌아오기
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(0);
      }
    } catch (error) {
      console.error('새로고침 중 에러 발생:', error);
    }
  }, [lookBookItems, setLookBookItems, season, swiperRef]);

  return { handleRefresh }
}