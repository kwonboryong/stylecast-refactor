import { NavLink } from 'react-router-dom';
import styles from './../../styles/pages/LookBookpage.module.scss';
import getPbImageURL from './../../api/getPbImageURL';
import { Swiper, SwiperSlide } from 'swiper/react';
import { A11y, Keyboard, Pagination, Scrollbar } from 'swiper/modules';
import 'swiper/scss';
import 'swiper/scss/pagination';

export default function LookBookSwiper({ lookBookItems, handleImageClick, swiperRef }) {
  return (
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
  );
}
