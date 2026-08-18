import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

interface Review {
  id: string;
  productName: string;
  rating: number;
  date: string;
  content: string;
  img?: string;
}

export const MyReviewsModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'REV-001',
      productName: '아우라 플로어 램프',
      rating: 5,
      date: '2026.08.05',
      content: '거실 분위기가 완전히 달라졌어요! AI 분석 추천대로 3000K로 맞춰 사용 중인데 은은하고 눈도 안 아프네요. 디자인이 인테리어 포인트가 됩니다.',
      img: 'img/img002.png',
    },
    {
      id: 'REV-002',
      productName: 'Luna Table Lamp',
      rating: 4,
      date: '2026.07.20',
      content: '원목 침대 협탁 위에 올렸는데 마감이 고급스럽고 불빛 세기 조절이 간편해서 마음에 듭니다. 배송도 빨랐어요.',
      img: 'img/Stand02.png',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [productName, setProductName] = useState('Luna Table Lamp');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  if (activeModal !== 'myReviews') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      showToast('⚠️ 리뷰 내용을 입력해주세요.');
      return;
    }

    const newReview: Review = {
      id: `REV-${Date.now()}`,
      productName,
      rating,
      date: new Date().toLocaleDateString('ko-KR').replace(/\. /g, '.').slice(0, -1),
      content,
      img: productName === 'Luna Table Lamp' ? 'img/Stand02.png' : 'img/Category1.png',
    };

    setReviews([newReview, ...reviews]);
    showToast('✨ 리뷰가 성공적으로 등록되었습니다!');
    
    // Reset Form
    setContent('');
    setRating(5);
    setShowAddForm(false);
  };

  return (
    <div
      id="my-reviews-modal"
      className="fixed-modal-wrapper active"
      style={{
        zIndex: 999999,
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
      <div
        className="modal-backdrop"
        onClick={closeModal}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(18, 24, 38, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <div
        className="modal-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
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

        {/* Header */}
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>💬 내 리뷰 관리</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', margin: 0 }}>
            내가 작성한 후기를 확인하고 새로 작성할 수 있습니다.
          </p>
        </div>

        {/* Write Review Toggle Button */}
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary, #FFAB40)',
              color: '#121826',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
            <span>새 리뷰 작성하기</span>
          </button>
        )}

        {/* Add Review Form */}
        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: 'var(--color-bg-cream, #F8F6F0)',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              border: '1px solid var(--color-border, #E2E8F0)',
            }}
          >
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>대상 상품</label>
              <select
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  padding: '0 10px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  backgroundColor: '#FFF',
                }}
              >
                <option value="Luna Table Lamp">Luna Table Lamp</option>
                <option value="아우라 펜던트 조명">아우라 펜던트 조명</option>
                <option value="아우라 플로어 램프">아우라 플로어 램프</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '4px' }}>별점 평가</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="material-symbols-outlined"
                    onClick={() => setRating(star)}
                    style={{
                      cursor: 'pointer',
                      color: star <= rating ? '#FFAB40' : '#CBD5E1',
                      fontVariationSettings: star <= rating ? '"FILL" 1' : 'none',
                    }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, display: 'block', marginBottom: '6px' }}>리뷰 내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="상품에 대한 솔직한 후기를 남겨주세요."
                rows={3}
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border)',
                  padding: '10px',
                  fontSize: '0.85rem',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit',
                  backgroundColor: '#FFF',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#E2E8F0',
                  color: '#475569',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                취소
              </button>
              <button
                type="submit"
                style={{
                  flex: 2,
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#121826',
                  color: '#FFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                등록하기
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingRight: '4px',
          }}
        >
          {reviews.map((rev) => (
            <div
              key={rev.id}
              style={{
                border: '1px solid var(--color-border, #E2E8F0)',
                borderRadius: '16px',
                padding: '14px',
                backgroundColor: 'var(--color-bg-card, #FFFFFF)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Product Info */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                {rev.img && (
                  <img
                    src={rev.img}
                    alt={rev.productName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid var(--color-border)',
                      backgroundColor: '#fff',
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--color-text-main)' }}>
                    {rev.productName}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ fontSize: '0.72rem', color: '#FFAB40', fontWeight: 800 }}>
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-sub)' }}>{rev.date}</span>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-sub)', margin: 0, lineHeight: 1.4, wordBreak: 'break-all' }}>
                {rev.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
