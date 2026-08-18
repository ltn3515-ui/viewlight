import React, { useState } from 'react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    { q: 'Q. 3초 AI 공간 분석은 어떻게 동작하나요?', a: '업로드하신 공간 사진의 색조, 명암, 가구 배치를 AI 비전 엔진이 자동 감지하여 최적의 CCT 및 조도를 가진 무드등을 추천합니다.' },
    { q: 'Q. 배송은 얼마나 걸리나요?', a: '오후 4시 이전 주문건은 당일 출고되며, 전국 1~2일 이내 전달됩니다.' },
    { q: 'Q. 무상 AS 기간은 어떻게 되나요?', a: 'ViewLight의 모든 조명 제품은 1년간 무상 보증 및 LED 모듈 교체 서비스를 제공합니다.' },
  ];

  return (
    <section className="section-faq" style={{ padding: '32px 20px' }}>
      <div className="section-header-title" style={{ marginBottom: '20px' }}>
        <h3>❓ 자주 묻는 질문</h3>
      </div>

      <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="faq-item-box"
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '14px',
              overflow: 'hidden',
              background: 'var(--color-bg-card)',
            }}
          >
            <div
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              style={{
                padding: '16px',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span>{faq.q}</span>
              <span className="material-symbols-outlined">
                {openIndex === idx ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            {openIndex === idx && (
              <div
                style={{
                  padding: '0 16px 16px 16px',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-sub)',
                  lineHeight: '1.5',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '12px',
                }}
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
