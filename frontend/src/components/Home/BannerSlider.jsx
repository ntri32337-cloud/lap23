    import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function BannerSlider() {
  return (
    <div className="hero-slider">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3500 }}
        pagination={{ clickable: true }}
        loop={true}
      >
        <SwiperSlide>
          <img src="/img/banner-bia.jpg" className="hero-img"/>
        </SwiperSlide>

        <SwiperSlide>
          <img src="/img/banner2.jpg" className="hero-img"/>
        </SwiperSlide>

        <SwiperSlide>
          <img src="/img/banner3.jpg" className="hero-img"/>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}