import React from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(18, 24, 38, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const DrawerCard = styled.div`
  width: 100%;
  max-width: 440px;
  height: 90vh;
  max-height: 720px;
  background: var(--color-bg-card, #F8F6F0);
  color: var(--color-text-main, #121826);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 28px;
  position: relative;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--color-border, #E2E8F0);
  overflow-y: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const CloseBtn = styled.button`
  font-size: 1.8rem;
  color: var(--color-text-main, #121826);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderLoginBtn = styled.button`
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-text-main, #121826);
  background: none;
  border: none;

  &:hover {
    color: var(--color-accent, #FFAB40);
  }
`;

const NavContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex: 1;
`;

const MainMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MenuItemMain = styled.button`
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--color-text-main, #121826);
  text-align: left;
  letter-spacing: -0.5px;
  transition: color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--color-accent, #FFAB40);
    transform: translateX(4px);
  }
`;

const SubMenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MenuItemSub = styled.button`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-sub, #64748B);
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-text-main, #121826);
  }
`;

const FooterSection = styled.div`
  border-top: 1px solid var(--color-border, #E2E8F0);
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AvatarImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
`;

const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text-main);
`;

const AuthBtn = styled.button<{ $isLogout?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.85rem;
  background: ${props => (props.$isLogout ? '#FEE2E2' : 'var(--color-accent, #FFAB40)')};
  color: ${props => (props.$isLogout ? '#EF4444' : '#121826')};
  border: 1px solid ${props => (props.$isLogout ? '#FCA5A5' : 'transparent')};
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    background: ${props => (props.$isLogout ? '#FCA5A5' : '#E69528')};
  }
`;

export const MenuDrawer: React.FC = () => {
  const { activeModal, openModal, closeModal } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();

  if (activeModal !== 'menu') return null;

  const handleNav = (action: () => void) => {
    closeModal();
    action();
  };

  return (
    <Overlay $isOpen={true} onClick={closeModal}>
      <DrawerCard onClick={e => e.stopPropagation()}>
        {/* 상단 닫기 버튼 */}
        <HeaderRow>
          <CloseBtn onClick={closeModal} title="닫기">
            <span className="material-symbols-outlined">close</span>
          </CloseBtn>
        </HeaderRow>

        {/* 내비게이션 메뉴 */}
        <NavContainer>
          <MainMenuList>
            <MenuItemMain
              onClick={() => handleNav(() => {
                openModal('aiTech');
              })}
            >
              AI 무드등 공간 분석
            </MenuItemMain>

            <MenuItemMain
              onClick={() => handleNav(() => {
                const el = document.querySelector('.section-categories');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              })}
            >
              무드등 둘러보기
            </MenuItemMain>

            <MenuItemMain onClick={() => handleNav(() => navigate('/commend'))}>
              Curation Report
            </MenuItemMain>

            <MenuItemMain onClick={() => handleNav(() => navigate('/splash'))}>
              Viewlight Story
            </MenuItemMain>
          </MainMenuList>

          <SubMenuList>
            <MenuItemSub onClick={() => handleNav(() => showToast('📌 ViewLight 공지사항: 2026 앰비언트 신제품 런칭 안내'))}>
              공지사항
            </MenuItemSub>
            <MenuItemSub onClick={() => handleNav(() => openModal('coupon'))}>
              이벤트
            </MenuItemSub>
            <MenuItemSub onClick={() => handleNav(() => showToast('📞 고객센터: 1588-0000 (평일 09:00~18:00)'))}>
              고객센터
            </MenuItemSub>
            <MenuItemSub onClick={() => handleNav(() => openModal('settings'))}>
              설정
            </MenuItemSub>
          </SubMenuList>
        </NavContainer>
      </DrawerCard>
    </Overlay>
  );
};
