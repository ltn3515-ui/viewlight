import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.04); }
`;

const SplashContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #0F172A;
  color: #FFFFFF;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 900;
  color: #FFAB40;
  letter-spacing: -1px;
  margin-bottom: 12px;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Subtitle = styled.div`
  font-size: 1rem;
  color: #94A3B8;
`;

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <SplashContainer>
      <Logo>ViewLight</Logo>
      <Subtitle>당신만을 위한 큐레이션 앰비언트 테크</Subtitle>
    </SplashContainer>
  );
};
