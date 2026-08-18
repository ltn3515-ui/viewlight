import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const EditProfileModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { user, login } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || (user?.email ? user.email.split('@')[0] : '김뷰라이트'));
  const [selectedAvatar, setSelectedAvatar] = useState('img/Stand01.jpg');

  if (activeModal !== 'editProfile') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.email) {
      login(user.email, name);
    } else {
      login('ltn3515@viewlight.com', name);
    }
    showToast(`✨ 프로필 정보가 [${name}]으로 변경 되었습니다!`);
    closeModal();
  };

  const handleCustomFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedAvatar(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div id="edit-profile-modal" className="fixed-modal-wrapper active" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-backdrop" onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(18, 24, 38, 0.7)', backdropFilter: 'blur(4px)', zIndex: 1 }} />

      <div
        className="modal-card login-modal-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '360px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
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

        <div className="login-modal-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>프로필 수정</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', margin: 0 }}>
            이름(닉네임)과 프로필 이미지를 설정해보세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="닉네임을 입력하세요"
              required
              style={{
                width: '100%',
                height: '44px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                padding: '0 14px',
                fontSize: '0.9rem',
                fontWeight: 700,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '8px' }}>프로필 아바타 선택</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              {['img/Stand01.jpg', 'img/Stand02.png', 'img/Stand03.png'].map((avatar, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(avatar)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: selectedAvatar === avatar ? '3px solid #FFAB40' : '2px solid transparent',
                    boxShadow: selectedAvatar === avatar ? '0 0 10px rgba(255, 171, 64, 0.4)' : 'none',
                    transition: 'all 0.2s',
                    flexShrink: 0,
                  }}
                >
                  <img src={avatar} alt={`Avatar ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}

              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  color: '#64748B',
                  position: 'relative',
                  flexShrink: 0,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>add_a_photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFile}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '24px',
              backgroundColor: '#FFAB40',
              color: '#121826',
              border: 'none',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 171, 64, 0.4)',
              marginTop: '6px',
            }}
          >
            변경사항 저장
          </button>
        </form>
      </div>
    </div>
  );
};
