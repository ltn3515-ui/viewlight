import React, { useState } from 'react';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

export const CheckoutModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'easy' | 'card' | 'transfer'>('easy');
  const [receiver, setReceiver] = useState('홍길동');
  const [phone, setPhone] = useState('010-1234-5678');
  const [address, setAddress] = useState('서울특별시 강남구 테헤란로 123 뷰라이트 빌딩 5층');
  const [memo, setMemo] = useState('부재 시 문 앞에 놓아주세요.');

  if (activeModal !== 'checkout') return null;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Initialize Toss Payments SDK
      const tossPayments = await loadTossPayments('test_ck_LkKEypNArW9wbL9OkeKl3lmeaxYG');
      
      // 2. Generate unique order ID
      const orderId = `VL-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      
      // 3. Generate orderName
      let orderName = '';
      if (cartItems.length > 0) {
        const firstItemName = cartItems[0].name;
        orderName = cartItems.length > 1 
          ? `${firstItemName} 외 ${cartItems.length - 1}개`
          : firstItemName;
      } else {
        orderName = '뷰라이트 조명 상품';
      }

      // 4. Initialize payment instance
      const payment = tossPayments.payment({
        customerKey: 'ANONYMOUS'
      });

      // 5. Request payment based on paymentMethod selection
      if (paymentMethod === 'transfer') {
        await payment.requestPayment({
          method: 'TRANSFER',
          amount: {
            currency: 'KRW',
            value: totalPrice,
          },
          orderId,
          orderName,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
          customerName: receiver,
          customerMobilePhone: phone.replace(/[^0-9]/g, ''),
        });
      } else {
        // 'easy' and 'card' both launch the Card/EasyPay payment flow
        await payment.requestPayment({
          method: 'CARD',
          amount: {
            currency: 'KRW',
            value: totalPrice,
          },
          orderId,
          orderName,
          successUrl: `${window.location.origin}/payment/success`,
          failUrl: `${window.location.origin}/payment/fail`,
          customerName: receiver,
          customerMobilePhone: phone.replace(/[^0-9]/g, ''),
        });
      }

    } catch (err: any) {
      console.error('Toss Payments Error: ', err);
      showToast(`❌ 결제 진행 중 오류가 발생했습니다: ${err.message || err}`);
    }
  };

  return (
    <div id="checkout-modal" className="fixed-modal-wrapper active" style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1,
        }}
      />

      <div
        className="modal-card checkout-modal-card"
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          overflowY: 'auto',
          padding: '0',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <header
          className="service-header"
          style={{
            borderRadius: '28px 28px 0 0',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'var(--color-bg-card, #FFFFFF)',
            borderBottom: '1px solid var(--color-border, #E2E8F0)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: '#FFAB40', fontSize: '24px' }}>
              credit_card
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>주문 / 결제</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeModal}
            style={{
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
        </header>

        {/* 본문 서식 */}
        <form onSubmit={handleSubmitPayment} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. 주문 상품 요약 */}
          <div style={{ background: 'var(--color-bg-cream, #F8F6F0)', borderRadius: '16px', padding: '16px', border: '1px solid var(--color-border, #E2E8F0)' }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '12px', color: 'var(--color-text-main)' }}>
              주문 상품 ({cartItems.length}개)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={item.img} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>수량: {item.qty}개</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>{(item.price * item.qty).toLocaleString()}원</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 배송지 정보 */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '10px' }}>배송지 정보</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-sub)', display: 'block', marginBottom: '4px' }}>받는 분</label>
                <input
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  required
                  style={{ width: '100%', height: '42px', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '0 12px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-sub)', display: 'block', marginBottom: '4px' }}>연락처</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ width: '100%', height: '42px', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '0 12px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-sub)', display: 'block', marginBottom: '4px' }}>배송 주소</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  style={{ width: '100%', height: '42px', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '0 12px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-sub)', display: 'block', marginBottom: '4px' }}>배송 요청사항</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  style={{ width: '100%', height: '42px', borderRadius: '10px', border: '1px solid var(--color-border)', padding: '0 12px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* 3. 결제 수단 선택 */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '10px' }}>결제 수단 선택</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => setPaymentMethod('easy')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: paymentMethod === 'easy' ? '2px solid #FFAB40' : '1px solid var(--color-border)',
                  background: paymentMethod === 'easy' ? '#FFF3E0' : 'var(--color-bg-cream)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: paymentMethod === 'easy' ? '#E68A00' : 'var(--color-text-main)',
                }}
              >
                💛 간편결제
                <div style={{ fontSize: '0.65rem', fontWeight: 500, marginTop: '2px', color: 'var(--color-text-sub)' }}>카카오/네이버페이</div>
              </div>

              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: paymentMethod === 'card' ? '2px solid #FFAB40' : '1px solid var(--color-border)',
                  background: paymentMethod === 'card' ? '#FFF3E0' : 'var(--color-bg-cream)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: paymentMethod === 'card' ? '#E68A00' : 'var(--color-text-main)',
                }}
              >
                💳 신용카드
                <div style={{ fontSize: '0.65rem', fontWeight: 500, marginTop: '2px', color: 'var(--color-text-sub)' }}>모든 카드 가능</div>
              </div>

              <div
                onClick={() => setPaymentMethod('transfer')}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: paymentMethod === 'transfer' ? '2px solid #FFAB40' : '1px solid var(--color-border)',
                  background: paymentMethod === 'transfer' ? '#FFF3E0' : 'var(--color-bg-cream)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: paymentMethod === 'transfer' ? '#E68A00' : 'var(--color-text-main)',
                }}
              >
                🏦 계좌이체
                <div style={{ fontSize: '0.65rem', fontWeight: 500, marginTop: '2px', color: 'var(--color-text-sub)' }}>실시간 입금</div>
              </div>
            </div>
          </div>

          {/* 4. 결제 금액 계산 요약 */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-sub)' }}>상품 금액</span>
              <span style={{ fontWeight: 700 }}>{totalPrice.toLocaleString()}원</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-sub)' }}>배송비</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>무료배송</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 900, marginTop: '4px' }}>
              <span>최종 결제 금액</span>
              <span style={{ color: '#FFAB40' }}>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          {/* 5. 결제 제출 버튼 */}
          <button
            type="submit"
            className="sheet-submit-pay-btn"
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, #FFAB40 0%, #FF9100 100%)',
              color: '#121826',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(255, 145, 0, 0.4)',
              marginTop: '10px',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>
              lock
            </span>
            <span>{totalPrice.toLocaleString()}원 결제하기</span>
          </button>
        </form>
      </div>
    </div>
  );
};
