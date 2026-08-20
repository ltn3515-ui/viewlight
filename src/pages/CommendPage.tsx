import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useModal } from '../context/ModalContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface CurationListItem {
  id: string;
  name: string;
  price: number;
  img: string;
  category: 'table' | 'floor' | 'ambient' | 'smart' | 'pendant';
  sceneBadge: string;
  curationDesc: string;
  spec: string;
}

const curationItems: CurationListItem[] = [
  {
    id: 'rec-brass-pendant',
    name: '황동 미니멀 펜던트 무드등',
    price: 490000,
    img: 'img/light009.jpg',
    category: 'pendant',
    sceneBadge: 'SCENE 01',
    curationDesc: '드라마틱하고 낮게 드리워진 펜던트 조명이 직사광 없이 부드러운 안락함을 연출합니다.',
    spec: '2700K~6500K / 1200 Lux',
  },
  {
    id: 'rec-neo-able',
    name: '네오 에블 라이트',
    price: 200000,
    img: 'img/Stand03.png',
    category: 'table',
    sceneBadge: 'SCENE 02',
    curationDesc: '부드럽고 자연스럽게 스며드는 간접 조명으로 수면 및 휴식 분위기 연출에 최적화되어 있습니다.',
    spec: '3000K Warm / 무단계 디밍',
  },
  {
    id: 'rec-wood-hexa',
    name: '원목 감성 무드등',
    price: 75000,
    img: 'img/light001.jpg',
    category: 'table',
    sceneBadge: 'SCENE 03',
    curationDesc: '천연 우드 결이 자연광 반사 무드와 극치 융합을 이루어 따뜻한 베이지 감성을 형성합니다.',
    spec: '친환경 원목 / USB 타입',
  },
  {
    id: 'rec-smart-cube',
    name: '스마트 큐브 무드등',
    price: 49000,
    img: 'img/light004.jpg',
    category: 'smart',
    sceneBadge: 'SCENE 04',
    curationDesc: '다채로운 RGB 색조 조합을 모바일 앱으로 실시간 타이머 및 맞춤 제어할 수 있습니다.',
    spec: 'Smart App / 1600만 컬러',
  },
  {
    id: 'rec-aura-floor',
    name: '아우라 플로어 램프',
    price: 180000,
    img: 'img/img002.png',
    category: 'floor',
    sceneBadge: 'SCENE 05',
    curationDesc: '넓은 공간의 음영을 매끄럽게 보정해주며 모던 인테리어와 수려한 일체감을 제공합니다.',
    spec: '플로어형 / 220V 코드',
  },
  {
    id: 'rec-luna-shade',
    name: '루나 쉐이드 테이블 램프',
    price: 90000,
    img: 'img/Stand01.jpg',
    category: 'table',
    sceneBadge: 'SCENE 06',
    curationDesc: '클래식한 쉐이드 디자인으로 독서등 및 침실 무드등으로 은은하게 빛을 발산합니다.',
    spec: 'E26 소켓 / 패브릭 갓',
  },
];

