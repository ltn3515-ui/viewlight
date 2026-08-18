import React, { useState } from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: linear-gradient(145deg, #181C26 0%, #0F172A 100%);
  color: #FFFFFF;
  border-radius: 24px;
  padding: 32px 24px;
  border: 1px solid rgba(255, 171, 64, 0.3);
  text-align: center;
  position: relative;
`;

const Title = styled.h3`
  font-size: 1.4rem;
  font-weight: 900;
  color: #FFAB40;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.88rem;
  color: #94A3B8;
  margin-bottom: 24px;
`;

const CouponBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 171, 64, 0.5);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;

  h4 { font-size: 1.5rem; font-weight: 900; color: #FFFFFF; }
  p { font-size: 0.82rem; color: #94A3B8; margin-top: 4px; }
`;

const ClaimBtn = styled.button<{ $claimed: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  background: ${props => (props.$claimed ? 'linear-gradient(135deg, #2EC4B6 0%, #10B981 100%)' : 'linear-gradient(135deg, #FFAB40 0%, #FF9800 100%)')};
  color: ${props => (props.$claimed ? '#FFFFFF' : '#121826')};
  font-weight: 800;
  font-size: 1rem;
  transition: all 0.3s ease;
`;

export const CouponModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();
  const [claimed, setClaimed] = useState(false);

  if (activeModal !== 'coupon') return null;

  const handleClaim = () => {
    setClaimed(true);
    showToast('✨ 15% 세트 할인 쿠폰팩 3종이 정상 발급되었습니다!');
  };

  return (
    <Overlay $isOpen={true} onClick={closeModal}>
      <ModalCard onClick={e => e.stopPropagation()}>
        <Title>✨ 첫 방문 15% 쿠폰팩</Title>
        <Subtitle>ViewLight 신규 회원을 위한 특별한 앰비언트 세트 할인</Subtitle>

        <CouponBox>
          <h4>15% OFF</h4>
          <p>전 품목 3개 이상 세트 구매 시 즉시 할인</p>
        </CouponBox>

        <ClaimBtn $claimed={claimed} onClick={handleClaim}>
          {claimed ? '✓ 쿠폰팩 발급 완료' : '✨ 15% 쿠폰팩 다운로드'}
        </ClaimBtn>
      </ModalCard>
    </Overlay>
  );
};
