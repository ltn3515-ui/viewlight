import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

const MENU_ITEMS = [
  { icon: 'receipt_long', label: '주문 내역 (Order History)', action: 'orderHistory' as const },
  { icon: 'rate_review', label: '내 리뷰 (My Reviews)', action: 'myReviews' as const },
  { icon: 'local_shipping', label: '배송지 관리 (Shipping Management)', action: 'shipping' as const },
  { icon: 'support_agent', label: '고객센터 (Customer Center)', action: 'customerCenter' as const },
  { icon: 'settings', label: '설정 (Settings)', action: 'settings' as const },
];

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal, unreadNotiCount } = useModal();
  const { showToast } = useToast();

  const [luminaOn, setLuminaOn] = useState(true);
  const [luminaBrightness] = useState(60);
  const [ecoPebbleOn, setEcoPebbleOn] = useState(false);

  const userName = user?.name || (user?.email ? user.email.split('@')[0] : '김뷰라이트');

  const handleMenuClick = (action: (typeof MENU_ITEMS)[number]['action']) => {
    switch (action) {
      case 'orderHistory':
        openModal('orderHistory');
        break;
      case 'myReviews':
        openModal('myReviews');
        break;
      case 'shipping':
        showToast('🚚 기본 배송지: 서울특별시 강남구 테헤란로 123');
        break;
      case 'customerCenter':
        showToast('📞 고객센터 1588-0000 (평일 09:00~18:00)');
        break;
      case 'settings':
        openModal('settings');
        break;
    }
  };

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-mypage" className="mobile-view active">
          <header className="service-header">
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="service-logo">
              <span
                className="service-logo-text"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer' }}
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
                {unreadNotiCount > 0 && (
                  <span className="header-noti-badge">{unreadNotiCount}</span>
                )}
              </button>
            </div>
          </header>

          <div className="service-content mypage-content">
            {/* 프로필 */}
            <div className="mypage-profile-row">
              <button
                type="button"
                className="mypage-avatar-btn"
                onClick={() => openModal('editProfile')}
                title="프로필 수정하기"
              >
                <img src="img/Stand01.jpg" alt="User Avatar" className="mypage-avatar-img" />
              </button>
              <div className="profile-user-info">
                <h3 className="profile-username">{userName}</h3>
                <span className="profile-member-badge">
                  <span className="material-symbols-outlined">star</span>
                  PREMIUM MEMBER
                </span>
              </div>
            </div>

            {/* My Ambient Profile */}
            <div className="mypage-section-card">
              <h4 className="mypage-section-title">My Ambient Profile</h4>
              <div className="ambient-profile-banner">
                <div className="banner-badge">LATEST ANALYSIS</div>
                <h5 className="banner-headline">내 방 책상 - 우드&크림</h5>
                <p className="banner-description">
                  따뜻하고 은은한 조명은 나무의 자연스러운 질감을 돋보이게 하고 집중력을 높이는 데 도움이 됩니다.
                </p>
                <button
                  type="button"
                  className="btn-view-report"
                  onClick={() => navigate('/commend')}
                >
                  View Report →
                </button>
              </div>
            </div>

            {/* Smart Control */}
            <div className="mypage-section-card">
              <div className="mypage-section-title-row">
                <span className="material-symbols-outlined mypage-section-icon">tune</span>
                <h4 className="mypage-section-title">Smart Control</h4>
              </div>

              <div className="mypage-smart-devices">
                {/* 루미나 플로어 아크 */}
                <div className={`mypage-device-card ${luminaOn ? 'is-on' : 'is-off'}`}>
                  <div className="mypage-device-top">
                    <div className="mypage-device-icon">
                      <span className="material-symbols-outlined">table_lamp</span>
                    </div>
                    <button
                      type="button"
                      className={`mypage-device-toggle ${luminaOn ? 'on' : 'off'}`}
                      onClick={() => {
                        setLuminaOn(!luminaOn);
                        showToast(`루미나 플로어 아크 조명이 ${!luminaOn ? 'ON' : 'OFF'} 처리되었습니다.`);
                      }}
                    >
                      {luminaOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <h5 className="mypage-device-name">루미나 플로어 아크</h5>
                  <p className="mypage-device-meta">Living Room • 3000K Warm White</p>
                  <div className="mypage-device-slider">
                    <div
                      className="mypage-device-slider-fill"
                      style={{ width: luminaOn ? `${luminaBrightness}%` : '0%' }}
                    />
                  </div>
                </div>

                {/* 에코 페블 라이트 */}
                <div className={`mypage-device-card is-off ${!ecoPebbleOn ? 'offline' : ''}`}>
                  <div className="mypage-device-top">
                    <div className="mypage-device-icon">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <button
                      type="button"
                      className={`mypage-device-toggle ${ecoPebbleOn ? 'on' : 'off'}`}
                      onClick={() => {
                        setEcoPebbleOn(!ecoPebbleOn);
                        showToast(`에코 페블 라이트 조명이 ${!ecoPebbleOn ? 'ON' : 'OFF'} 처리되었습니다.`);
                      }}
                    >
                      {ecoPebbleOn ? 'ON' : 'OFF'}
                    </button>
                  </div>
                  <h5 className="mypage-device-name">에코 페블 라이트</h5>
                  <p className="mypage-device-meta">Bedroom • Offline</p>
                  <div className="mypage-device-slider">
                    <div
                      className="mypage-device-slider-fill"
                      style={{ width: ecoPebbleOn ? '50%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 메뉴 목록 */}
            <div className="mypage-menu-list">
              {MENU_ITEMS.map((item, idx) => (
                <button
                  key={item.action}
                  type="button"
                  className={`menu-list-row ${idx === MENU_ITEMS.length - 1 ? 'menu-list-row--last' : ''}`}
                  onClick={() => handleMenuClick(item.action)}
                >
                  <div className="menu-list-inner">
                    <span className="material-symbols-outlined menu-list-icon">{item.icon}</span>
                    <span className="menu-list-label">{item.label}</span>
                  </div>
                  <span className="material-symbols-outlined menu-list-arrow">chevron_right</span>
                </button>
              ))}
            </div>
          </div>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
