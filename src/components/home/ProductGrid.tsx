import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export const ProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent, name: string, price: number, img: string) => {
    e.stopPropagation();
    addToCart(name, price, img);
    showToast(`🛒 [${name}]가 장바구니에 추가되었습니다!`);
  };

  return (
    <>
      {/* 추천 카테고리 2x2 그리드 */}
      <section className="section-categories">
        <div className="section-header-title">
          <h3>추천 카테고리</h3>
          <button
            type="button"
            id="btn-categories-all"
            className="more-link"
            onClick={() => navigate('/category-all')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            전체보기 ➔
          </button>
        </div>
        <div className="category-grid-2x2">
          <div
            className="cat-card cat-1 cat-item"
            onClick={() => openModal('productDetail', {
              id: 'aurora-brass',
              name: '아우라 펜던트 조명',
              price: 210000,
              img: 'img/Category1.png',
              category: 'ambient',
              badge: 'Popular'
            })}
            style={{ cursor: 'pointer' }}
          >
            <span className="cat-badge">Popular</span>
            <span className="cat-label cat-title-text">펜던트 조명</span>
          </div>

          <div
            className="cat-card cat-2 cat-item"
            onClick={() => openModal('productDetail', {
              id: 'luna-table',
              name: 'Luna Table Lamp',
              price: 150000,
              img: 'img/Stand02.png',
              category: 'table',
              badge: 'Best'
            })}
            style={{ cursor: 'pointer' }}
          >
            <span className="cat-label cat-title-text">무드등</span>
          </div>

          <div
            className="cat-card cat-3 cat-item"
            onClick={() => openModal('productDetail', {
              id: 'aura-floor',
              name: '아우라 플로어 램프',
              price: 180000,
              img: 'img/img002.png',
              category: 'floor'
            })}
            style={{ cursor: 'pointer' }}
          >
            <span className="cat-label cat-title-text">플로어 무드등</span>
          </div>

          <div
            className="cat-card cat-4 cat-item"
            onClick={() => openModal('productDetail', {
              id: 'neo-able',
              name: '네오 데스크 램프',
              price: 135000,
              img: 'img/Category 4.png',
              category: 'table'
            })}
            style={{ cursor: 'pointer' }}
          >
            <span className="cat-label cat-title-text">데스크 램프</span>
          </div>
        </div>
      </section>

      {/* Featured Lighting */}
      <section className="section-featured">
        <div className="section-header-title">
          <h3>Featured Lighting</h3>
          <button
            type="button"
            id="btn-featured-more"
            className="featured-more-btn"
            onClick={() => navigate('/featured-more')}
            title="이달의 추천 조명 더보기"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <p className="featured-sub">현대적인 거실에 맞춰 한정수량으로 제작 되었습니다.</p>

        <div
          className="featured-product-card"
          onClick={() => openModal('productDetail', {
            id: 'luna-table',
            name: 'Luna Table Lamp',
            price: 150000,
            img: 'img/Stand01.jpg',
            category: 'table',
            badge: 'AI 매칭률 95%'
          })}
          style={{ cursor: 'pointer' }}
        >
          <div className="product-img-box">
            <img src="img/Stand01.jpg" alt="Luna Table Lamp" className="product-img" />
            <div className="spec-tag-group">
              <span className="spec-tag">AI 매칭률 95%</span>
              <span className="spec-tag">2700K Warm</span>
            </div>
          </div>
          <div className="product-info">
            <h4 className="product-title">Luna Table Lamp 150,000원</h4>
            <p className="product-meta">Matte Charcoal</p>
            <button
              type="button"
              className="add-to-cart-btn"
              onClick={(e) => handleAddToCart(e, 'Luna Table Lamp', 150000, 'img/Stand01.jpg')}
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              ADD TO CART
            </button>
          </div>
        </div>
      </section>
    </>
  );
};
