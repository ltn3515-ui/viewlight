import React from 'react';

export const ReviewSection: React.FC = () => {
  return (
    <section className="section-reviews" style={{ padding: '32px 20px' }}>
      <div className="section-header-title" style={{ marginBottom: '20px' }}>
        <h3>⭐ 실시간 고객 후기</h3>
      </div>

      <div className="review-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="review-card" style={{ background: 'var(--color-bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ color: '#FFAB40', fontSize: '0.9rem', marginBottom: '6px' }}>★★★★★ 5.0</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '4px' }}>김*우 님 (서울 강남구)</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
            AI 분석 추천으로 Luna Table Lamp 샀는데 퇴근 후 방 분위기가 너무 아늑해졌어요!
          </p>
        </div>

        <div className="review-card" style={{ background: 'var(--color-bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ color: '#FFAB40', fontSize: '0.9rem', marginBottom: '6px' }}>★★★★★ 5.0</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '4px' }}>이*진 님 (경기 성남시)</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)', lineHeight: 1.5 }}>
            조도 5단계 조절이 되니까 침대 옆 서재 겸 무드등으로 쓰기에 딱입니다.
          </p>
        </div>
      </div>
    </section>
  );
};
