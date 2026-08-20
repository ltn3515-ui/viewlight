import React from 'react';
import { useModal } from '../../context/ModalContext';
import { useWishlist } from '../../context/WishlistContext';

export const WishlistModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const { wishlistItems, toggleWishlist } = useWishlist();

  if (activeModal !== 'wishlist') return null;

  const handleProductClick = (product: any) => {
    openModal('productDetail', product);
  };

  return (
    <div
      id="wishlist-modal"
      className="fixed-modal-wrapper active"
      style={{
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(18, 24, 38, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <div
        className="modal-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--color-bg-main, #FAF9F6)',
            border: '1px solid var(--color-border, #E2E8F0)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-text-main)' }}>
            close
          </span>
        </button>

        {/* Modal Title */}
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: 900,
            textAlign: 'center',
            marginBottom: '20px',
            color: 'var(--color-text-main, #121826)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#EF4444' }}>favorite</span>
          찜한 무드등
        </h3>

        {/* Wishlist Items List */}
        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '4px',
          }}
        >
          {wishlistItems.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 10px',
                color: 'var(--color-text-sub, #64748B)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '48px', color: '#CBD5E1', marginBottom: '12px', display: 'block' }}
              >
                heart_broken
              </span>
              찜한 상품이 없습니다.<br />
              마음에 드는 무드등을 찜해보세요!
            </div>
          ) : (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border, #E2E8F0)',
                  backgroundColor: '#FAF9F6',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-accent, #FFAB40)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border, #E2E8F0)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <img
                  src={product.img}
                  alt={product.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1px solid var(--color-border, #E2E8F0)',
                    backgroundColor: '#FFFFFF',
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      margin: '0 0 4px 0',
                      color: 'var(--color-text-main, #121826)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </h4>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--color-accent, #FFAB40)',
                    }}
                  >
                    {product.price.toLocaleString()}원
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                  }}
                  title="찜 해제"
                >
                  <span className="material-symbols-outlined" style={{ color: '#EF4444', fontSize: '20px' }}>
                    favorite
                  </span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
