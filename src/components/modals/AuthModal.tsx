import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { login, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (activeModal !== 'login') return null;

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      try {
        await loginWithGoogle();
        showToast('🎉 Google 계정으로 로그인 되었습니다!');
        closeModal();
      } catch (error) {
        showToast('⚠️ Google 로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      login(`user_${provider.toLowerCase()}@viewlight.com`, `${provider} 사용자`);
      showToast(`🎉 ${provider} 계정으로 로그인 되었습니다!`);
      closeModal();
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('⚠️ 이메일과 비밀번호를 입력해주세요.');
      return;
    }
    login(email, name || email.split('@')[0]);
    showToast(mode === 'login' ? '🎉 로그인 되었습니다!' : '🎉 회원가입 및 로그인이 완료되었습니다!');
    closeModal();
  };

  return (
    <div id="login-modal" className="fixed-modal-wrapper active">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="login-modal-card">
        <button type="button" className="modal-close-btn" onClick={closeModal} title="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="login-modal-header">
          <div className="login-logo">
            <span className="login-logo-text">ViewLight</span>
          </div>
          <h3 className="login-modal-title">
            {mode === 'login' ? '로그인' : '이메일 회원가입'}
          </h3>
          <p className="login-modal-sub">
            {mode === 'login'
              ? 'ViewLight 회원만을 위한 특별한 조명 제어 혜택을 누리세요.'
              : '가입 즉시 사용할 수 있는 15% 웰컴 쿠폰팩을 드립니다.'}
          </p>
        </div>

        {/* 1. 소셜 로그인 버튼 영역 */}
        <div className="social-login-group">
          <button
            type="button"
            className="btn-social btn-kakao"
            onClick={() => handleSocialLogin('Kakao')}
          >
            <img src="img/카카오톡이미지.jpg" alt="Kakao Logo" className="social-icon-img" />
            <span className="social-text">카카오로 3초 만에 시작하기</span>
          </button>
          <button
            type="button"
            className="btn-social btn-google"
            onClick={() => handleSocialLogin('Google')}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="social-text">Google 계정으로 시작하기</span>
          </button>
          <button
            type="button"
            className="btn-social btn-apple"
            onClick={() => handleSocialLogin('Apple')}
          >
            <svg className="apple-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-1.0 2.94.9.07 2.01-.52 2.83-1.33z"/>
            </svg>
            <span className="social-text">Apple로 로그인</span>
          </button>
        </div>

        <div className="login-divider">
          <span>또는 이메일로 시작하기</span>
        </div>

        {/* 2. 이메일 로그인/회원가입 폼 */}
        <div className="login-form-wrapper">
          <form onSubmit={handleEmailSubmit}>
            {mode === 'signup' && (
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label>이름 (닉네임)</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="닉네임을 입력하세요"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label>이메일 주소</label>
              <input
                type="email"
                className="modal-input"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>비밀번호</label>
              <input
                type="password"
                className="modal-input"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login-submit">
              {mode === 'login' ? '로그인' : '회원가입 완료'}
            </button>
          </form>

          <div className="login-switch-prompt" style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.85rem' }}>
            {mode === 'login' ? (
              <>
                아직 회원이 아니신가요?{' '}
                <button
                  type="button"
                  className="btn-switch-tab"
                  onClick={() => setMode('signup')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  이메일로 가입하기
                </button>
              </>
            ) : (
              <>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  className="btn-switch-tab"
                  onClick={() => setMode('login')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  로그인하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
