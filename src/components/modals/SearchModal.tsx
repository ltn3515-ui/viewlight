import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';
import { useToast } from '../../context/ToastContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 99999;
  display: ${props => (props.$isOpen ? 'flex' : 'none')};
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
`;

const ModalCard = styled.div`
  width: 90%;
  max-width: 500px;
  background: #181C26;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const SearchInputGroup = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 12px 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #FFFFFF;
    font-size: 0.95rem;

    &:focus { border-color: #FFAB40; outline: none; }
  }

  button {
    padding: 12px 20px;
    border-radius: 12px;
    background: #FFAB40;
    color: #121826;
    font-weight: 800;
    border: none;
    cursor: pointer;
  }
`;

const TagTitle = styled.h4`
  font-size: 0.85rem;
  color: #94A3B8;
  margin-bottom: 10px;
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 6px 12px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.82rem;
    color: #F4F1EA;
    cursor: pointer;

    &:hover { border-color: #FFAB40; color: #FFAB40; }
  }
`;

/* Error Modal Styling */
const ErrorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(5px);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorCard = styled.div`
  width: 85%;
  max-width: 380px;
  background: #1F2431;
  color: #FFFFFF;
  border-radius: 20px;
  padding: 28px 24px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: modalFadeIn 0.2s ease-out;

  @keyframes modalFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ErrorIcon = styled.span`
  font-size: 3.5rem;
  color: #FF5252;
  margin-bottom: 16px;
  display: inline-block;
`;

const ErrorTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #F8FAFC;
`;

const ErrorMsg = styled.p`
  font-size: 0.92rem;
  color: #94A3B8;
  line-height: 1.6;
  margin-bottom: 24px;

  strong {
    color: #FFAB40;
    font-weight: 800;
  }
`;

const ErrorButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: #FFAB40;
  color: #121826;
  font-weight: 800;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;

  &:hover {
    background: #FFC06E;
  }
`;

const tagProductMap: Record<string, any> = {
  '원목 탁상등': {
    id: 'explore-wood-hexa',
    name: '원목 감성 무드등',
    price: 150000,
    img: 'img/light001.jpg',
    category: 'table',
  },
  '아우라 플로어': {
    id: 'aura-floor',
    name: '아우라 플로어 램프',
    price: 180000,
    img: 'img/img002.png',
    category: 'floor',
  },
  '스마트 스트립': {
    id: 'ambient-strip',
    name: '엠비언트 스트립',
    price: 62000,
    img: 'img/Stand04.png',
    category: 'ambient',
  },
  '침실 무드등': {
    id: 'explore-cozy-acrylic',
    name: '포근한 아크릴 무드등',
    price: 120000,
    img: 'img/light002.jpg',
    category: 'table',
  },
  'RGB 조도 조절': {
    id: 'explore-smart-cube',
    name: '스마트 IoT 무드등',
    price: 62000,
    img: 'img/light004.jpg',
    category: 'smart',
  },
};

const menuItems = [
  { keywords: ['홈', 'home', '메인', 'main', '첫화면', '첫 화면'], path: '/', type: 'page', label: '홈' },
  { keywords: ['ai큐레이션', '큐레이션', '추천', 'recommend', '리포트', 'report', '추천무드등', '추천 무드등'], path: '/commend', type: 'page', label: 'AI 큐레이션' },
  { keywords: ['제품둘러보기', '제품 둘러보기', '둘러보기', '전체보기', '카테고리', 'category', '상품목록', '상품 목록', '제품목록', '제품 목록'], path: '/category-all', type: 'page', label: '제품 둘러보기' },
  { keywords: ['이달의추천', '이달의 추천', 'featured', '피처드', '컬렉션'], path: '/featured-more', type: 'page', label: '이달의 추천 조명' },
  { keywords: ['마이페이지', '마이 페이지', 'mypage', '마이', '내정보', '내 정보'], path: '/mypage', type: 'page', label: '마이페이지' },
  { keywords: ['스타일링', '비포애프터', '비포 애프터', 'bna', '비포&애프터', '쇼케이스'], path: '/bna-all', type: 'page', label: '스타일링 비포&애프터' },
  { keywords: ['스토리', 'story', '매거진', 'magazine'], path: '/story', type: 'page', label: '스토리 매거진' },
  { keywords: ['장바구니', 'cart', '카트'], modal: 'cart', type: 'modal', label: '장바구니' },
  { keywords: ['주문내역', '주문 내역', '주문', '배송', 'order'], modal: 'orderHistory', type: 'modal', label: '주문 내역' },
  { keywords: ['리뷰', '후기', '나의리뷰', '나의 리뷰', 'review'], modal: 'myReviews', type: 'modal', label: '나의 리뷰' },
  { keywords: ['알림', 'notification', '새소식', '새 소식'], modal: 'notification', type: 'modal', label: '실시간 알림' },
  { keywords: ['쿠폰', 'coupon', '쿠폰함', '혜택'], modal: 'coupon', type: 'modal', label: '쿠폰함' },
  { keywords: ['설정', 'settings', '환경설정', '환경 설정'], modal: 'settings', type: 'modal', label: '설정' },
  { keywords: ['ai기술', 'ai 기술', 'aitech', '기술소개', '기술 소개'], modal: 'aiTech', type: 'modal', label: 'AI 기술 소개' },
  { keywords: ['ar카메라', 'ar 카메라', '카메라', '스캔', 'scan', '카메라스캔', '카메라 스캔'], modal: 'scanGuide', type: 'modal', label: 'AR 카메라 스캔 가이드' }
];

