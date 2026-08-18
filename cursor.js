/**
 * ViewLight — Custom Cursor Interaction
 * 앰비언트 조명 테마: 발광 오브 도트 + 지연 트레일링 글로우 링
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

  // 인터랙티브 요소 호버 감지
  const INTERACTIVE = 'a, button, [onclick], input, select, textarea, .tab-item, .trend-tag, .report-rec-card, .thumb-card, .main-lamp-card, .noti-item, label, [role="button"]';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(INTERACTIVE)) {
      dot.classList.add('cursor-hover');
      glow.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(INTERACTIVE)) {
      dot.classList.remove('cursor-hover');
      glow.classList.remove('cursor-hover');
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
