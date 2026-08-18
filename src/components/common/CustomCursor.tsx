import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const CursorDot = styled.div<{ $visible: boolean }>`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #FFAB40;
  box-shadow: 0 0 8px 3px rgba(255, 171, 64, 0.7), 0 0 20px 6px rgba(255, 171, 64, 0.3);
  z-index: 999999;
  transform: translate(-50%, -50%);
  display: ${props => (props.$visible ? 'block' : 'none')};
`;

const CursorGlow = styled.div<{ $visible: boolean }>`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 171, 64, 0.55);
  background: radial-gradient(circle, rgba(255, 171, 64, 0.06) 0%, transparent 70%);
  z-index: 999998;
  transform: translate(-50%, -50%);
  display: ${props => (props.$visible ? 'block' : 'none')};
  transition: width 0.3s ease, height 0.3s ease, border-color 0.25s ease;
`;

export const CustomCursor: React.FC = () => {
  const { isCursorEnabled } = useTheme();
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isCursorEnabled) return null;

  return (
    <>
      <CursorDot $visible={true} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
      <CursorGlow $visible={true} style={{ left: `${position.x}px`, top: `${position.y}px` }} />
    </>
  );
};