const productsList = [
  {
    id: 'explore-wood-hexa',
    name: '원목 감성 무드등',
    price: 150000,
    img: 'img/light001.jpg',
    category: 'table',
    keywords: ['원목 감성 무드등', '원목', '감성 무드등', '헥사', 'wood', 'hexa']
  },
  {
    id: 'explore-cozy-acrylic',
    name: '포근한 아크릴 무드등',
    price: 120000,
    img: 'img/light002.jpg',
    category: 'table',
    keywords: ['포근한 아크릴 무드등', '아크릴', '포근한', 'acryl', 'cozy']
  },
  {
    id: 'explore-aurora-wave',
    name: '오로라 웨이브 무드등',
    price: 180000,
    img: 'img/light003.jpg',
    category: 'ambient',
    keywords: ['오로라 웨이브 무드등', '오로라', '웨이브', 'aurora', 'wave']
  },
  {
    id: 'explore-smart-cube',
    name: '스마트 IoT 무드등',
    price: 62000,
    img: 'img/light004.jpg',
    category: 'smart',
    keywords: ['스마트 IoT 무드등', '스마트 IoT', '아이오티', 'smart', 'iot']
  },
  {
    id: 'explore-minimal-ceramic',
    name: '미니멀 세라믹 무드등',
    price: 135000,
    img: 'img/light005.jpg',
    category: 'table',
    keywords: ['미니멀 세라믹 무드등', '세라믹', '도자기', 'ceramic', 'minimal']
  },
  {
    id: 'explore-designer-handcraft',
    name: '디자이너 수공예 무드등',
    price: 250000,
    img: 'img/light006.jpg',
    category: 'table',
    keywords: ['디자이너 수공예 무드등', '수공예', '디자이너', 'handcraft']
  },
  {
    id: 'explore-crystal-art',
    name: '크리스탈 아트 무드등',
    price: 195000,
    img: 'img/light007.jpg',
    category: 'ambient',
    keywords: ['크리스탈 아트 무드등', '크리스탈', '크리스털', 'crystal']
  },
  {
    id: 'explore-paper-folding',
    name: '에코 종이 폴딩 무드등',
    price: 89000,
    img: 'img/light008.jpg',
    category: 'table',
    keywords: ['에코 종이 폴딩 무드등', '종이', '폴딩', '에코', 'paper']
  },
  {
    id: 'explore-brass-pendant',
    name: '황동 미니멀 펜던트 무드등',
    price: 210000,
    img: 'img/light009.jpg',
    category: 'pendant',
    keywords: ['황동 미니멀 펜던트 무드등', '황동', '펜던트', 'brass', 'pendant']
  },
  {
    id: 'explore-camping-portable',
    name: '실외 포터블 캠핑 무드등',
    price: 98000,
    img: 'img/light010.jpg',
    category: 'pendant',
    keywords: ['실외 포터블 캠핑 무드등', '실외', '포터블', '캠핑', 'outdoor', 'camping']
  },
  {
    id: 'luna-table',
    name: 'Luna Table Lamp',
    price: 150000,
    img: 'img/Stand02.png',
    category: 'table',
    keywords: ['luna table lamp', 'luna', '루나', '탁상등', '원목 탁상등']
  },
  {
    id: 'aura-floor',
    name: '아우라 플로어 램프',
    price: 180000,
    img: 'img/img002.png',
    category: 'floor',
    keywords: ['아우라 플로어 램프', '아우라', '플로어', 'aura', 'floor']
  },
  {
    id: 'neo-able',
    name: '네오 데스크 램프',
    price: 135000,
    img: 'img/Category 4.png',
    category: 'table',
    keywords: ['네오 데스크 램프', '네오 데스크', '데스크 램프', 'desk lamp']
  },
  {
    id: 'aurora-brass',
    name: '오로라 브라스 펜던트',
    price: 450000,
    img: 'img/Transformation Card 2.png',
    category: 'pendant',
    keywords: ['오로라 브라스 펜던트', '오로라 브라스', '브라스', 'aurora brass']
  },
  {
    id: 'lumina-floor',
    name: '루미나 플로어 아크',
    price: 220000,
    img: 'img/Stand05.jpg',
    category: 'floor',
    keywords: ['루미나 플로어 아크', '루미나', '플로어 아크', 'lumina']
  },
  {
    id: 'rec-neo-able',
    name: '네오 에블 라이트',
    price: 200000,
    img: 'img/Stand03.png',
    category: 'table',
    keywords: ['네오 에블 라이트', '네오 에블', '에블', 'neo able']
  },
  {
    id: 'ambient-strip',
    name: '엠비언트 스트립',
    price: 62000,
    img: 'img/Stand04.png',
    category: 'ambient',
    keywords: ['엠비언트 스트립', '스마트 스트립', '스트립', 'strip']
  },
  {
    id: 'rec-smart-cube',
    name: '스마트 큐브 무드등',
    price: 49000,
    img: 'img/light004.jpg',
    category: 'smart',
    keywords: ['스마트 큐브 무드등', '스마트 큐브']
  },
  {
    id: 'rec-luna-shade',
    name: '루나 쉐이드 테이블 램프',
    price: 90000,
    img: 'img/Stand01.jpg',
    category: 'table',
    keywords: ['루나 쉐이드 테이블 램프', '루나 쉐이드', '쉐이드', 'shade']
  }
];

