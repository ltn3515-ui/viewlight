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

  // 마우스 위치 추적
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
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

  // 뷰포트 밖 이탈 시 숨김
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    glow.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    glow.style.opacity = '1';
  });

  // 글로우 링: 부드러운 지연 추적 (RAF 루프)
  const LERP = 0.12;
  function lerp(a, b, t) { return a + (b - a) * t; }

  function animate() {
    glowX = lerp(glowX, mouseX, LERP);
    glowY = lerp(glowY, mouseY, LERP);
    glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();
