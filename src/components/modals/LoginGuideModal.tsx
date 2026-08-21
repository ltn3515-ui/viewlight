import React from 'react';
import { useModal } from '../../context/ModalContext';

export const LoginGuideModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();

  if (activeModal !== 'loginGuide') return null;

  const handleGoToLogin = () => {
    closeModal();
    // 부드럽게 넘어가도록 약간의 딜레이를 주어 로그인 모달을 띄웁니다.
    setTimeout(() => {
      openModal('login');
    }, 100);
  };

  return (
    <div
      id="login-guide-modal"
      className="fixed-modal-wrapper active"
      style={{
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* 백드롭 레이어: 블러 효과 추가 */}
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(8px)',
          zIndex: 1,
        }}
      />

      {/* 모달 카드 바디 */}
      <div
        className="modal-card login-guide-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '90%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '40px 24px 32px 24px',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 15px 30px -10px rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--color-border, rgba(226, 232, 240, 0.8))',
          textAlign: 'center',
          animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 닫기 버튼 */}
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
            transition: 'background-color 0.2s',
          }}
          title="닫기"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-text-sub)' }}>close</span>
        </button>

        {/* 장바구니/로그인 안내 비주얼 아이콘 영역 */}
        <div
          className="guide-icon-container"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FFD54F 0%, #FFAB40 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 10px 25px -5px rgba(255, 171, 64, 0.5)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '40px', fontWeight: 'bold' }}>
            shopping_cart
          </span>
        </div>

        {/* 메인 안내 문구 */}
        <h3
          className="guide-title"
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginBottom: '12px',
            color: 'var(--color-text-main, #121826)',
            letterSpacing: '-0.5px',
          }}
        >
          로그인이 필요합니다
        </h3>
        <p
          className="guide-description"
          style={{
            fontSize: '0.92rem',
            color: 'var(--color-text-sub, #64748B)',
            lineHeight: 1.6,
            margin: '0 0 32px 0',
            whiteSpace: 'pre-line',
            wordBreak: 'keep-all',
          }}
        >
          장바구니 담기는 회원 전용 서비스입니다.{"\n"}
          로그인 후 ViewLight의 다양한 라이프스타일 조명과 혜택을 만나보세요! ✨
        </p>

        {/* 하단 액션 버튼 그룹 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGoToLogin}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '26px',
              background: 'linear-gradient(90deg, #FFAB40 0%, #FF9100 100%)',
              color: '#121826',
              border: 'none',
              fontWeight: 800,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 8px 20px -4px rgba(255, 145, 0, 0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            로그인하러 가기
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={closeModal}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '26px',
              backgroundColor: 'var(--color-bg-cream, #F8F6F0)',
              color: 'var(--color-text-main, #121826)',
              border: '1px solid var(--color-border, #E2E8F0)',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            나중에 하기
          </button>
        </div>
      </div>
    </div>
  );
};
