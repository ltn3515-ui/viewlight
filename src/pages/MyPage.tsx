import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openModal, unreadNotiCount } = useModal();
  const { showToast } = useToast();

  const [luminaOn, setLuminaOn] = useState(true);
  const [ecoPebbleOn, setEcoPebbleOn] = useState(false);

  const userName = user?.name || (user?.email ? user.email.split('@')[0] : '김뷰라이트');

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-mypage" className="mobile-view active">
          {/* Header */}
          <header className="service-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-bg-cream)' }}>
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <div className="service-logo" style={{ flex: 1, textAlign: 'center' }}>
              <span
                className="service-logo-text"
                onClick={() => navigate('/')}
                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
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
                  <span
                    className="noti-badge"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      background: '#EF4444',
                      color: '#FFF',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      borderRadius: '50%',
                      padding: '2px 5px',
                    }}
                  >
                    {unreadNotiCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          <div
            className="service-content mypage-content"
            style={{
              padding: '20px 20px 100px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            {/* 1. 유저 프로필 영역 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => openModal('editProfile')}
                title="프로필 수정하기"
              >
                <img
                  src="img/Stand01.jpg"
                  alt="User Avatar"
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-border)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    display: 'block',
                  }}
                />
                {/* 프로필 수정 연필아이콘 뱃지 */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0px',
                    right: '0px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#FFAB40',
                    color: '#121826',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #FFFFFF',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', fontWeight: 800 }}>
                    edit
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                    {userName}
                  </h3>
                  <button
                    type="button"
                    onClick={() => openModal('editProfile')}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-sub)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px',
                    }}
                    title="닉네임 수정"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                  </button>
                </div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#FFF3E0',
                    color: '#E68A00',
                    border: '1px solid #FFE0B2',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    width: 'fit-content',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>
                    stars
                  </span>
                  <span>PREMIUM MEMBER</span>
                </span>
              </div>
            </div>

            {/* 2. My Ambient Profile 영역 */}
            <div>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', fontWeight: 600, margin: '0 0 10px 0' }}>
                My Ambient Profile
              </h4>
              <div
                style={{
                  background: 'linear-gradient(135deg, #FFF9F0 0%, #FFF3E0 100%)',
                  borderRadius: '20px',
                  padding: '20px',
                  border: '1px solid #FFE0B2',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#E68A00', letterSpacing: '0.5px' }}>
                  LATEST ANALYSIS
                </span>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                  내 방 책상 - 우드&크림
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)', lineHeight: 1.5, margin: 0, wordBreak: 'keep-all' }}>
                  따뜻하고 은은한 조명은 나무의 자연스러운 질감을 돋보이게 하고 집중력을 높이는 데 도움이 됩니다.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/commend')}
                  style={{
                    alignSelf: 'flex-start',
                    marginTop: '6px',
                    height: '38px',
                    padding: '0 18px',
                    borderRadius: '19px',
                    background: '#121826',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>View Report ➔</span>
                </button>
              </div>
            </div>

            {/* 3. Smart Control 영역 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 10px 0' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-text-sub)' }}>
                  tune
                </span>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', fontWeight: 600, margin: 0 }}>
                  Smart Control
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 스마트 컨트롤 1 (ON) */}
                <div
                  style={{
                    background: 'var(--color-bg-card, #FFFFFF)',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    padding: '18px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#FFF3E0',
                        color: '#FF9100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        table_lamp
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setLuminaOn(!luminaOn);
                        showToast(`루미나 플로어 아크 조명이 ${!luminaOn ? 'ON' : 'OFF'} 처리되었습니다.`);
                      }}
                      style={{
                        background: luminaOn ? '#FFAB40' : '#E2E8F0',
                        color: luminaOn ? '#121826' : '#64748B',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {luminaOn ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--color-text-main)' }}>
                      루미나 플로어 아크
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0 }}>
                      Living Room • 3000K Warm White
                    </p>
                  </div>

                  {/* 슬라이더 트랙 */}
                  <div style={{ width: '100%', height: '8px', background: '#F0EDE6', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: luminaOn ? '70%' : '0%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #FFAB40 0%, #FF9100 100%)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                {/* 스마트 컨트롤 2 (OFF) */}
                <div
                  style={{
                    background: 'var(--color-bg-card, #FFFFFF)',
                    borderRadius: '20px',
                    border: '1px solid var(--color-border)',
                    padding: '18px',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    opacity: ecoPebbleOn ? 1 : 0.75,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#F1F5F9',
                        color: '#94A3B8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        lightbulb
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setEcoPebbleOn(!ecoPebbleOn);
                        showToast(`에코 페블 라이트 조명이 ${!ecoPebbleOn ? 'ON' : 'OFF'} 처리되었습니다.`);
                      }}
                      style={{
                        background: ecoPebbleOn ? '#FFAB40' : '#E2E8F0',
                        color: ecoPebbleOn ? '#121826' : '#64748B',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        fontSize: '0.72rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                      }}
                    >
                      {ecoPebbleOn ? 'ON' : 'OFF'}
                    </button>
                  </div>

                  <div>
                    <h5 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--color-text-main)' }}>
                      에코 페블 라이트
                    </h5>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0 }}>
                      Bedroom • Offline
                    </p>
                  </div>

                  {/* 슬라이더 트랙 */}
                  <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: ecoPebbleOn ? '50%' : '0%',
                        height: '100%',
                        background: '#FFAB40',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 메뉴 링크 목록 카드 */}
            <div
              style={{
                background: 'var(--color-bg-card, #FFFFFF)',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {[
                {
                  icon: 'receipt_long',
                  label: '주문 내역 (Order History)',
                  onClick: () => openModal('orderHistory'),
                },
                {
                  icon: 'rate_review',
                  label: '내 리뷰 (My Reviews)',
                  onClick: () => showToast('💬 작성 가능한 리뷰가 1건 있습니다.'),
                },
                {
                  icon: 'local_shipping',
                  label: '배송지 관리 (Shipping Management)',
                  onClick: () => showToast('🚚 기본 배송지: 서울특별시 강남구 테헤란로 123'),
                },
                {
                  icon: 'support_agent',
                  label: '고객센터 (Customer Center)',
                  onClick: () => showToast('📞 고객센터 1588-0000 (평일 09:00~18:00)'),
                },
                {
                  icon: 'settings',
                  label: '설정 (Settings)',
                  onClick: () => openModal('settings'),
                },
              ].map((item, idx, arr) => (
                <div
                  key={idx}
                  onClick={item.onClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-text-main)' }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-text-sub)' }}>
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          </div>
          <BottomNav />
        </div>
      </main>
    </div>
  );
};
