import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GoChevronLeft, GoChevronRight } from 'react-icons/go';

import { useNavigate, Outlet, useLocation, NavLink } from 'react-router-dom';
import { A11y, Keyboard, Pagination, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/pagination';
import getPbImageURL from './../api/getPbImageURL';
import pb from './../api/pocketbase';

import styles from './../styles/pages/Lookbookpage.module.scss';
import { getWeatherIcon } from './../utils/weatherIcons';
import { getSeason } from './../data/constant';
import { WeatherIcon } from './../components/LookBook/WeatherIcon';
import { RefreshButton } from './../components/LookBook/RefreshButton';
import { useRefresh } from './../hooks/useRefresh';

function LookbookPage() {
  const navigate = useNavigate();
  const swiperRef = useRef(null);

  // 날씨 아이콘
  const weatherData = JSON.parse(localStorage.getItem('weatherData'));
  const skyCondition = weatherData ? weatherData.skyCondition : '';
  const weatherIcon = getWeatherIcon(skyCondition);

  // 전체 착용샷
  const [lookBookItems, setLookBookItems] = useState([]);

  // 현재 착용샷
  const [, setCurrentSeasonItems] = useState([]);

  // 현재 경로 저장
  // - 룩북p / 룩북 상세p 구분을 위함
  const location = useLocation();
  const isDetailPage = location.pathname.startsWith('/lookbook/');

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

        // 전체 착용샷 - 세션에 저장 --------------------------
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

  // 스와이퍼 네비게이션 버튼 -----------------------
  const goNext = () => {
    swiperRef.current.swiper.slideNext();
  };

  const goPrev = () => {
    swiperRef.current.swiper.slidePrev();
  };

  // 착용샷 클릭 시 착용샷 상세 페이지로 이동 ------
  const handleImageClick = (item) => {
    navigate(`/lookbook/${item.id}`);
  };

  // 새로고침
  const { handleRefresh } = useRefresh(lookBookItems, setLookBookItems, season, swiperRef);

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
        <link rel="canonical" href="https://stylecast.netlify.app/" />
      </Helmet>

      <div className={styles.wrapComponent}>
        <div className={styles.topWrapper}>
          <h2 className={styles.title}>Look Book : OOTD</h2>

          <RefreshButton onRefresh={handleRefresh} />
        </div>

        <WeatherIcon weatherIcon={weatherIcon} />

        <div className={styles.subTitle}>
          <p className={styles.description}>
            오늘 날씨엔 <br />
            이런 스타일 어때요?
          </p>

          <div className={styles.swiperBtn}>
            <button className={styles.goPrev} type="button" onClick={goPrev}>
              <GoChevronLeft />
            </button>
            <button className={styles.goNext} type="button" onClick={goNext}>
              <GoChevronRight />
            </button>
          </div>
        </div>

        <div className={styles.outfitSwiper}>
          <Swiper
            className={styles.swiper}
            modules={[Pagination, Scrollbar, A11y, Keyboard]}
            spaceBetween={20}
            slidesPerView={1.2}
            loop={lookBookItems.length > 1}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            a11y={{
              prevSlideMessage: '이전 슬라이드',
              nextSlideMessage: '다음 슬라이드',
              paginationBulletMessage: '페이지 {{index}}',
            }}
            ref={swiperRef}
          >
            {lookBookItems.length > 0 ? (
              lookBookItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <NavLink to={`/lookbook/${item.id}`}>
                    <img
                      src={getPbImageURL(item, 'outfitImage')}
                      alt={item.lookBookTitle}
                      className={styles.outfitImage}
                      onClick={() => handleImageClick(item)}
                    />
                  </NavLink>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>계절에 맞는 착용샷이 없습니다.</SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default LookbookPage;
