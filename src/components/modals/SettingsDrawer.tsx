import React from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const Drawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: var(--color-bg-card);
  color: var(--color-text-main);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 { font-size: 1.2rem; font-weight: 800; }
`;

const Content = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-radius: 14px;
  background: var(--color-bg-cream);
  border: 1px solid var(--color-border);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span.label { font-size: 0.92rem; font-weight: 700; }
  span.sub { font-size: 0.8rem; color: var(--color-text-sub); }
`;

const Switch = styled.input`
  width: 44px;
  height: 24px;
  appearance: none;
  background: #CBD5E1;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  outline: none;
  transition: background 0.3s ease;

  &:checked {
    background: #FFAB40;
  }

  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    background: #FFFFFF;
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  &:checked::before {
    transform: translateX(20px);
  }
`;

export const SettingsDrawer: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { isDarkMode, toggleDarkMode, isCursorEnabled, toggleCursor } = useTheme();
  const { showToast } = useToast();

  const isOpen = activeModal === 'settings';

  const handleDarkToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleDarkMode();
    showToast(`[다크 모드] 설정이 ${e.target.checked ? 'ON(켜짐)' : 'OFF(꺼짐)'}으로 변경되었습니다.`);
  };

  const handleCursorToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    toggleCursor();
    showToast(`[커스텀 앰비언트 커서] 설정이 ${e.target.checked ? 'ON(켜짐)' : 'OFF(꺼짐)'}으로 변경되었습니다.`);
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={closeModal} />
      <Drawer $isOpen={isOpen}>
        <Header>
          <h3>⚙️ 환경 설정</h3>
          <button onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </Header>

        <Content>
          <SettingRow>
            <div>
              <span className="label">다크 앰비언트 모드</span>
              <span className="sub">눈이 편안한 프리미엄 다크 테마</span>
            </div>
            <Switch type="checkbox" checked={isDarkMode} onChange={handleDarkToggle} />
          </SettingRow>

          <SettingRow>
            <div>
              <span className="label">커스텀 앰비언트 커서</span>
              <span className="sub">빛나는 네온 앰비언트 마우스 포인터 효과</span>
            </div>
            <Switch type="checkbox" checked={isCursorEnabled} onChange={handleCursorToggle} />
          </SettingRow>

          <SettingRow>
            <div>
              <span className="label">주문 / 배송 알림</span>
              <span className="sub">실시간 배송 상태 알림 수신</span>
            </div>
            <Switch type="checkbox" defaultChecked onChange={e => showToast(`[배송 알림] ${e.target.checked ? 'ON' : 'OFF'}`)} />
          </SettingRow>
        </Content>
      </Drawer>
    </>
  );
};