export const CommendPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleBulkAdd = () => {
    addToCart('황동 미니멀 펜던트 무드등', 490000, 'img/light009.jpg', 'rec-pendant-1');
    addToCart('네오 에블 라이트', 200000, 'img/Stand03.png', 'rec-stand-2');
    showToast('🛒 [추천 무드등 2종 세트]가 장바구니에 담겼습니다! (세트 20% 할인 혜택 적용)');
  };

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-curation-report" className="mobile-view active">
          {/* Curation Report Header with Back Button */}
          <header className="service-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg-cream)' }}>
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="service-logo" style={{ flex: 1, textAlign: 'center' }}>
              <span
                className="service-logo-text"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              >
                ViewLight
              </span>
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => openModal('notification')}
                title="알림"
                style={{ position: 'relative' }}
              >
                <span className="material-symbols-outlined">notifications</span>
                <span
                  className="noti-badge"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    padding: '2px 5px',
                  }}
                >
                  2
                </span>
              </button>
            </div>
          </header>

          <div
            className="service-content report-content"
            style={{
              padding: '16px 20px 140px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* 1. AI 공간 분석 요약 카드 */}
            <div className="report-summary-card">
              <h4 className="report-summary-title">AI 공간 분석 요약</h4>
              <p className="report-summary-desc">
                분석된 공간은 부드러운 자연광과 뉴트럴한 색조가 돋보입니다. 이에 어울리는 조명 무드를 제안합니다.
              </p>
              <div className="report-tag-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <span className="report-summary-tag">따뜻한 웜 미니멀리스트</span>
                <span className="report-summary-tag">부드러운 베이지 톤</span>
                <span className="report-summary-tag">로우 컨트라스트</span>
              </div>
            </div>

            {/* 2. 대표 공간 오리지널 룸 카드 */}
            <div
              className="report-room-card"
              style={{
                backgroundImage: "url('img/livingroom.jpg')",
                position: 'relative',
                width: '100%',
                height: '190px',
                minHeight: '190px',
                flexShrink: 0,
                borderRadius: '24px',
                overflow: 'hidden',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                boxSizing: 'border-box',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="room-overlay-content" style={{ position: 'relative', zIndex: 2 }}>
                <span
                  className="room-top-tag"
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    color: '#FFF',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                  }}
                >
                  ORIGINAL
                </span>
                <h3 className="room-main-title" style={{ color: '#FFF', fontSize: '1.5rem', fontWeight: 800, margin: '6px 0 0 0' }}>
                  Living Room
                </h3>
              </div>
              <button
                type="button"
                className="room-ar-btn"
                onClick={() => openModal('cameraScan')}
                style={{
                  alignSelf: 'flex-end',
                  zIndex: 2,
                  background: '#FFAB40',
                  color: '#121826',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(255,171,64,0.4)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  center_focus_strong
                </span>
                <span>AR 체험</span>
              </button>
            </div>

            {/* 3. 추천 무드등 가로 캐러셀 */}
            <div className="report-rec-section">
              <div
                className="report-rec-header"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}
              >
                <h4 className="report-rec-title" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  추천 무드등
                </h4>
              </div>

              <div
                className="report-carousel-container"
                style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '12px' }}
              >
                {curationItems.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="report-rec-card"
                    onClick={() => openModal('productDetail', item)}
                    style={{
                      flex: '0 0 240px',
                      background: 'var(--color-bg-card)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="report-card-img-box" style={{ position: 'relative', height: '140px' }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span
                        className="scene-badge"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          background: '#FFAB40',
                          color: '#121826',
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.sceneBadge}
                      </span>
                    </div>
                    <div className="report-card-body" style={{ padding: '16px' }}>
                      <h5
                        className="report-card-title"
                        style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px 0', color: 'var(--color-text-main)' }}
                      >
                        {item.name}
                      </h5>
                      <p
                        className="report-card-desc"
                        style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: '0 0 12px 0', lineHeight: 1.4 }}
                      >
                        {item.curationDesc}
                      </p>
                      <span
                        className="report-card-price"
                        style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--color-text-main)' }}
                      >
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. AI 큐레이터 리스트 목록 (이미지 + 상세 큐레이션 설명 리스트) */}
            <div className="report-curation-list-section" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main, #121826)', margin: 0 }}>
                  ✨ 큐레이션 상세 목록
                </h4>
                <span style={{ fontSize: '0.78rem', color: '#FFAB40', fontWeight: 800 }}>전체 6개 큐레이션</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {curationItems.map((item) => (
                  <div
                    key={`list-${item.id}`}
                    style={{
                      background: 'var(--color-bg-card, #FFFFFF)',
                      borderRadius: '20px',
                      border: '1px solid var(--color-border, #E2E8F0)',
                      padding: '16px',
                      display: 'flex',
                      gap: '14px',
                      boxShadow: 'var(--shadow-card, 0 4px 12px rgba(0,0,0,0.05))',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                    onClick={() => openModal('productDetail', item)}
                  >
                    <div style={{ position: 'relative', width: '95px', height: '95px', borderRadius: '14px', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          background: '#FFAB40',
                          color: '#121826',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        {item.sceneBadge}
                      </span>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h5 style={{ fontSize: '0.98rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                        {item.name}
                      </h5>
                      <p style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0, lineHeight: 1.45, wordBreak: 'keep-all' }}>
                        {item.curationDesc}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ background: '#FAF6EE', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', color: '#64748B' }}>
                          {item.spec}
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
                          {item.price.toLocaleString()}원
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item.name, item.price, item.img, item.id);
                            showToast(`🛒 [${item.name}]가 장바구니에 담겼습니다!`);
                          }}
                          style={{
                            height: '38px',
                            padding: '0 16px',
                            background: '#FFAB40',
                            color: '#121826',
                            border: 'none',
                            borderRadius: '19px',
                            fontSize: '0.85rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(255, 171, 64, 0.35)',
                          }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>shopping_bag</span>
                          <span>담기</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. 일괄 담기 버튼 (높이 72px 대형 알약 버튼) */}
            <button
              type="button"
              className="btn-report-bulk-cart"
              onClick={handleBulkAdd}
              style={{
                width: '100%',
                height: '72px',
                minHeight: '72px',
                borderRadius: '36px',
                backgroundColor: '#FFAB40',
                color: '#121826',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.96rem',
                letterSpacing: '-0.3px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                cursor: 'pointer',
                boxShadow: '0 10px 28px rgba(255, 171, 64, 0.5)',
                marginTop: '24px',
                marginBottom: '20px',
                padding: '16px 24px',
                boxSizing: 'border-box',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
                shopping_bag
              </span>
              <span>추천 무드등 일괄 담기 (690,000원)</span>
            </button>
          </div>
          <BottomNav />
        </div>
      </main>
    </div>
  );
};
