import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { useToast } from '../context/ToastContext';

// Styled Components for Premium Aesthetics
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 24px;
  gap: 32px;
  background: var(--color-bg-main, #FAF9F6);
  min-height: calc(100vh - 140px);
`;

const BrandSection = styled.div`
  text-align: center;
  margin-top: 16px;
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--color-text-main, #121826);
  letter-spacing: -1px;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #121826 0%, #4A5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubText = styled.p`
  font-size: 1rem;
  color: var(--color-text-sub, #64748B);
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: -0.2px;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 380px;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  border: 1px solid var(--color-border, #E2E8F0);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
`;

const UserAvatar = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-accent, #FFAB40);
`;

const UserTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UserDisplayName = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-main, #121826);
`;

const UserEmail = styled.span`
  font-size: 0.8rem;
  color: var(--color-text-sub, #64748B);
`;

const ActionButton = styled.button<{ $isLogout?: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: ${props => props.$isLogout ? '#FEE2E2' : 'var(--color-accent, #FFAB40)'};
  color: ${props => props.$isLogout ? '#EF4444' : '#121826'};
  border: ${props => props.$isLogout ? '1px solid #FCA5A5' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.$isLogout ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 171, 64, 0.2)'};
  }
`;

const MenuWrapper = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  background: #FFFFFF;
  border-radius: 16px;
  border: 1px solid var(--color-border, #E2E8F0);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-accent, #FFAB40);
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
`;

const MenuLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const MenuIcon = styled.span`
  font-size: 1.3rem;
  color: var(--color-accent, #FFAB40);
`;

const MenuLabel = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main, #121826);
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
  color: var(--color-text-sub, #64748B);
`;

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { openModal, unreadNotiCount } = useModal();
  const { showToast } = useToast();

  const handleMenuClick = (menu: string) => {
    switch (menu) {
      case 'like':
        showToast('❤️ 아직 찜한 상품이 없습니다. 마음에 드는 조명을 찾아보세요!');
        break;
      case 'analysis':
        navigate('/commend');
        break;
      case 'cart':
        openModal('cart');
        break;
      case 'order':
        openModal('orderHistory');
        break;
    }
  };

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-mypage" className="mobile-view active">
          {/* 헤더 영역 */}
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

          {/* 메인 스크롤 가능한 본문 영역 */}
          <div className="service-content" style={{ overflowY: 'auto', paddingBottom: '80px' }}>
            <Container>
              {/* 타이틀 및 카피 라이트 */}
              <BrandSection>
                <LogoText>ViewLight</LogoText>
                <SubText>
                  나만의 공간을 더<br />
                  스마트하게 관리하세요
                </SubText>
              </BrandSection>

              {/* 로그인 카드 영역 */}
              <AuthCard>
                {isLoggedIn && user ? (
                  <>
                    <UserInfoWrapper>
                      <UserAvatar
                        src={user.photoURL || 'img/Stand01.jpg'}
                        alt="User Profile"
                      />
                      <UserTextInfo>
                        <UserDisplayName>{user.name || '김뷰라이트'}</UserDisplayName>
                        <UserEmail>{user.email}</UserEmail>
                      </UserTextInfo>
                    </UserInfoWrapper>
                    <ActionButton
                      $isLogout={true}
                      onClick={() => {
                        logout();
                        showToast('로그아웃 되었습니다.');
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>logout</span>
                      로그아웃
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <SubText style={{ fontSize: '0.85rem', textAlign: 'center', margin: '0 8px 8px 8px' }}>
                      로그인하시면 나만의 조명 큐레이션 결과와 스마트 제어 기능을 이용하실 수 있습니다.
                    </SubText>
                    <ActionButton onClick={() => openModal('login')}>
                      <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>login</span>
                      로그인 / 회원가입
                    </ActionButton>
                  </>
                )}
              </AuthCard>

              {/* 4대 주요 메뉴 목록 */}
              <MenuWrapper>
                <MenuItem onClick={() => handleMenuClick('like')}>
                  <MenuLeft>
                    <MenuIcon className="material-symbols-outlined">favorite</MenuIcon>
                    <MenuLabel>찜한 무드등</MenuLabel>
                  </MenuLeft>
                  <ArrowIcon className="material-symbols-outlined">chevron_right</ArrowIcon>
                </MenuItem>

                <MenuItem onClick={() => handleMenuClick('analysis')}>
                  <MenuLeft>
                    <MenuIcon className="material-symbols-outlined">auto_awesome</MenuIcon>
                    <MenuLabel>AI 분석 기록</MenuLabel>
                  </MenuLeft>
                  <ArrowIcon className="material-symbols-outlined">chevron_right</ArrowIcon>
                </MenuItem>

                <MenuItem onClick={() => handleMenuClick('cart')}>
                  <MenuLeft>
                    <MenuIcon className="material-symbols-outlined">shopping_bag</MenuIcon>
                    <MenuLabel>장바구니</MenuLabel>
                  </MenuLeft>
                  <ArrowIcon className="material-symbols-outlined">chevron_right</ArrowIcon>
                </MenuItem>

                <MenuItem onClick={() => handleMenuClick('order')}>
                  <MenuLeft>
                    <MenuIcon className="material-symbols-outlined">receipt_long</MenuIcon>
                    <MenuLabel>주문 내역</MenuLabel>
                  </MenuLeft>
                  <ArrowIcon className="material-symbols-outlined">chevron_right</ArrowIcon>
                </MenuItem>
              </MenuWrapper>
            </Container>
          </div>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
