import React from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { openModal, unreadNotiCount } = useModal();
  const { isLoggedIn, logout } = useAuth();
  const { showToast } = useToast();

  return (
    <header className="service-header">
      <button
        type="button"
        id="btn-hamburger"
        className="header-icon-btn"
        onClick={() => openModal('menu')}
        title="전체 메뉴"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      <div className="service-logo">
        <Link to="/" className="service-logo-text" style={{ textDecoration: 'none', color: 'inherit' }}>
          ViewLight
        </Link>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => openModal('search')}
          title="검색"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
        <button
          type="button"
          className="header-icon-btn"
          onClick={() => openModal('notification')}
          title="알림"
          style={{ position: 'relative' }}
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadNotiCount > 0 && (
            <span className="noti-badge" style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#EF4444',
              color: '#FFF',
              fontSize: '0.65rem',
              fontWeight: 800,
              borderRadius: '50%',
              padding: '2px 5px'
            }}>{unreadNotiCount}</span>
          )}
        </button>

        {/* 로그인 / 로그아웃 버튼 배치 */}
        {!isLoggedIn ? (
          <button
            type="button"
            className="btn-header-auth"
            onClick={() => openModal('login')}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: 'var(--color-accent, #FFAB40)',
              color: '#121826',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '4px',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease'
            }}
          >
            로그인
          </button>
        ) : (
          <button
            type="button"
            className="btn-header-auth"
            onClick={() => {
              logout();
              showToast('로그아웃 되었습니다.');
            }}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: '#FEE2E2',
              color: '#EF4444',
              border: '1px solid #FCA5A5',
              cursor: 'pointer',
              marginLeft: '4px',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease'
            }}
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  );
};
