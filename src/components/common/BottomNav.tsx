import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openModal } = useModal();
  const { totalCount } = useCart();

  return (
    <nav className="mobile-bottom-tabbar">
      <button
        type="button"
        className={`tab-item ${location.pathname === '/' ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <span className="material-symbols-outlined">home</span>
        <span className="tab-label">홈</span>
      </button>

      <button
        type="button"
        className="tab-item"
        onClick={() => openModal('search')}
      >
        <span className="material-symbols-outlined">search</span>
        <span className="tab-label">검색</span>
      </button>

      <button
        type="button"
        className={`tab-item ${location.pathname === '/commend' ? 'active' : ''}`}
        onClick={() => navigate('/commend')}
      >
        <span className="material-symbols-outlined">auto_awesome</span>
        <span className="tab-label">AI 큐레이션</span>
      </button>

      <button
        type="button"
        className="tab-item"
        onClick={() => openModal('cart')}
      >
        <span className="tab-icon-wrap" style={{ position: 'relative' }}>
          <span className="material-symbols-outlined">shopping_bag</span>
          {totalCount > 0 && (
            <span
              className="cart-badge"
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-6px',
                background: '#EF4444',
                color: '#FFF',
                fontSize: '0.65rem',
                fontWeight: 800,
                borderRadius: '50%',
                padding: '2px 5px',
                display: 'inline-block'
              }}
            >
              {totalCount}
            </span>
          )}
        </span>
        <span className="tab-label">장바구니</span>
      </button>

      <button
        type="button"
        className={`tab-item ${location.pathname === '/mypage' ? 'active' : ''}`}
        onClick={() => navigate('/mypage')}
      >
        <span className="material-symbols-outlined">person</span>
        <span className="tab-label">마이페이지</span>
      </button>
    </nav>
  );
};
