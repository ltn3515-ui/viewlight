import React from 'react';
import { useModal } from '../../context/ModalContext';

export const OrderHistoryModal: React.FC = () => {
  const { activeModal, closeModal } = useModal();

  if (activeModal !== 'orderHistory') return null;

  // Mock data for order history
  const orders = [
    {
      id: 'OD-20260818-12495',
      date: '2026-08-18',
      status: '배송 중',
      statusColor: '#FF9100', // Orange for in delivery
      items: [
        {
          name: 'Luna Table Lamp',
          price: 150000,
          qty: 1,
          img: 'img/Stand02.png',
        },
      ],
    },
    {
      id: 'OD-20260715-08312',
      date: '2026-07-15',
      status: '배송 완료',
      statusColor: '#10B981', // Green for completed
      items: [
        {
          name: '아우라 펜던트 조명',
          price: 210000,
          qty: 1,
          img: 'img/Category1.png',
        },
      ],
    },
  ];

  return (
    <div
      id="order-history-modal"
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
          maxWidth: '380px',
          backgroundColor: 'var(--color-bg-card, #FFFFFF)',
          color: 'var(--color-text-main, #121826)',
          borderRadius: '28px',
          padding: '24px 20px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border, #E2E8F0)',
          maxHeight: '80vh',
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
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px 0' }}>📄 최근 주문 내역</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', margin: 0 }}>
            최근 구매하신 상품의 배송 상태를 확인해 보세요.
          </p>
        </div>

        {/* Order List */}
        <div
          style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            paddingRight: '4px',
          }}
        >
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: '1px solid var(--color-border, #E2E8F0)',
                borderRadius: '16px',
                padding: '14px',
                backgroundColor: 'var(--color-bg-cream, #F8F6F0)',
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                  paddingBottom: '8px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-sub)', display: 'block' }}>
                    {order.date}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    {order.id}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 900,
                    color: '#FFF',
                    backgroundColor: order.statusColor,
                    padding: '3px 8px',
                    borderRadius: '12px',
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Items in the Order */}
              {order.items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img
                    src={item.img}
                    alt={item.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '10px',
                      objectFit: 'cover',
                      border: '1px solid var(--color-border, #E2E8F0)',
                      backgroundColor: '#fff',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 800, margin: '0 0 2px 0', color: 'var(--color-text-main)' }}>
                      {item.name}
                    </h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-sub)' }}>
                        수량: {item.qty}개
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                        {item.price.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
