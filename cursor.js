/**
 * ViewLight — Custom Cursor & Interactive Tooltip
 * 앰비언트 조명 테마: 발광 오브 도트 + 지연 트레일링 글로우 링 + 프리미엄 플로팅 툴팁
 */
(function () {
  'use strict';

  const dot  = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');

  if (!dot || !glow) return;

  // 터치 디바이스에서는 비활성화
  if ('ontouchstart' in window) {
    dot.style.display  = 'none';
    glow.style.display = 'none';
    return;
  }

  // 동적 플로팅 툴팁 요소 생성 및 추가
  const tooltip = document.createElement('div');
  tooltip.id = 'custom-tooltip';
  document.body.appendChild(tooltip);

  let mouseX = -200, mouseY = -200;
  let glowX  = -200, glowY  = -200;
  let isHidden = true;

  // 초기 상태 숨김
  dot.style.opacity  = '0';
  glow.style.opacity = '0';

  // 설정값 체크하여 초기 활성화 여부 반영
  const checkbox = document.getElementById('setting-glow-cursor');
  const isEnabled = checkbox ? checkbox.checked : false;

  if (isEnabled) {
    document.body.classList.add('custom-cursor-active');
    dot.style.display = 'block';
    glow.style.display = 'block';
  } else {
    document.body.classList.remove('custom-cursor-active');
    dot.style.display = 'none';
    glow.style.display = 'none';
  }

  // 커서 보이기/숨기기 헬퍼 함수
  function hideCursor() {
    dot.style.opacity  = '0';
    glow.style.opacity = '0';
    isHidden = true;
    tooltip.classList.remove('visible');
  }

  function showCursor() {
    dot.style.opacity  = '1';
    glow.style.opacity = '1';
    isHidden = false;
  }

  // 마우스 위치 추적 및 바운더리 체크
  document.addEventListener('mousemove', (e) => {
    const margin = 5; // 개발자 도구 진입 시 Stuck 현상 및 잔상 방지를 위한 경계 여백
    const nearEdge = e.clientX < margin ||
                     e.clientY < margin ||
                     e.clientX > window.innerWidth - margin ||
                     e.clientY > window.innerHeight - margin;

    if (nearEdge) {
      hideCursor();
    } else {
      if (isHidden) {
        // 숨김 상태에서 화면 내부로 돌아올 때 이전 잔상(Glide 효과) 방지를 위해 좌표 즉시 동기화
        mouseX = e.clientX;
        mouseY = e.clientY;
        glowX = e.clientX;
        glowY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
        glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        showCursor();
      } else {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
    }

    // 툴팁 위치 실시간 추적 (상단 잘림 방지: 상단 55px 이내면 아래로 위치 변경)
    if (tooltip && !isHidden && tooltip.classList.contains('visible')) {
      const isTopCutoff = mouseY < 55;
      if (isTopCutoff) {
        tooltip.classList.add('position-below');
        tooltip.style.left = mouseX + 'px';
        tooltip.style.top = (mouseY + 28) + 'px';
      } else {
        tooltip.classList.remove('position-below');
        tooltip.style.left = mouseX + 'px';
        tooltip.style.top = (mouseY - 22) + 'px';
      }
    }
  });

  // 클릭 펄스 효과
  document.addEventListener('mousedown', () => {
    dot.classList.add('cursor-click');
    glow.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('cursor-click');
    glow.classList.remove('cursor-click');
  });

  // 인터랙티브 요소 호버 감지 및 툴팁 바인딩
  const INTERACTIVE = 'a, button, [onclick], input, select, textarea, .tab-item, .trend-tag, .report-rec-card, .thumb-card, .main-lamp-card, .noti-item, label, [role="button"], .category-list-card, .sample-card, .cat-item';

  // 툴팁 노출을 위한 텍스트 추출 헬퍼 함수
  function getTooltipText(target) {
    if (target.hasAttribute('data-tooltip')) {
      return target.getAttribute('data-tooltip');
    }

    // 1. 썸네일 카드 요소
    if (target.classList.contains('thumb-card') || target.closest('.thumb-card')) {
      const card = target.closest('.thumb-card');
      const label = card.querySelector('.thumb-label');
      const img = card.querySelector('.thumb-img');
      if (img && img.getAttribute('alt')) {
        return img.getAttribute('alt');
      }
      if (label) return label.textContent.trim();
    }
    
    // 2. 메인 배너 카드
    if (target.closest('.main-lamp-card')) {
      const card = target.closest('.main-lamp-card');
      const name = card.querySelector('.lamp-name');
      if (name) return name.textContent.trim();
    }
    
    // 3. Featured 조명 상품 카드
    if (target.closest('.featured-product-card')) {
      const card = target.closest('.featured-product-card');
      const title = card.querySelector('.product-title');
      if (title) {
        // 금액 단위 텍스트 제외하고 오직 상품명만 툴팁화
        return title.textContent.replace(/[\d,]+원/g, '').trim();
      }
    }
    
    // 4. 컬렉션 리스트 상품 카드
    if (target.closest('.collection-product-card')) {
      const card = target.closest('.collection-product-card');
      const name = card.querySelector('.col-product-name');
      if (name) return name.textContent.trim();
    }

    // 5. 카테고리 2x2 그리드
    if (target.closest('.cat-item')) {
      const cat = target.closest('.cat-item');
      const label = cat.querySelector('.cat-title-text');
      if (label) return label.textContent.trim() + ' 카테고리';
    }

    // 6. 카테고리 리스트 카드
    if (target.closest('.category-list-card')) {
      const card = target.closest('.category-list-card');
      const onclickAttr = card.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes('openProductDetail')) {
        const key = onclickAttr.match(/'([^']+)'/)?.[1];
        if (key && window.productsData && window.productsData[key]) {
          return window.productsData[key].name;
        }
      }
    }

    // 7. Curation 리포트 추천 카드
    if (target.closest('.report-rec-card')) {
      const card = target.closest('.report-rec-card');
      const name = card.querySelector('.rec-name');
      if (name) return name.textContent.trim();
    }

    // 8. 룸 샘플 카드
    if (target.closest('.sample-card')) {
      const card = target.closest('.sample-card');
      const title = card.querySelector('.sample-title');
      if (title) return title.textContent.trim();
    }

    // 9. 헤더 전용 특수 아이콘 버튼 의미 매핑
    const iconSpan = target.querySelector('.material-symbols-outlined');
    if (iconSpan) {
      const iconName = iconSpan.textContent.trim();
      const iconMap = {
        'menu': '전체 메뉴',
        'close': '닫기',
        'notifications': '알림',
        'person': '로그인',
        'add': '자세히 보기',
        'favorite': '좋아요',
        'favorite_border': '좋아요 추가',
        'chevron_left': '뒤로 가기',
        'photo_camera': 'AI 공간 분석 카메라',
        'shopping_bag': '장바구니 담기',
        'zoom_in': '이미지 확대'
      };
      if (iconMap[iconName]) return iconMap[iconName];
    }

    // 10. 기타 일반 버튼 및 링크 텍스트
    const text = target.textContent.trim();
    if (text && text.length < 35) {
      // 폰트 아이콘 텍스트 제거 및 깔끔하게 줄바꿈 정리
      return text.replace(/\s+/g, ' ').replace('material-symbols-outlined', '').trim();
    }

    // 11. 이미지 alt
    const img = target.querySelector('img');
    if (img && img.getAttribute('alt')) {
      return img.getAttribute('alt');
    }

    return null;
  }

  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(INTERACTIVE);
    if (target) {
      dot.classList.add('cursor-hover');
      glow.classList.add('cursor-hover');

      // 툴팁 텍스트 노출
      const text = getTooltipText(target);
      if (text) {
        tooltip.textContent = text;
        const isTopCutoff = mouseY < 55;
        if (isTopCutoff) {
          tooltip.classList.add('position-below');
          tooltip.style.left = mouseX + 'px';
          tooltip.style.top = (mouseY + 28) + 'px';
        } else {
          tooltip.classList.remove('position-below');
          tooltip.style.left = mouseX + 'px';
          tooltip.style.top = (mouseY - 22) + 'px';
        }
        // 다음 프레임에서 애니메이션 동작하게 하여 부드럽게 출력
        requestAnimationFrame(() => {
          tooltip.classList.add('visible');
        });
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(INTERACTIVE);
    if (target) {
      dot.classList.remove('cursor-hover');
      glow.classList.remove('cursor-hover');
      tooltip.classList.remove('visible');
    }
  });

  // 뷰포트 이탈 시 숨김 처리
  document.addEventListener('mouseleave', () => {
    hideCursor();
  });
  document.addEventListener('mouseenter', (e) => {
    // 뷰포트 재진입 시 즉시 위치 최적화로 구석에서 날아오는 잔상 차단
    mouseX = e.clientX;
    mouseY = e.clientY;
    glowX = e.clientX;
    glowY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    showCursor();
  });

  // 브라우저 탭/창 포커스 아웃(예: DevTools 클릭 등) 시 커서 숨김
  window.addEventListener('blur', () => {
    hideCursor();
  });

  // 우클릭 컨텍스트 메뉴 활성화 시 커서 숨김 (우클릭 검사 시 Stuck 방지)
  document.addEventListener('contextmenu', () => {
    hideCursor();
  });

  // 드래그 앤 드롭 파일 끌어올 시 커서 숨김 (시스템 드래그 링과 겹침 및 Stuck 방지)
  document.addEventListener('dragenter', () => {
    hideCursor();
  });
  document.addEventListener('dragover', () => {
    hideCursor();
  });

  // 글로우 링: 부드러운 지연 추적 (RAF 루프)
  const LERP = 0.12;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    if (!isHidden) {
      glowX = lerp(glowX, mouseX, LERP);
      glowY = lerp(glowY, mouseY, LERP);
      glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    }
    requestAnimationFrame(animate);
  }
  animate();
})();
