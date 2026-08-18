import React from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: #181C26;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 { font-size: 1.1rem; font-weight: 800; }
  button { color: #94A3B8; font-size: 0.8rem; text-decoration: underline; }
`;

const NotiList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NotiItem = styled.div`
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  h4 { font-size: 0.9rem; color: #FFAB40; margin-bottom: 4px; }
  p { font-size: 0.82rem; color: #94A3B8; }
`;

export const NotificationModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();

  if (activeModal !== 'notification') return null;

  return (
    <Overlay $isOpen={true} onClick={closeModal}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <HeaderRow>
          <h3>🔔 알림 센터</h3>
          <button onClick={() => showToast('모든 실시간 알림을 읽음 처리했습니다.')}>전체 읽음</button>
        </HeaderRow>

        <NotiList>
          <NotiItem>
            <h4>✨ 15% 세트 할인 쿠폰 도착!</h4>
            <p>신규 가입 고객님을 위한 3종 쿠폰팩이 다운로드 가능합니다.</p>
          </NotiItem>
          <NotiItem>
            <h4>🚚 [Luna Table Lamp] 배송 안내</h4>
            <p>고객님의 주문이 강남HUB에서 출발하였습니다.</p>
          </NotiItem>
        </NotiList>
      </ModalCard>
    </Overlay>
  );
};
