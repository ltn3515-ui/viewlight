import React from 'react';
import styled from 'styled-components';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'block' : 'none')};
`;

const Drawer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 420px;
  height: 100vh;
  background: var(--color-bg-card);
  color: var(--color-text-main);
  z-index: 100000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
  transform: translateX(${props => (props.$isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    font-size: 1.2rem;
    font-weight: 800;
  }
`;

const CloseBtn = styled.button`
  color: var(--color-text-sub);
  font-size: 1.4rem;
`;

const CartList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CartItemRow = styled.div`
  display: flex;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  background: var(--color-bg-cream);
  border: 1px solid var(--color-border);
  align-items: center;
`;

const ItemImg = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
`;

const ItemInfo = styled.div`
  flex: 1;

  h4 {
    font-size: 0.95rem;
    font-weight: 700;
    margin-bottom: 4px;
  }

  p {
    font-size: 0.85rem;
    color: var(--color-accent);
    font-weight: 800;
  }
`;

const QtyControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-bg-card);
  padding: 4px 8px;
  border-radius: 8px;
  border: 1px solid var(--color-border);

  button {
    font-weight: 800;
    color: var(--color-text-main);
  }
`;

const Footer = styled.div`
  padding: 20px;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 800;
`;

const CheckoutBtn = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: var(--color-accent);
  color: #121826;
  font-size: 1rem;
  font-weight: 800;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-sub);
`;

const ClearAllBtn = styled.button`
  background: none;
  border: none;
  font-size: 0.82rem;
  color: var(--color-text-sub, #64748B);
  cursor: pointer;
  text-decoration: underline;
  align-self: flex-end;
  padding: 0 4px;
  font-weight: 700;
  transition: color 0.2s;

  &:hover {
    color: #EF4444; /* hover color to light red for danger signaling */
  }
`;

export const CartDrawer: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();
  const { showToast } = useToast();

  const isOpen = activeModal === 'cart';

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('장바구니가 비어 있습니다. 제품을 담은 후 주문해 주세요!', 'error');
      return;
    }
    openModal('checkout');
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={closeModal} />
      <Drawer $isOpen={isOpen}>
        <Header>
          <h3>🛒 장바구니</h3>
          <CloseBtn onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </CloseBtn>
        </Header>

        <CartList>
          {cartItems.length === 0 ? (
            <EmptyCart>장바구니에 담긴 제품이 없습니다.</EmptyCart>
          ) : (
            <>
              <ClearAllBtn onClick={() => {
                clearCart();
                showToast('🛒 장바구니를 모두 비웠습니다.');
              }}>
                모두 비우기
              </ClearAllBtn>
              {cartItems.map(item => (
                <CartItemRow key={item.id}>
                  <ItemImg src={item.img} alt={item.name} />
                  <ItemInfo>
                    <h4>{item.name}</h4>
                    <p>{item.price.toLocaleString()}원</p>
                  </ItemInfo>
                  <QtyControls>
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </QtyControls>
                </CartItemRow>
              ))}
            </>
          )}
        </CartList>

        <Footer>
          <TotalRow>
            <span>총 결제금액</span>
            <span style={{ color: 'var(--color-accent)' }}>{totalPrice.toLocaleString()}원</span>
          </TotalRow>
          <CheckoutBtn onClick={handleCheckout}>주문하기</CheckoutBtn>
        </Footer>
      </Drawer>
    </>
  );
};
