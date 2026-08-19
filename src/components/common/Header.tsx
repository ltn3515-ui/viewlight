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
    <header className="service-header" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button
        type="button"
        id="btn-hamburger"
        className="header-icon-btn"
        onClick={() => openModal('menu')}
        title="전체 메뉴"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: 'var(--color-text-main, #121826)' }}>menu</span>
      </button>

      <div className="service-logo">
        <Link to="/" className="service-logo-text" style={{ textDecoration: 'none', color: 'inherit', fontSize: '1.4rem', fontWeight: 800 }}>
          ViewLight
        </Link>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              border: '2px solid #FFF', // 흰색 아웃라인 추가하여 시인성 극대화
              boxSizing: 'border-box'
            }}>{unreadNotiCount}</span>
          )}
        </button>

        {/* 로그인 버튼 배치 (로그인 완료 시에는 로그아웃 버튼 숨김) */}
        {!isLoggedIn && (
          <button
            type="button"
            className="btn-header-auth"
            onClick={() => openModal('login')}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              background: 'var(--color-accent, #FFAB40)',
              color: '#121826',
              border: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(255, 171, 64, 0.2)'
            }}
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};
