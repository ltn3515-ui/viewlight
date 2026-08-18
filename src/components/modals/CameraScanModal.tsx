import React, { useState, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';
import { useNavigate } from 'react-router-dom';

export const CameraScanModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [bgImage, setBgImage] = useState('img/livingroom.jpg');
  const [imageName, setImageName] = useState('AI 실시간 공간 스캔');

  const startScan = () => {
    setProgress(0);
    setStep(1);
  };

  useEffect(() => {
    if (activeModal === 'cameraScan') {
      startScan();
    }
  }, [activeModal]);

  useEffect(() => {
    if (activeModal === 'cameraScan') {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          const next = prev + 10;
          if (next >= 40 && next < 70) setStep(2);
          if (next >= 70) setStep(3);
          return next;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [activeModal, progress === 0]);

  if (activeModal !== 'cameraScan') return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setBgImage(uploadEvent.target.result as string);
          startScan();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="camera-scan-modal" className="fixed-modal-wrapper active" style={{ zIndex: 99999 }}>
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div
        className="camera-viewfinder"
        style={{
          backgroundImage: `url('${bgImage}')`,
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '92vh',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 툴바 */}
        <div className="camera-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button type="button" id="btn-camera-close" className="camera-icon-btn" onClick={closeModal} title="닫기">
            <span className="material-symbols-outlined">close</span>
          </button>

          <div className="camera-status-pill">
            <span className="status-dot-blink"></span>
            <span>{imageName}</span>
          </div>

          <label className="camera-icon-btn" style={{ cursor: 'pointer' }} title="내 갤러리 사진 불러오기">
            <span className="material-symbols-outlined">add_photo_alternate</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* 수평 및 대상 감지 가이드 오버레이 */}
        <div className="viewfinder-ar-overlay">
          <div className="horizontal-level-indicator">
            <span className="level-badge" id="level-badge-text">
              {progress < 100 ? '공간 이미지 스캔 중...' : '분석 완료!'}
            </span>
            <div className="level-line">
              <div className="level-center-dot"></div>
            </div>
          </div>

          <div className="ar-target-box" id="ar-target-box">
            <div className="ar-corner tl"></div>
            <div className="ar-corner tr"></div>
            <div className="ar-corner bl"></div>
            <div className="ar-corner br"></div>
            <span className="ar-target-label">공간 감지 영역</span>

            {/* 추천 설치 위치 오커스 가이드 */}
            <div className="ar-lamp-pin" id="ar-lamp-pin">
              <div className="pin-ring"></div>
              <div className="pin-dot">
                <span className="material-symbols-outlined">lightbulb</span>
              </div>
              <div className="pin-label-box">
                <span className="pin-title">추천 설치 위치</span>
                <span className="pin-subtitle">이곳에 조명을 두면 어떨까요?</span>
              </div>
            </div>
          </div>

          <div className="ar-hint-text">
            {progress < 100 ? '사진 속 공간의 조도와 가구 구조를 분석하고 있습니다.' : '공간 스캔이 성공적으로 완료되었습니다!'}
          </div>
        </div>

        {/* 하단 제어 바텀시트 */}
        <div className="camera-bottom-sheet">
          <div className="sheet-drag-handle"></div>

          {/* 사진 파일 불러오기 & 공간 샘플 버튼 세트 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', justifyContent: 'center' }}>
            <label
              style={{
                background: 'rgba(255, 171, 64, 0.2)',
                color: '#FFAB40',
                border: '1px solid #FFAB40',
                borderRadius: '16px',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>photo_library</span>
              <span>📁 사진 파일 불러오기</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            <button
              type="button"
              onClick={() => {
                setBgImage('img/livingroom.jpg');
                setImageName('거실 샘플 공간');
                startScan();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              거실 샘플
            </button>

            <button
              type="button"
              onClick={() => {
                setBgImage('img/Stand01.jpg');
                setImageName('침실 샘플 공간');
                startScan();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '6px 12px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              침실 샘플
            </button>
          </div>

          <div className="sheet-progress-section">
            <div className="progress-info-row">
              <div className="progress-badge">AI 큐레이션</div>
              <div className="progress-pct" id="camera-progress-pct">{progress}%</div>
            </div>
            <div className="sheet-progress-bar-container">
              <div className="sheet-progress-bar-fill" id="camera-progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          {/* 진단 내역 */}
          <div className="scanning-logs-box">
            <div className={`log-item ${step >= 1 ? 'active' : ''}`}>
              <span className="material-symbols-outlined log-status-icon">
                {step >= 1 ? 'check_circle' : 'circle'}
              </span>
              <span className="log-text">가구 배치 구조 감지...</span>
            </div>
            <div className={`log-item ${step >= 2 ? 'active' : ''}`}>
              <span className="material-symbols-outlined log-status-icon">
                {step >= 2 ? 'check_circle' : 'circle'}
              </span>
              <span className="log-text">사물 조도(밝기) 분석...</span>
            </div>
            <div className={`log-item ${step >= 3 ? 'active' : ''}`}>
              <span className="material-symbols-outlined log-status-icon">
                {step >= 3 ? 'check_circle' : 'circle'}
              </span>
              <span className="log-text">인테리어 분위기 매칭...</span>
            </div>
          </div>

          {/* 하단 버튼 세트 */}
          <div className="camera-actions-row">
            <button
              type="button"
              id="btn-camera-retake"
              className="btn-camera-action secondary"
              onClick={startScan}
            >
              다시 스캔
            </button>
            <button
              type="button"
              id="btn-camera-view-result"
              className={`btn-camera-action primary ${progress < 100 ? 'disabled' : ''}`}
              disabled={progress < 100}
              onClick={() => {
                closeModal();
                navigate('/commend');
              }}
            >
              <span className="material-symbols-outlined">bar_chart</span> AI 분석 결과 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