export const SearchModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useModal();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  if (activeModal !== 'search') return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanQuery) return;

    // 1. Check for page / modal match
    const matchedMenu = menuItems.find(menu => 
      menu.keywords.some(keyword => {
        const cleanKeyword = keyword.toLowerCase().replace(/\s+/g, '');
        return cleanQuery.includes(cleanKeyword) || cleanKeyword.includes(cleanQuery);
      })
    );

    if (matchedMenu) {
      closeModal();
      if (matchedMenu.type === 'page' && matchedMenu.path) {
        navigate(matchedMenu.path);
        showToast(`🧭 [${matchedMenu.label}] 페이지로 이동합니다.`);
      } else if (matchedMenu.type === 'modal' && matchedMenu.modal) {
        openModal(matchedMenu.modal as any);
        showToast(`✨ [${matchedMenu.label}] 화면을 엽니다.`);
      }
      return;
    }

    // 2. Check for product match
    const matchedProduct = productsList.find(prod => 
      prod.keywords.some(keyword => {
        const cleanKeyword = keyword.toLowerCase().replace(/\s+/g, '');
        return cleanQuery.includes(cleanKeyword) || cleanKeyword.includes(cleanQuery);
      }) || prod.name.toLowerCase().replace(/\s+/g, '').includes(cleanQuery)
    );

    if (matchedProduct) {
      openModal('productDetail', matchedProduct as any);
      showToast(`✨ [${matchedProduct.name}] 상세 페이지로 이동합니다.`);
      return;
    }

    // 3. Not found: show error modal dialog
    setLastQuery(query);
    setShowErrorModal(true);
  };

  const handleTagClick = (tag: string) => {
    const product = tagProductMap[tag];
    if (product) {
      openModal('productDetail', product);
      showToast(`✨ [${product.name}] 상세 페이지로 이동합니다.`);
    } else {
      setQuery(tag);
      showToast(`🔍 [${tag}] 검색 결과를 조회합니다.`);
      closeModal();
    }
  };

  return (
    <>
      <Overlay $isOpen={true} onClick={closeModal}>
        <ModalCard onClick={e => e.stopPropagation()}>
          <SearchInputGroup onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="어떤 공간 조명을 찾으시나요?"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit">검색</button>
          </SearchInputGroup>

          <TagTitle>인기 추천 검색어</TagTitle>
          <TagGroup>
            {['원목 탁상등', '아우라 플로어', '스마트 스트립', '침실 무드등', 'RGB 조도 조절'].map(tag => (
              <span key={tag} onClick={() => handleTagClick(tag)}>
                #{tag}
              </span>
            ))}
          </TagGroup>
        </ModalCard>
      </Overlay>

      {showErrorModal && (
        <ErrorOverlay onClick={() => setShowErrorModal(false)}>
          <ErrorCard onClick={e => e.stopPropagation()}>
            <ErrorIcon className="material-symbols-outlined">sentiment_very_dissatisfied</ErrorIcon>
            <ErrorTitle>검색 결과 없음</ErrorTitle>
            <ErrorMsg>
              입력하신 <strong>"{lastQuery}"</strong>에 대한 검색 결과를 찾을 수 없습니다.<br />
              다른 검색어를 입력하시거나, 올바른 메뉴 또는 제품명을 확인해 주세요.
            </ErrorMsg>
            <ErrorButton onClick={() => setShowErrorModal(false)}>확인</ErrorButton>
          </ErrorCard>
        </ErrorOverlay>
      )}
    </>
  );
};
