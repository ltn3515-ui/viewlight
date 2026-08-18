import React from 'react';
import { useModal } from '../../context/ModalContext';

export const ScanGuideModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();

  if (activeModal !== 'scanGuide') return null;

  const handleStartScan = () => {
    closeModal();
    openModal('cameraScan');
  };

  return (
    <div id="scan-guide-modal" className="fixed-modal-wrapper active" style={{ zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-backdrop" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(18, 24, 38, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1 }} />
      <div
        className="modal-card guide-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-cream, #F8F6F0)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
        </button>

        <div className="guide-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 className="guide-title" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: 'var(--color-text-main)' }}>
            AI 공간 분석 가이드
          </h3>
          <p className="guide-subtitle" style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.5, margin: 0 }}>
            더 정확한 조명 추천을 위해<br />아래 가이드에 따라 촬영해 주세요.
          </p>
        </div>

        <div className="guide-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          <div className="guide-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--color-bg-cream, #F8F6F0)', borderRadius: '16px', border: '1px solid var(--color-border, #E2E8F0)' }}>
            <div className="guide-icon-box" style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFAB40', color: '#121826', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>photo_camera_back</span>
            </div>
            <div className="guide-info">
              <h4 className="guide-item-title" style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 2px 0' }}>공간 전체 촬영</h4>
              <p className="guide-item-desc" style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0, lineHeight: 1.4 }}>방 전체가 잘 보이도록 구도를 잡고 촬영해 주세요.</p>
            </div>
          </div>

          <div className="guide-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--color-bg-cream, #F8F6F0)', borderRadius: '16px', border: '1px solid var(--color-border, #E2E8F0)' }}>
            <div className="guide-icon-box" style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFAB40', color: '#121826', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>crop_free</span>
            </div>
            <div className="guide-info">
              <h4 className="guide-item-title" style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 2px 0' }}>수평 맞추기</h4>
              <p className="guide-item-desc" style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0, lineHeight: 1.4 }}>카메라를 수평으로 유지하면 더 정확한 분석이 가능합니다.</p>
            </div>
          </div>

          <div className="guide-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'var(--color-bg-cream, #F8F6F0)', borderRadius: '16px', border: '1px solid var(--color-border, #E2E8F0)' }}>
            <div className="guide-icon-box" style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#FFAB40', color: '#121826', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>cleaning_services</span>
            </div>
            <div className="guide-info">
              <h4 className="guide-item-title" style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 2px 0' }}>불필요한 장애물 제거</h4>
              <p className="guide-item-desc" style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)', margin: 0, lineHeight: 1.4 }}>분석을 방해하는 작은 물건들은 치워주시는 것이 좋습니다.</p>
            </div>
          </div>
        </div>

        <div className="guide-actions" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-primary btn-guide-cta"
            onClick={handleStartScan}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '26px',
              backgroundColor: '#FFAB40',
              color: '#121826',
              border: 'none',
              fontWeight: 900,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,171,64,0.4)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>photo_camera</span>
            <span>스캔 시작하기</span>
          </button>
          <div className="guide-links-row" style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              type="button"
              className="btn-guide-cancel-link"
              onClick={closeModal}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--color-text-sub)', cursor: 'pointer' }}
            >
              나중에 하기
            </button>
            <button
              type="button"
              className="btn-guide-skip-link"
              onClick={handleStartScan}
              style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--color-text-sub)', cursor: 'pointer', textDecoration: 'underline' }}
            >
              생략하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
