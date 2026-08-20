import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductDetailModal: React.FC = () => {
  const { activeModal, selectedProduct, closeModal, openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColor, setSelectedColor] = useState(0);

  if (activeModal !== 'productDetail' || !selectedProduct) return null;

  const isLiked = isInWishlist(selectedProduct.id);

  const handleLikeClick = () => {
    if (!isLoggedIn) {
      showToast('⚠️ 로그인이 필요한 서비스입니다.');
      return;
    }
    const alreadyLiked = isInWishlist(selectedProduct.id);
    toggleWishlist(selectedProduct);
    if (alreadyLiked) {
      showToast(`💔 [${selectedProduct.name}]를 찜한 무드등에서 제외했습니다.`);
    } else {
      showToast(`❤️ [${selectedProduct.name}]를 찜한 무드등에 추가했습니다!`);
    }
  };


  const handleAddToCart = () => {
    if (!isLoggedIn) {
      showToast('⚠️ 로그인이 필요한 서비스입니다.');
      return;
    }
    addToCart(selectedProduct.name, selectedProduct.price, selectedProduct.img, selectedProduct.id);
    showToast(`🛒 [${selectedProduct.name}]가 장바구니에 담겼습니다!`);
    closeModal();
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      showToast('⚠️ 로그인이 필요한 서비스입니다.');
      return;
    }
    addToCart(selectedProduct.name, selectedProduct.price, selectedProduct.img, selectedProduct.id);
    closeModal();
    openModal('cart');
  };

  return (
    <div
      id="view-product-detail-modal"
      className="fixed-modal-wrapper active"
      style={{ zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* 딤드 백드롭 */}
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(18, 24, 38, 0.65)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      {/* 모달 카드 */}
      <div
        className="modal-card pd-modal-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          maxHeight: '92vh',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          overflowY: 'auto',
          padding: '0',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. 상단바 */}
        <header
          className="service-header"
          style={{
            borderRadius: '28px 28px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'var(--color-bg-card, #FFFFFF)',
            borderBottom: '1px solid var(--color-border, #E2E8F0)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            className="header-icon-btn back-btn"
            onClick={closeModal}
            title="닫기"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-bg-cream, #F8F6F0)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-text-main, #121826)' }}>
              chevron_left
            </span>
          </button>

          <div className="service-logo" style={{ textAlign: 'center', flex: 1 }}>
            <span className="service-logo-text" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main, #121826)' }}>
              {selectedProduct.name}
            </span>
          </div>

          <button
            type="button"
            className="header-icon-btn"
            onClick={handleLikeClick}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px' }}
            title="찜하기"
          >
            <span className="material-symbols-outlined" style={{ color: isLiked ? '#EF4444' : 'var(--color-text-main, #121826)', fontSize: '22px' }}>
              {isLiked ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        </header>

        {/* 2. 제품 대형 이미지 카드 */}
        <div className="pd-image-card pd-image-fullbleed" style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
          <img
            src={selectedProduct.img}
            alt={selectedProduct.name}
            id="pd-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* 매칭 뱃지 */}
          <span
            className="pd-match-badge"
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: 'linear-gradient(135deg, #FFAB40 0%, #FF9100 100%)',
              color: '#121826',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '5px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 4px 12px rgba(255, 145, 0, 0.4)',
            }}
          >
            <span className="material-symbols-outlined pd-sparkle-icon" style={{ fontSize: '14px' }}>
              auto_awesome
            </span>
            <span>{selectedProduct.badge || '98% 매칭'}</span>
          </span>
          {/* 페이지네이션 도트 */}
          <div className="pd-slider-dots" style={{ position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
            <span className="pd-dot active" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FFAB40' }}></span>
            <span className="pd-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></span>
            <span className="pd-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></span>
            <span className="pd-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.6)' }}></span>
          </div>
        </div>

        {/* 3. 스크롤 콘텐츠 영역 */}
        <div className="service-content pd-content" style={{ padding: '20px 20px 24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* 리뷰 별점 정보 */}
          <div className="pd-meta-row" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pd-stars" style={{ color: '#FFAB40', fontSize: '0.9rem' }}>⭐⭐⭐⭐⭐</span>
            <span className="pd-rating-text" style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-main, #121826)' }}>
              4.8 <span className="pd-review-count" style={{ color: 'var(--color-text-sub, #64748B)', fontWeight: 500 }}>(리뷰 245개)</span>
            </span>
          </div>

          <div>
            <h2 className="pd-product-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main, #121826)', marginBottom: '6px', letterSpacing: '-0.5px' }}>
              {selectedProduct.name}
            </h2>
            <p className="pd-product-desc" style={{ fontSize: '0.85rem', color: 'var(--color-text-sub, #64748B)', lineHeight: 1.55 }}>
              {selectedProduct.description || '부드럽고 따뜻한 빛을 선사하는 우아한 매트 피니시 펜던트 무드연출 조명입니다.'}
            </p>
          </div>

          <div className="pd-price-row">
            <span className="pd-price-val" style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--color-text-main, #121826)' }}>
              {selectedProduct.price.toLocaleString()}원
            </span>
          </div>

          {/* 4. 스펙 태그 그룹 */}
          <div className="pd-specs-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="pd-spec-tag" style={{ background: 'var(--color-bg-cream, #F8F6F0)', border: '1px solid var(--color-border, #E2E8F0)', color: 'var(--color-text-main, #121826)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#FFAB40' }}>thermostat</span>
              <span>2700K~6500K</span>
            </span>
            <span className="pd-spec-tag" style={{ background: 'var(--color-bg-cream, #F8F6F0)', border: '1px solid var(--color-border, #E2E8F0)', color: 'var(--color-text-main, #121826)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#FFAB40' }}>light_mode</span>
              <span>1200 Lux</span>
            </span>
            <span className="pd-spec-tag" style={{ background: 'var(--color-bg-cream, #F8F6F0)', border: '1px solid var(--color-border, #E2E8F0)', color: 'var(--color-text-main, #121826)', fontSize: '0.75rem', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#FFAB40' }}>smartphone</span>
              <span>스마트 App 연동</span>
            </span>
          </div>

          {/* 5. AI 큐레이터 인사이트 */}
          <div
            className="pd-insight-card"
            style={{
              backgroundColor: 'rgba(255, 171, 64, 0.08)',
              borderLeft: '4px solid #FFAB40',
              borderRadius: '0 16px 16px 0',
              padding: '14px 16px',
            }}
          >
            <div className="pd-insight-header" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <div
                className="pd-insight-bulb"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#FFF3E0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FF9100',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>lightbulb</span>
              </div>
              <span className="pd-insight-title" style={{ fontWeight: 800, color: '#E68A00', fontSize: '0.82rem' }}>
                AI 큐레이터 인사이트
              </span>
            </div>
            <p className="pd-insight-desc" style={{ fontSize: '0.82rem', color: 'var(--color-text-sub, #475569)', lineHeight: 1.5, fontWeight: 600 }}>
              이 조명은 구석의 그림자를 부드럽게 만들어주어 기존의 '미드나잇 네이비' 소파와 완벽하게 어울립니다.
            </p>
          </div>

          {/* 6. 색상 선택 */}
          <div className="pd-color-section">
            <h4 className="pd-section-title" style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-text-main, #121826)', marginBottom: '10px' }}>
              색상 선택
            </h4>
            <div className="pd-color-palette" style={{ display: 'flex', gap: '12px' }}>
              {['#E5C7B2', '#3E4C5E', '#1C1D1F'].map((color, idx) => (
                <span
                  key={idx}
                  className={`pd-color-circle ${selectedColor === idx ? 'active' : ''}`}
                  onClick={() => setSelectedColor(idx)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: selectedColor === idx ? '3px solid #FFAB40' : '2px solid var(--color-border, #E2E8F0)',
                    boxShadow: selectedColor === idx ? '0 0 10px rgba(255, 171, 64, 0.4)' : 'none',
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 7. 하단 고정 액션바 (2개 알약 버튼 구조) */}
        <div
          className="pd-footer-actions"
          style={{
            position: 'sticky',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'var(--color-bg-card, #FFFFFF)',
            borderTop: '1px solid var(--color-border, #E2E8F0)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxSizing: 'border-box',
            borderRadius: '0 0 28px 28px',
          }}
        >
          {/* 주황색 장바구니 텍스트 알약 버튼 */}
          <button
            type="button"
            className="pd-cart-btn"
            onClick={handleAddToCart}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '24px',
              backgroundColor: '#FFAB40',
              color: '#121826',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(255, 171, 64, 0.4)',
              transition: 'transform 0.2s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              shopping_bag
            </span>
            <span>장바구니</span>
          </button>

          {/* 검은색 바로 구매하기 알약 버튼 */}
          <button
            type="button"
            className="pd-buy-btn"
            onClick={handleBuyNow}
            style={{
              flex: 1,
              height: '48px',
              borderRadius: '24px',
              backgroundColor: '#121826',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(18, 24, 38, 0.25)',
              transition: 'transform 0.2s',
            }}
          >
            바로 구매하기
          </button>
        </div>
      </div>
    </div>
  );
};
