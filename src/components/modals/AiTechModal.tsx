import React from 'react';
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';

export const AiTechModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const navigate = useNavigate();

  if (activeModal !== 'aiTech') return null;

  return (
    <div id="ai-tech-modal" className="fixed-modal-wrapper active" style={{ zIndex: 99999 }}>
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="ai-tech-modal-card">
        <button type="button" className="modal-close-btn" onClick={closeModal} title="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="ai-tech-modal-header">
          <span className="ai-tech-modal-badge">✨ AMBIENT TECH</span>
          <h3 className="ai-tech-modal-title">ViewLight AI 공간 분석</h3>
          <p className="ai-tech-modal-sub">인공지능 비전 기술로 완성하는 최적의 라이팅 큐레이션</p>
        </div>

        <div className="ai-tech-step-list">
          <div className="ai-tech-step-item">
            <div className="step-num-badge">01</div>
            <div className="step-content">
              <h4>공간 구조 & 비전 3초 분석</h4>
              <p>방의 크기, 천장 높이, 가구 배치 및 벽면의 빛 반사율을 실시간 AI 컴퓨터 비전으로 정밀 파악합니다.</p>
            </div>
          </div>

          <div className="ai-tech-step-item">
            <div className="step-num-badge">02</div>
            <div className="step-content">
              <h4>맞춤형 앰비언트 무드 큐레이션</h4>
              <p>휴식, 수면, 집중, 독서 등 사용자의 라이프스타일에 맞춘 2,700K~6,500K 맞춤 조도를 자동 설계합니다.</p>
            </div>
          </div>

          <div className="ai-tech-step-item">
            <div className="step-num-badge">03</div>
            <div className="step-content">
              <h4>Before & After 시뮬레이션</h4>
              <p>조명 설치 전후의 드라마틱한 분위기 변화를 AR 및 3D 렌더링으로 미리 확인하고 선택할 수 있습니다.</p>
            </div>
          </div>
        </div>

        <div className="ai-tech-modal-actions">
          <button
            type="button"
            id="btn-tech-modal-bna"
            className="btn-tech-modal-bna"
            onClick={() => {
              closeModal();
              const el = document.querySelector('.section-bna');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="material-symbols-outlined">compare</span>
            <span>Before & After 바로가기 ➔</span>
          </button>
          <button
            type="button"
            id="btn-tech-modal-scan"
            className="btn-tech-modal-scan"
            onClick={() => {
              closeModal();
              openModal('scanGuide');
            }}
          >
            <span>3초 AI 분석 시작하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
