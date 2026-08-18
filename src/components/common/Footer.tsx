import React from 'react';
import { useModal } from '../../context/ModalContext';

export const Footer: React.FC = () => {
  const { openModal } = useModal();

  return (
    <footer className="brand-story-footer" style={{ padding: '32px 20px', background: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', marginTop: '40px' }}>
      <div className="footer-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: 'var(--color-text-main)' }}>ViewLight</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.6, marginBottom: '20px' }}>
          당신의 공간을 완성하는 큐레이션 앰비언트 테크.<br />
          AI 비전이 방을 분석하여 최적의 무드와 분위기를 추천해드립니다.
        </p>

        <div className="footer-links" style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', marginBottom: '20px' }}>
          <button type="button" onClick={() => openModal('settings')} style={{ border: 'none', background: 'none', color: 'var(--color-text-sub)', cursor: 'pointer' }}>설정</button>
          <button type="button" onClick={() => openModal('coupon')} style={{ border: 'none', background: 'none', color: 'var(--color-text-sub)', cursor: 'pointer' }}>15% 쿠폰팩</button>
          <button type="button" onClick={() => openModal('aiTech')} style={{ border: 'none', background: 'none', color: 'var(--color-text-sub)', cursor: 'pointer' }}>AI 비전 설명</button>
        </div>

        <div className="copyright" style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          © 2026 ViewLight Inc. All rights reserved.<br />
          서울특별시 강남구 테헤란로 123 ViewLight 타워 8층 | 고객센터 1588-0000
        </div>
      </div>
    </footer>
  );
};
