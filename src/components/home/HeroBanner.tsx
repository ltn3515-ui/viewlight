import React from 'react';
import { useModal } from '../../context/ModalContext';

export const HeroBanner: React.FC = () => {
  const { openModal } = useModal();

  return (
    <>
      {/* 최상단 AI 퀵 버튼 */}
      <section className="section-quick-cta">
        <button
          type="button"
          id="btn-mobile-scan"
          className="quick-cta-badge"
          onClick={() => openModal('cameraScan')}
          style={{ width: '100%', border: 'none', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">photo_camera</span>
          사진 1장으로 내 방 맞춤 무드등 찾기
        </button>
      </section>

      {/* 히어로 섹션 */}
      <section className="section-hero">
        <div className="hero-card">
          <span className="hero-tag">
            <span className="material-symbols-outlined tag-icon">auto_awesome</span>
            AI-Driven Vision Tech
          </span>
          <h2 className="hero-title">당신만의 인생 무드등을 찾아보세요.</h2>
          <p className="hero-desc">
            당신의 공간을 완성하는 <strong className="text-primary">큐레이션 앰비언트 테크</strong>. AI 비전이 방을 분석하여 최적의 무드와 분위기를 추천해드립니다.
          </p>
        </div>

        {/* 메인 조명 대표 컷 */}
        <div
          className="main-lamp-card"
          onClick={() => openModal('productDetail', {
            id: 'aura-floor',
            name: '아우라 플로어 램프',
            price: 180000,
            img: 'img/img002.png',
            category: 'floor',
            badge: '따뜻한 앰비언트 광'
          })}
          style={{ cursor: 'pointer' }}
        >
          <img src="img/img002.png" alt="아우라 플로어 램프" className="main-lamp-img" />
          <div className="lamp-info-overlay">
            <div>
              <div className="lamp-name">아우라 플로어 램프</div>
              <div className="lamp-sub">따뜻한 앰비언트 광</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
