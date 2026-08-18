import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useModal } from '../context/ModalContext';

export const CategoryAllPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const CATEGORY_ITEMS = [
    { id: 'explore-wood-hexa', title: '원목 감성 무드등', sub: 'Wooden Mood Lights', img: 'img/light001.jpg', price: 150000 },
    { id: 'explore-cozy-acrylic', title: '포근한 아크릴 무드등', sub: 'Acrylic Mood Lights', img: 'img/light002.jpg', price: 120000 },
    { id: 'explore-aurora-wave', title: '오로라 웨이브 무드등', sub: 'Aurora Wave Lights', img: 'img/light003.jpg', price: 180000 },
    { id: 'explore-smart-cube', title: '스마트 IoT 무드등', sub: 'Smart Control Lights', img: 'img/light004.jpg', price: 62000 },
    { id: 'explore-minimal-ceramic', title: '미니멀 세라믹 무드등', sub: 'Ceramic Table Lamps', img: 'img/light005.jpg', price: 135000 },
    { id: 'explore-designer-handcraft', title: '디자이너 수공예 무드등', sub: 'Handcrafted Mood Lights', img: 'img/light006.jpg', price: 250000 },
    { id: 'explore-crystal-art', title: '크리스탈 아트 무드등', sub: 'Glass Art Lamps', img: 'img/light007.jpg', price: 195000 },
    { id: 'explore-paper-folding', title: '에코 종이 폴딩 무드등', sub: 'Paper Origami Lights', img: 'img/light008.jpg', price: 89000 },
    { id: 'explore-brass-pendant', title: '황동 미니멀 펜던트 무드등', sub: 'Pendant Mood Lights', img: 'img/light009.jpg', price: 210000 },
    { id: 'explore-camping-portable', title: '실외 포터블 캠핑 무드등', sub: 'Outdoor Portable Lights', img: 'img/light010.jpg', price: 98000 },
  ];

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-category-all" className="mobile-view active">
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
          <div className="service-content category-all-content">
            <div className="category-all-header">
              <h2 className="category-all-title">제품 둘러보기</h2>
              <p className="category-all-desc">
                당신의 공간을 완벽하게 밝혀줄 ViewLight의 프리미엄 무드등 컬렉션을 만나보세요. 빛과 그림자의 조화로움이 선사하는 새로운 차원의 인테리어를 경험하실 수 있습니다.
              </p>
            </div>

            {/* 10종 무드등 카드 목록 */}
            <div className="category-cards-list">
              {CATEGORY_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className="category-list-card"
                  style={{ backgroundImage: `url('${item.img}')`, cursor: 'pointer' }}
                  onClick={() => openModal('productDetail', {
                    id: item.id,
                    name: item.title,
                    price: item.price,
                    img: item.img,
                    category: 'table'
                  })}
                >
                  <div className="category-overlay-box">
                    <div className="cat-card-text">
                      <h4 className="cat-card-main-title">{item.title}</h4>
                      <p className="cat-card-sub-title">{item.sub}</p>
                    </div>
                    <span className="material-symbols-outlined cat-card-arrow">east</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
