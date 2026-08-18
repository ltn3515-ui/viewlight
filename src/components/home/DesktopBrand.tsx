import React from 'react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const DesktopBrand: React.FC = () => {
  const { openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent, name: string, price: number, img: string) => {
    e.stopPropagation();
    addToCart(name, price, img);
    showToast(`🛒 [${name}]가 장바구니에 담겼습니다!`);
  };

  return (
    <aside className="desktop-brand-section">
      <div className="brand-content-wrapper">
        <div className="brand-logo">
          <span className="logo-text">ViewLight</span>
        </div>

        <div className="brand-header">
          <h1 className="brand-title">
            사진 1장, 단 3초 만에<br />
            당신만의 인생 무드등을<br />
            <span className="highlight">찾아보세요</span>
          </h1>
          <p className="brand-subcopy">
            당신의 공간을 완성하는 <span className="highlight">큐레이션 앰비언트 테크</span>.<br />
            AI 비전이 방을 분석하여 최적의 무드와 분위기를 추천해드립니다.
          </p>
        </div>

        <div className="brand-btn-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal('aiTech')}
          >
            3초 AI 공간 분석 시작하기
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => openModal('coupon')}
          >
            ✨ 첫 방문 15% 세트 할인 쿠폰팩 받기 ➔
          </button>
        </div>

        <div className="brand-thumbs-grid">
          {/* 카드 1 */}
          <div
            className="thumb-card"
            onClick={() => openModal('productDetail', {
              id: 'luna-table',
              name: 'Luna Table Lamp',
              price: 150000,
              img: 'img/Stand02.png',
              category: 'table',
              badge: 'Best 판매 1위'
            })}
          >
            <img src="img/Stand02.png" alt="Luna 원목 탁상" className="thumb-img" />
            <div className="thumb-info-row">
              <span className="thumb-label">Best 판매 1위</span>
              <button
                type="button"
                className="thumb-add-btn"
                onClick={(e) => handleAddToCart(e, 'Luna Table Lamp', 150000, 'img/Stand02.png')}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* 카드 2 */}
          <div
            className="thumb-card"
            onClick={() => openModal('productDetail', {
              id: 'aura-floor',
              name: '아우라 플로어 램프',
              price: 180000,
              img: 'img/img002.png',
              category: 'floor',
              badge: '조도 5단계 조절'
            })}
          >
            <img src="img/img002.png" alt="아우라 플로어 램프" className="thumb-img" />
            <div className="thumb-info-row">
              <span className="thumb-label">조도 5단계 조절</span>
              <button
                type="button"
                className="thumb-add-btn"
                onClick={(e) => handleAddToCart(e, '아우라 플로어 램프', 180000, 'img/img002.png')}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {/* 카드 3 */}
          <div
            className="thumb-card"
            onClick={() => openModal('productDetail', {
              id: 'ambient-strip',
              name: '엠비언트 스트립',
              price: 62000,
              img: 'img/Stand04.png',
              category: 'ambient',
              badge: 'Smart App 연동'
            })}
          >
            <img src="img/Stand04.png" alt="엠비언트 스트립" className="thumb-img" />
            <div className="thumb-info-row">
              <span className="thumb-label">Smart App 연동</span>
              <button
                type="button"
                className="thumb-add-btn"
                onClick={(e) => handleAddToCart(e, '엠비언트 스트립', 62000, 'img/Stand04.png')}
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
