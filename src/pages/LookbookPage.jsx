import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import styles from './../styles/pages/LookBookpage.module.scss';
import pb from '../api/pocketbase';
import { Helmet } from 'react-helmet-async';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';
import { WeatherIcon } from '../components/LookBook/WeatherIcon';
import { RefreshButton } from '../components/LookBook/RefreshButton';
import { useSeason } from '../hooks/useSeason';
import { useWeatherIcon } from '../hooks/useWeatherIcon';
import { useRefresh } from '../hooks/useRefresh';

const LookBookSwiper = lazy(() => import('@/components/LookBook/LookBookSwiper'));

function LookBookPage() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  // 날씨 아이콘
  const weatherIcon = useWeatherIcon();

  // 계절 판별
  const season = useSeason();

  // 전체 착용샷
  const [lookBookItems, setLookBookItems] = useState([]);

  // 현재 착용샷
  const [, setCurrentSeasonItems] = useState([]);

  // 현재 경로 저장
  // - 룩북p / 룩북 상세p 구분을 위함
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/lookbook/');

  useEffect(() => {
    const fetchLookBookItems = async () => {
      try {
        // 세션에서 상태 복원 ----------------------
        // - 상세 페이지에서 돌아올 시 착용샷 유지를 위함
        const savedLookBookItems = sessionStorage.getItem('lookBookItems');

        if (savedLookBookItems) {
          setLookBookItems(JSON.parse(savedLookBookItems));

          return;
        }

        // 착용샷 가져오기 --------------------------
        const items = await pb.collection('lookBook').getFullList();

        // 계절용 룩북 (2개)
        const seasonItems = items
          .filter((item) => item.lookBookSeason.includes(season))
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        // 범용 룩북 (3개)
        const allSeasonItems = items
          .filter((item) => item.lookBookSeason.includes('범용'))
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        // 현재 착용샷 - 업데이트
        setCurrentSeasonItems({ seasonItems, allSeasonItems });

        // 전체 챡용샷 - 업데이트
        setLookBookItems([...seasonItems, ...allSeasonItems]);

        // 전체 착용샷 - 세션에 저장
        // - 상세 페이지에서 돌아올 시 착용샷 유지를 위함
        sessionStorage.setItem(
          'lookBookItems',
          JSON.stringify([...seasonItems, ...allSeasonItems])
        );
      } catch (error) {
        console.error('착용샷 데이터를 가져오는 중 에러 발생:', error);
      }
    };

    fetchLookBookItems();
  }, [season]);

  // 새로고침
  const { handleRefresh } = useRefresh(lookBookItems, setLookBookItems, season, swiperRef);

  // 착용샷 클릭 시 상세 페이지로 이동
  const handleImageClick = (item) => {
    navigate(`/lookbook/${item.id}`);
  };

  // 스와이퍼 네비게이션 버튼
  const goNext = () => {
    swiperRef.current.swiper.slideNext();
  };

  const goPrev = () => {
    swiperRef.current.swiper.slidePrev();
  };

  return isDetailPage ? (
    <Outlet />
  ) : (
    <>
      <Helmet>
        <title>룩북 페이지 | StyleCast - 나만의 스타일 캐스트</title>
        <meta property="og:title" content="룩북 페이지 | StyleCast - 나만의 스타일 캐스트" />
        <meta property="twitter:title" content="룩북 페이지 | StyleCast - 나만의 스타일 캐스트" />
        <meta name="description" content="날씨에 따른 옷차림을 추천해주는 StyleCast" />
        <meta property="og:description" content="날씨에 따른 옷차림을 추천해주는 StyleCast" />
        <meta
          name="keywords"
          content="날씨, 기온, 옷차림, 뭐입지, 입을옷, 의류, 기상정보, 룩북, 체형, 퍼스널컬러"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://stylecast.netlify.app/image/og-sc.png" />
        <meta property="og:url" content="https://stylecast.netlify.app/" />
        <meta property="og:site:author" content="TopTen" />
        <link rel="canonical" href="https://stylecast.netlify.app/lookbook" />
      </Helmet>

      <div className={styles.wrapComponent}>
        <header className={styles.topWrapper}>
          <h1 className={styles.title}>Look Book : OOTD</h1>

          <RefreshButton onRefresh={handleRefresh} />
        </header>

        <main>
          <WeatherIcon weatherIcon={weatherIcon} />

          <div className={styles.subTitle}>
            <p className={styles.description}>
              오늘 날씨엔 <br />
              이런 스타일 어때요?
            </p>

            <div className={styles.swiperBtn}>
              <button
                className={styles.goPrev}
                type="button"
                onClick={goPrev}
                aria-label="이전 룩북 보기"
                title="이전 룩북 보기"
              >
                <GoChevronLeft aria-hidden="true" />
              </button>
              <button
                className={styles.goNext}
                type="button"
                onClick={goNext}
                aria-label="다음 룩북 보기"
                title="다음 룩북 보기"
              >
                <GoChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className={styles.outfitSwiper}>
            <Suspense
              fallback={
                <div aria-live="polite" style={{ padding: 16 }}>
                  룩북 페이지 로딩 중…
                </div>
              }
            >
              <LookBookSwiper
                swiperRef={swiperRef}
                lookBookItems={lookBookItems}
                handleImageClick={handleImageClick}
              />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  );
}

export default LookBookPage;
