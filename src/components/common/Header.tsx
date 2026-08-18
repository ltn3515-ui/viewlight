import React from 'react';
import { useModal } from '../../context/ModalContext';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  const { openModal, unreadNotiCount } = useModal();

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

      <div className="header-actions">
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
      </div>
    </header>
  );
};
