import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const stroke = keyframes`
  100% { stroke-dashoffset: 0; }
`;

const scale = keyframes`
  0%, 100% { transform: none; }
  50% { transform: scale3d(1.1, 1.1, 1); }
`;

const fill = keyframes`
  100% { box-shadow: inset 0px 0px 0px 40px #10B981; }
`;

const SuccessContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: var(--color-bg-cream);
  color: var(--color-text-main);
`;

const GlassCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 28px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: ${scaleUp} 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const Checkmark = styled.svg`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #ffffff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #10B981;
  animation: ${fill} .4s ease-in-out .4s forwards, ${scale} .3s ease-in-out .9s both;
  
  .checkmark__circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #10B981;
    fill: none;
    animation: ${stroke} 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }
  
  .checkmark__check {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: ${stroke} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, var(--color-text-main) 0%, var(--color-text-sub) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: var(--color-text-sub);
  margin-bottom: 32px;
  line-height: 1.5;
`;

const DetailsTable = styled.div`
  background: rgba(100, 116, 139, 0.04);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  
  span:first-child {
    color: var(--color-text-sub);
    font-weight: 500;
  }
  
  span:last-child {
    color: var(--color-text-main);
    font-weight: 700;
    word-break: break-all;
    text-align: right;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-border);
  margin: 4px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 26px;
  background: linear-gradient(135deg, #FFAB40 0%, #FF9100 100%);
  color: #121826;
  font-size: 1rem;
  font-weight: 800;
  box-shadow: 0 6px 20px rgba(255, 145, 0, 0.35);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 145, 0, 0.45);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SecondaryButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 26px;
  background: transparent;
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(100, 116, 139, 0.05);
  }
`;

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const paymentKey = searchParams.get('paymentKey') || '';
  const orderId = searchParams.get('orderId') || '';
  const amount = searchParams.get('amount') || '0';

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();
  }, [clearCart]);

  const formattedAmount = parseInt(amount, 10).toLocaleString();

  return (
    <SuccessContainer>
      <GlassCard>
        <IconWrapper>
          <Checkmark xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </Checkmark>
        </IconWrapper>

        <Title>결제 완료</Title>
        <Subtitle>
          주문이 성공적으로 접수되었습니다.<br />
          조명과 함께 최적의 AI 스페이스 가이드가 배송됩니다.
        </Subtitle>

        <DetailsTable>
          <DetailRow>
            <span>주문 번호</span>
            <span>{orderId}</span>
          </DetailRow>
          <DetailRow>
            <span>결제 금액</span>
            <span style={{ color: '#FFAB40', fontSize: '1.05rem', fontWeight: 800 }}>{formattedAmount}원</span>
          </DetailRow>
          <Divider />
          <DetailRow>
            <span>거래 키</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--color-text-sub)' }}>{paymentKey}</span>
          </DetailRow>
        </DetailsTable>

        <ButtonGroup>
          <PrimaryButton onClick={() => navigate('/')}>
            홈으로 가기
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/mypage')}>
            주문 내역 확인
          </SecondaryButton>
        </ButtonGroup>
      </GlassCard>
    </SuccessContainer>
  );
};
