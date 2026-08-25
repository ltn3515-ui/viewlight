import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useModal } from '../context/ModalContext';

export const BnaAllPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, unreadNotiCount } = useModal();
  const [sliderPos, setSliderPos] = useState(50); // 0% ~ 100%
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setAspectRatio(naturalWidth / naturalHeight);
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    handleSliderMove(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleCardClick = (title: string, img: string) => {
    openModal('imageViewer', {
      id: 'bna-detail',
      name: title,
      price: 0,
      img: img,
      category: 'table',
    });
  };

  return (
    <div
      className="app-container"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleMouseUp}
    >
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-bna-all" className="mobile-view active">
          {/* 상단바 */}
          <header className="service-header" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: 'var(--color-text-main, #121826)' }}>chevron_left</span>
            </button>
            <div className="service-logo">
              <span className="service-logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '1.4rem', fontWeight: 800 }}>
                ViewLight
              </span>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => openModal('notification')}
                title="알림"
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: 'var(--color-text-main, #121826)' }}>notifications</span>
                {unreadNotiCount > 0 && (
                  <span className="noti-badge" style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-1px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: '2px solid #FFF',
                    boxSizing: 'border-box',
                  }}>{unreadNotiCount}</span>
                )}
              </button>
            </div>
          </header>

          {/* 스크롤 콘텐츠 영역 */}
          <div className="service-content bna-all-content" style={{ overflowY: 'auto', paddingBottom: '80px' }}>
            {/* 타이틀 */}
            <div className="bna-all-header" style={{ marginBottom: '24px' }}>
              <h2 className="bna-all-title">AI가 제안하는 공간의 변화</h2>
            </div>

            {/* 1. 인터랙티브 스플릿 슬라이더 (거실 공간 비교) */}
            <div className="bna-slider-wrapper" style={{ marginBottom: '32px' }}>
              <div
                className="bna-comparison-slider"
                id="main-bna-slider"
                ref={sliderRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'ew-resize',
                  userSelect: 'none',
                  height: 'auto',
                  aspectRatio: aspectRatio ? `${aspectRatio}` : '1.5 / 1'
                }}
              >
                {/* After 이미지 (밝은 기본 배경 - 100% width) */}
                <div className="bna-image-after" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, borderRight: 'none', zIndex: 1 }}>
                  <img src="img/livingroom.jpg" alt="거실 애프터" onLoad={handleImageLoad} style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }} />
                  <span className="bna-tag-badge after-badge" style={{ right: '12px', left: 'auto' }}>After</span>
                </div>
                
                {/* Before 이미지 (어두운 오버레이 - width 조절 가능) */}
                <div
                  className="bna-image-before"
                  id="bna-before-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: `${sliderPos}%`,
                    height: '100%',
                    overflow: 'hidden',
                    zIndex: 2,
                    transition: isDragging.current ? 'none' : 'width 0.1s ease-out',
                  }}
                >
                  <img src="img/livingroom.jpg" alt="거실 비포" style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover', maxWidth: 'none' }} />
                  <span className="bna-tag-badge before-badge" style={{ left: '12px', right: 'auto' }}>Before</span>
                </div>
                
                {/* 슬라이더 컨트롤러 핸들 */}
                <div
                  className="bna-slider-handle"
                  id="bna-slider-handle"
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${sliderPos}%`,
                    transform: 'translateX(-50%)',
                    height: '100%',
                    cursor: 'ew-resize',
                    zIndex: 10,
                    pointerEvents: 'none',
                    transition: isDragging.current ? 'none' : 'left 0.1s ease-out',
                  }}
                >
                  <div className="bna-handle-line"></div>
                  <div className="bna-handle-knob" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-dark-navy)', transform: 'none', width: 'auto', height: 'auto' }}>chevron_left</span>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-dark-navy)', transform: 'none', width: 'auto', height: 'auto' }}>chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 비포 & 애프터 갤러리 리스트 */}
            <div className="bna-showcase-list">
              {/* 쇼케이스 1: 침실 */}
              <div className="bna-showcase-card" onClick={() => handleCardClick('침실 | 따뜻한 3000K 색온도로 아늑해진 휴식 공간', 'img/light002.jpg')} style={{ cursor: 'pointer' }}>
                <div className="bna-showcase-imgs">
                  <div className="bna-showcase-img-box before-box">
                    <img src="img/light002.jpg" alt="침실 비포" className="dark-filter" />
                    <span className="mini-bna-badge before">Before</span>
                  </div>
                  <div className="bna-showcase-img-box after-box">
                    <img src="img/light002.jpg" alt="침실 애프터" className="warm-filter" />
                    <span className="mini-bna-badge after">After</span>
                  </div>
                </div>
                <div className="bna-showcase-info">
                  <h4 className="bna-showcase-title">침실 (Bedroom)</h4>
                  <p className="bna-showcase-desc">따뜻한 3000K 색온도로 아늑해진 휴식 공간</p>
                </div>
              </div>

              {/* 쇼케이스 2: 다이닝룸 */}
              <div className="bna-showcase-card" onClick={() => handleCardClick('다이닝룸 | 포인트 펜던트 조명으로 클래식한 분위기 연출', 'img/light009.jpg')} style={{ cursor: 'pointer' }}>
                <div className="bna-showcase-imgs">
                  <div className="bna-showcase-img-box before-box">
                    <img src="img/light009.jpg" alt="다이닝룸 비포" className="dark-filter" />
                    <span className="mini-bna-badge before">Before</span>
                  </div>
                  <div className="bna-showcase-img-box after-box">
                    <img src="img/light009.jpg" alt="다이닝룸 애프터" className="warm-filter" />
                    <span className="mini-bna-badge after">After</span>
                  </div>
                </div>
                <div className="bna-showcase-info">
                  <h4 className="bna-showcase-title">다이닝룸 (Dining Room)</h4>
                  <p className="bna-showcase-desc">집중도 있는 포인트 펜던트 조명으로 클래식한 분위기 연출</p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 플로팅 CTA 버튼 */}
          <button
            type="button"
            className="bna-float-scan-btn"
            id="btn-bna-float-scan"
            onClick={() => openModal('scanGuide')}
            style={{ zIndex: 5 }}
          >
            <span className="material-symbols-outlined">auto_awesome</span> 내 방도 분석하기
          </button>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
