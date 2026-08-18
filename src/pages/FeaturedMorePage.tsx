import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useModal } from '../context/ModalContext';

export const FeaturedMorePage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-featured-more" className="mobile-view active">
          {/* 상단바 */}
          <header className="service-header">
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="service-logo">
              <span className="service-logo-text">ViewLight</span>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => openModal('notification')}
              >
                <span className="material-symbols-outlined">notifications</span>
              </button>
            </div>
          </header>

          {/* 스크롤 콘텐츠 영역 */}
          <div className="service-content featured-more-content">
            {/* 타이틀 및 설명 */}
            <div className="featured-rec-header">
              <h2 className="featured-rec-title">이달의 추천 조명</h2>
              <p className="featured-rec-desc">
                빛은 단순한 밝기를 넘어 공간의 온도와 분위기를 결정합니다. 당신의 일상에 따뜻한 위로를 더해줄 프리미엄 조명 셀렉션을 만나보세요.
              </p>
            </div>

            {/* 메인 추천 펜던트 배너 카드 */}
            <div
              className="pendant-main-card"
              onClick={() => openModal('productDetail', {
                id: 'aurora-brass',
                name: '오로라 브라스 펜던트',
                price: 450000,
                img: 'img/Transformation Card 2.png',
                category: 'pendant',
                badge: "Editor's Pick"
              })}
              style={{ cursor: 'pointer' }}
            >
              <div className="pendant-banner-box">
                <img src="img/Transformation Card 2.png" alt="오로라 브라스 펜던트" />
              </div>
              <div className="pendant-info-box">
                <span className="editors-pick-badge">Editor's Pick</span>
                <h3 className="pendant-title">오로라 브라스 펜던트</h3>
                <p className="pendant-price">450,000 원</p>

                <div className="quote-box-card">
                  <p className="quote-text">
                    "정제된 황동 소재와 따뜻한 빛의 조화가 다이닝 공간을 클래식하게 연출해줍니다. 시간의 흐름에 따라 깊어지는 질감을 경험해보세요."
                  </p>
                </div>

                {/* 속성 태그들 */}
                <div className="pendant-tags-row">
                  <span className="pendant-tag">2700K~6500K</span>
                  <span className="pendant-tag">Smart Control</span>
                  <span className="pendant-tag">Dimmable</span>
                </div>

                {/* 자세히 보기 버튼 */}
                <button
                  type="button"
                  className="btn-detailed-view"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal('productDetail', {
                      id: 'aurora-brass',
                      name: '오로라 브라스 펜던트',
                      price: 450000,
                      img: 'img/Transformation Card 2.png',
                      category: 'pendant'
                    });
                  }}
                >
                  자세히 보기 <span className="material-symbols-outlined">arrow_right_alt</span>
                </button>
              </div>
            </div>

            {/* 컬렉션 둘러보기 섹션 */}
            <div className="collection-explore-section">
              <div className="collection-header-row">
                <h4 className="collection-section-title">컬렉션 둘러보기</h4>
                <div className="carousel-nav-arrows">
                  <button
                    type="button"
                    className="nav-arrow-btn"
                    onClick={() => scrollCarousel('left')}
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    className="nav-arrow-btn"
                    onClick={() => scrollCarousel('right')}
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* 수평 스크롤 캐러셀 컨테이너 */}
              <div className="collection-carousel-container" ref={carouselRef}>
                {/* 카드 1 */}
                <div
                  className="collection-product-card"
                  onClick={() => openModal('productDetail', {
                    id: 'lumina-floor',
                    name: '루미나 플로어 아크',
                    price: 220000,
                    img: 'img/Stand05.jpg',
                    category: 'floor'
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="col-card-thumb">
                    <img src="img/Stand05.jpg" alt="Lumina Floor Arc" />
                  </div>
                  <div className="col-card-info">
                    <h5 className="col-product-name">루미나 플로어 아크</h5>
                    <p className="col-product-price">220,000 원</p>
                    <div className="col-product-tags">
                      <span className="col-tag">Living</span>
                      <span className="col-tag">Natural Modern</span>
                    </div>
                  </div>
                </div>

                {/* 카드 2 */}
                <div
                  className="collection-product-card"
                  onClick={() => openModal('productDetail', {
                    id: 'neo-able',
                    name: '네오 에블 라이트',
                    price: 180000,
                    img: 'img/Stand03.png',
                    category: 'table'
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="col-card-thumb">
                    <img src="img/Stand03.png" alt="Mellow Stand Light" />
                  </div>
                  <div className="col-card-info">
                    <h5 className="col-product-name">네오 에블 라이트</h5>
                    <p className="col-product-price">180,000 원</p>
                    <div className="col-product-tags">
                      <span className="col-tag">Bedroom</span>
                      <span className="col-tag">Minimalist</span>
                    </div>
                  </div>
                </div>

                {/* 카드 3 */}
                <div
                  className="collection-product-card"
                  onClick={() => openModal('productDetail', {
                    id: 'ambient-strip',
                    name: '엠비언트 스트립',
                    price: 62000,
                    img: 'img/Stand04.png',
                    category: 'ambient'
                  })}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="col-card-thumb">
                    <img src="img/Stand04.png" alt="Smart Light" />
                  </div>
                  <div className="col-card-info">
                    <h5 className="col-product-name">엠비언트 스트립</h5>
                    <p className="col-product-price">62,000 원</p>
                    <div className="col-product-tags">
                      <span className="col-tag">Smart IoT</span>
                      <span className="col-tag">Ambient</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
