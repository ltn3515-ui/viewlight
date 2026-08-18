import React from 'react';
import { useModal } from '../../context/ModalContext';

export const AiScanSection: React.FC = () => {
  const { openModal } = useModal();

  return (
    <section id="ai-scan-section" className="section-dark-tech">
      <div className="dark-tech-card">
        <h3 className="dark-tech-title">
          공간을 위한 <span className="text-primary">앰비언트 테크</span>
        </h3>
        <p className="dark-tech-desc">
          뷰라이트는 단순한 무드등을 넘어 인공지능을 통해 당신의 공간에 완벽한 무드를 큐레이션합니다.
        </p>
        <button
          type="button"
          className="dark-tech-btn"
          onClick={() => openModal('aiTech')}
        >
          AI 공간 분석 설명 알아보기 ➔
        </button>
      </div>
    </section>
  );
};
