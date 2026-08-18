document.addEventListener('DOMContentLoaded', () => {

  // 다크 모드 초기 활성화 및 상태 복원 (기본값: OFF)
  const darkModeSetting = localStorage.getItem('viewlight_dark_mode');
  const darkModeInput = document.querySelector('input[onchange*="다크 모드"]');
  if (darkModeSetting === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeInput) darkModeInput.checked = true;
  } else {
    document.body.classList.remove('dark-mode');
    if (darkModeInput) darkModeInput.checked = false;
  }

  // 장바구니 localStorage 저장/복원 헬퍼
  function saveCartToStorage() {
    const items = [];
    document.querySelectorAll('.cart-item-card').forEach(card => {
      const id = card.id;
      const price = parseInt(card.getAttribute('data-price')) || 0;
      const img = card.querySelector('.cart-item-thumb img')?.src || '';
      const name = card.querySelector('.cart-item-name')?.textContent || '';
      const qty = parseInt(card.querySelector('.qty-val')?.textContent) || 1;
      items.push({ id, price, img, name, qty });
    });
    localStorage.setItem('viewlight_cart', JSON.stringify(items));
  }

  function restoreCartFromStorage() {
    const stored = localStorage.getItem('viewlight_cart');
    let items = [];
    if (stored) {
      try { items = JSON.parse(stored) || []; } catch(e) { items = []; }
    }

    const container = document.getElementById('cart-items-container');
    if (container) {
      container.querySelectorAll('.cart-item-card').forEach(card => card.remove());

      items.forEach(item => {
        const cardHtml = `
          <div class="cart-item-card" data-price="${item.price}" id="${item.id}">
            <button type="button" class="cart-item-remove" onclick="removeCartItem('${item.id}')">
              <span class="material-symbols-outlined">close</span>
            </button>
            <div class="cart-item-thumb">
              <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
              <h4 class="cart-item-name">${item.name}</h4>
              <p class="cart-item-price-label">${item.price.toLocaleString()}원</p>
              <div class="quantity-controller">
                <button type="button" class="qty-btn qty-minus" onclick="changeQty('${item.id}', -1)">-</button>
                <span class="qty-val" id="qty-val-${item.id}">${item.qty}</span>
                <button type="button" class="qty-btn qty-plus" onclick="changeQty('${item.id}', 1)">+</button>
              </div>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHtml);
      });
    }

    if (window.updateCartTotals) window.updateCartTotals();
    if (window.updateCartBadge) window.updateCartBadge();
  }

  // saveCartToStorage를 window에 노출
  window.saveCartToStorage = saveCartToStorage;
  // restoreCartFromStorage는 아래 window.updateCartBadge 정의 후 말미에서 호출됨

  // 1. 하단 탭바 활성화 제어
  const tabItems = document.querySelectorAll('.tab-item');
  tabItems.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabItems.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
    });
  });

  // 2. 좋아요(하트) 버튼 토글
  const likeBtn = document.getElementById('btn-like');
  if (likeBtn) {
    likeBtn.addEventListener('click', () => {
      likeBtn.classList.toggle('active');
      const icon = likeBtn.querySelector('.material-symbols-outlined');
      if (likeBtn.classList.contains('active')) {
        icon.style.color = '#FF5252';
      } else {
        icon.style.color = 'var(--color-text-sub)';
      }
    });
  }

  // 3. AI 스캔 시작 및 뷰 전환 제어 통합
  const viewHome = document.getElementById('view-home');
  const viewStory = document.getElementById('view-story');
  const viewScan = document.getElementById('view-scan');
  const viewCart = document.getElementById('view-cart');
  const viewMypage = document.getElementById('view-mypage');
  const viewFeaturedMore = document.getElementById('view-featured-more');
  const viewCategoryAll = document.getElementById('view-category-all');
  const viewBnaAll = document.getElementById('view-bna-all');
  const viewProductDetail = document.getElementById('view-product-detail');
  const viewCheckout = document.getElementById('view-checkout');
  const viewCurationReport = document.getElementById('view-curation-report');
  
  // 마이페이지 서브 뷰
  const viewOrders = document.getElementById('view-orders');
  const viewReviews = document.getElementById('view-reviews');
  const viewShipping = document.getElementById('view-shipping');
  const viewCustomerCenter = document.getElementById('view-customer-center');
  const viewSettings = document.getElementById('view-settings');

  const viewHistoryStack = ['home'];
  let isNavigatingBack = false;

  window.goBack = function() {
    if (viewHistoryStack.length > 1) {
      isNavigatingBack = true;
      viewHistoryStack.pop();
      const prevView = viewHistoryStack[viewHistoryStack.length - 1];
      window.directCheckoutItem = null;
      showView(prevView);
      isNavigatingBack = false;
    } else {
      showView('home');
    }
  };

  let previousActiveView = 'home';
  let currentActiveView = 'home';

  function showView(viewId) {
    // 로그인 체크 인터셉터 (공지사항, 이벤트, 비포 에프터 및 홈을 제외한 모든 메뉴/뷰 차단)
    const publicViews = ['home', 'bna-all', 'featured-more'];
    if (!publicViews.includes(viewId)) {
      const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
      if (!isLoggedIn) {
        if (window.showToast) window.showToast('로그인 후 사용해 주세요.', 'error');
        if (window.openLoginModal) window.openLoginModal();
        return;
      }
    }

    if (!isNavigatingBack) {
      if (viewId === 'home') {
        viewHistoryStack.length = 0;
        viewHistoryStack.push('home');
      } else {
        if (viewHistoryStack[viewHistoryStack.length - 1] !== viewId) {
          viewHistoryStack.push(viewId);
        }
      }
    }

    currentActiveView = viewId;
    previousActiveView = viewHistoryStack.length > 1 ? viewHistoryStack[viewHistoryStack.length - 2] : 'home';

    // Hide all views
    if (viewHome) viewHome.classList.remove('active');
    if (viewStory) viewStory.classList.remove('active');
    if (viewScan) viewScan.classList.remove('active');
    if (viewCart) viewCart.classList.remove('active');
    if (viewMypage) viewMypage.classList.remove('active');
    if (viewFeaturedMore) viewFeaturedMore.classList.remove('active');
    if (viewCategoryAll) viewCategoryAll.classList.remove('active');
    if (viewBnaAll) viewBnaAll.classList.remove('active');
    if (viewProductDetail) viewProductDetail.classList.remove('active');
    if (viewCheckout) viewCheckout.classList.remove('active');
    if (viewCurationReport) viewCurationReport.classList.remove('active');
    if (viewOrders) viewOrders.classList.remove('active');
    if (viewReviews) viewReviews.classList.remove('active');
    if (viewShipping) viewShipping.classList.remove('active');
    if (viewCustomerCenter) viewCustomerCenter.classList.remove('active');
    if (viewSettings) viewSettings.classList.remove('active');
    
    // Show selected view
    if (viewId === 'home') {
      if (viewHome) viewHome.classList.add('active');
    } else if (viewId === 'story') {
      if (viewStory) viewStory.classList.add('active');
      const storyScrollContent = document.querySelector('.story-content');
      if (storyScrollContent) storyScrollContent.scrollTop = 0;
    } else if (viewId === 'scan') {
      if (viewScan) viewScan.classList.add('active');
      const scanScrollContent = document.querySelector('.scan-content');
      if (scanScrollContent) scanScrollContent.scrollTop = 0;
    } else if (viewId === 'cart') {
      if (viewCart) viewCart.classList.add('active');
      const cartScrollContent = document.querySelector('.cart-content');
      if (cartScrollContent) cartScrollContent.scrollTop = 0;
      if (window.updateCartTotals) window.updateCartTotals();
    } else if (viewId === 'mypage') {
      if (viewMypage) viewMypage.classList.add('active');
      const mypageScrollContent = document.querySelector('.mypage-content');
      if (mypageScrollContent) mypageScrollContent.scrollTop = 0;
    } else if (viewId === 'featured-more') {
      if (viewFeaturedMore) viewFeaturedMore.classList.add('active');
      const featScrollContent = document.querySelector('.featured-more-content');
      if (featScrollContent) featScrollContent.scrollTop = 0;
    } else if (viewId === 'category-all') {
      if (viewCategoryAll) viewCategoryAll.classList.add('active');
      const catAllScrollContent = document.querySelector('.category-all-content');
      if (catAllScrollContent) catAllScrollContent.scrollTop = 0;
    } else if (viewId === 'bna-all') {
      if (viewBnaAll) viewBnaAll.classList.add('active');
      const bnaAllScrollContent = document.querySelector('.bna-all-content');
      if (bnaAllScrollContent) bnaAllScrollContent.scrollTop = 0;
      if (window.initBnaSlider) window.initBnaSlider();
    } else if (viewId === 'product-detail') {
      if (viewProductDetail) viewProductDetail.classList.add('active');
      const pdScrollContent = document.querySelector('.pd-content');
      if (pdScrollContent) pdScrollContent.scrollTop = 0;
    } else if (viewId === 'checkout') {
      if (viewCheckout) viewCheckout.classList.add('active');
      const checkoutScrollContent = document.querySelector('.checkout-content');
      if (checkoutScrollContent) checkoutScrollContent.scrollTop = 0;
      if (window.initCheckoutView) window.initCheckoutView();
    } else if (viewId === 'curation-report') {
      if (viewCurationReport) viewCurationReport.classList.add('active');
      const reportScrollContent = document.querySelector('.report-content');
      if (reportScrollContent) reportScrollContent.scrollTop = 0;
    } else if (viewId === 'orders') {
      if (viewOrders) viewOrders.classList.add('active');
      const ordersScrollContent = document.querySelector('.orders-content');
      if (ordersScrollContent) ordersScrollContent.scrollTop = 0;
    } else if (viewId === 'reviews') {
      if (viewReviews) viewReviews.classList.add('active');
      const reviewsScrollContent = document.querySelector('.reviews-content');
      if (reviewsScrollContent) reviewsScrollContent.scrollTop = 0;
    } else if (viewId === 'shipping') {
      if (viewShipping) viewShipping.classList.add('active');
      const shippingScrollContent = document.querySelector('.shipping-content');
      if (shippingScrollContent) shippingScrollContent.scrollTop = 0;
    } else if (viewId === 'customer-center') {
      if (viewCustomerCenter) viewCustomerCenter.classList.add('active');
      const csScrollContent = document.querySelector('.cs-content');
      if (csScrollContent) csScrollContent.scrollTop = 0;
    } else if (viewId === 'settings') {
      if (viewSettings) viewSettings.classList.add('active');
      const settingsScrollContent = document.querySelector('.settings-content');
      if (settingsScrollContent) settingsScrollContent.scrollTop = 0;
    }
    
    // Update bottom tab items active state
    tabItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if ((viewId === 'home' || viewId === 'featured-more' || viewId === 'category-all' || viewId === 'bna-all' || viewId === 'product-detail' || viewId === 'checkout' || viewId === 'curation-report') && href === '#home') item.classList.add('active');
      if (viewId === 'scan' && href === '#ai') item.classList.add('active');
      if (viewId === 'cart' && href === '#cart') item.classList.add('active');
      if ((viewId === 'mypage' || viewId === 'orders' || viewId === 'reviews' || viewId === 'shipping' || viewId === 'customer-center' || viewId === 'settings') && href === '#mypage') item.classList.add('active');
    });
  }

  window.showView = showView;

  // AI 스캔 시작 버튼 이벤트 바인딩
  const btnDesktopScan = document.getElementById('btn-desktop-scan');
  if (btnDesktopScan) {
    btnDesktopScan.addEventListener('click', (e) => {
      e.preventDefault();
      showView('scan');
    });
  }

  const btnMobileScan = document.getElementById('btn-mobile-scan');
  if (btnMobileScan) {
    btnMobileScan.addEventListener('click', (e) => {
      e.preventDefault();
      openGuideModal();
    });
  }

  // 4. 장바구니 담기 버튼 인터랙션 (기본 Featured 상품)
  const cartBtn = document.getElementById('btn-cart');
  if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('🛒 [Luna Table Lamp]가 장바구니에 담겼습니다.');
    });
  }

  // 5. 카테고리 클릭 이벤트
  const catItems = document.querySelectorAll('.cat-item');
  catItems.forEach(item => {
    item.addEventListener('click', () => {
      const categoryName = item.querySelector('.cat-label').textContent;
      alert(`[${categoryName}] 제품 상세페이지로 넘어갑니다.`);
    });
  });

  // 6. 모바일 메뉴 드로어 제어
  const hamburgerBtn = document.getElementById('btn-hamburger');
  const closeMenuBtn = document.getElementById('btn-close-menu');
  const menuDrawer = document.getElementById('menu-drawer');
  
  if (hamburgerBtn && menuDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      menuDrawer.classList.add('open');
    });
  }

  if (closeMenuBtn && menuDrawer) {
    closeMenuBtn.addEventListener('click', () => {
      menuDrawer.classList.remove('open');
    });
  }

  // 드로어 메뉴 아이템 클릭 시 전환
  const storyMenuLink = document.querySelector('a[href="#story"]');
  if (storyMenuLink && menuDrawer) {
    storyMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      menuDrawer.classList.remove('open');
      showView('story');
    });
  }

  const scanMenuLink = document.querySelector('.menu-drawer-nav a[href="#scan"]');
  if (scanMenuLink && menuDrawer) {
    scanMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      menuDrawer.classList.remove('open');
      showView('scan');
    });
  }

  // 무드등 둘러보기 메뉴 및 버튼 이벤트 연동
  const collectionMenuLink = document.querySelector('.menu-drawer-nav a[href="#collection"]');
  if (collectionMenuLink && menuDrawer) {
    collectionMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      menuDrawer.classList.remove('open');
      showView('category-all');
    });
  }

  const reportMenuLink = document.querySelector('.menu-drawer-nav a[href="#report"]');
  if (reportMenuLink && menuDrawer) {
    reportMenuLink.addEventListener('click', (e) => {
      e.preventDefault();
      menuDrawer.classList.remove('open');
      showView('curation-report');
    });
  }

  // 7. 뒤로가기 및 탭바 이동 처리
  const backToHomeBtn = document.getElementById('btn-back-to-home');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const scanBackBtn = document.getElementById('btn-scan-back');
  if (scanBackBtn) {
    scanBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const scanHomeGoBtn = document.getElementById('btn-scan-home-go');
  if (scanHomeGoBtn) {
    scanHomeGoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  // 탭바 클릭 핸들러 (홈, AI 큐레이션 통합)
  const homeTab = document.querySelector('a[href="#home"]');
  if (homeTab) {
    homeTab.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
    });
  }

  const aiTab = document.querySelector('a[href="#ai"]');
  if (aiTab) {
    aiTab.addEventListener('click', (e) => {
      e.preventDefault();
      showView('scan');
    });
  }

  const cartTab = document.querySelector('a[href="#cart"]');
  if (cartTab) {
    cartTab.addEventListener('click', (e) => {
      e.preventDefault();
      showView('cart');
    });
  }

  const mypageTab = document.querySelector('a[href="#mypage"]');
  if (mypageTab) {
    mypageTab.addEventListener('click', (e) => {
      e.preventDefault();
      showView('mypage');
    });
  }

  const searchTab = document.querySelector('a[href="#search"]');
  const searchModal = document.getElementById('search-modal');
  if (searchTab && searchModal) {
    searchTab.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('active');
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.value = '';
        setTimeout(() => searchInput.focus(), 150);
      }
      if (window.renderRecentSearches) window.renderRecentSearches();
    });
  }

  const cartBackBtn = document.getElementById('btn-cart-back');
  if (cartBackBtn) {
    cartBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const mypageBackBtn = document.getElementById('btn-mypage-back');
  if (mypageBackBtn) {
    mypageBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const featuredMoreBtn = document.getElementById('btn-featured-more');
  if (featuredMoreBtn) {
    featuredMoreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('featured-more');
    });
  }

  const featuredMoreBackBtn = document.getElementById('btn-featured-more-back');
  if (featuredMoreBackBtn) {
    featuredMoreBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const categoriesAllBtn = document.getElementById('btn-categories-all');
  if (categoriesAllBtn) {
    categoriesAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('category-all');
    });
  }

  const categoriesAllBackBtn = document.getElementById('btn-categories-all-back');
  if (categoriesAllBackBtn) {
    categoriesAllBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const bnaAllBtn = document.getElementById('btn-bna-all');
  if (bnaAllBtn) {
    bnaAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('bna-all');
    });
  }

  const bnaAllBackBtn = document.getElementById('btn-bna-all-back');
  if (bnaAllBackBtn) {
    bnaAllBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  const bnaFloatScanBtn = document.getElementById('btn-bna-float-scan');
  if (bnaFloatScanBtn) {
    bnaFloatScanBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openGuideModal) {
        window.openGuideModal();
      } else {
        showView('scan');
      }
    });
  }


  // ==========================================
  // 8. AI 공간 스캔 내부 인터랙션 및 상태 관리
  // ==========================================
  let selectedImageSrc = "";
  let selectedRoomType = "";
  let selectedRoomName = "";

  const sampleCards = document.querySelectorAll('.sample-card');
  const startAnalysisBtn = document.getElementById('btn-start-analysis');

  // 파일 업로드 관련 요소
  const uploadZone = document.getElementById('upload-zone');
  const scanFileInput = document.getElementById('scan-file-input');
  const uploadPreviewBox = document.getElementById('upload-preview-box');
  const uploadPreviewImg = document.getElementById('upload-preview-img');
  const uploadInnerContent = document.getElementById('upload-inner-content');
  const btnRemovePreview = document.getElementById('btn-remove-preview');

  // 8.1. 샘플 룸 선택 카드 이벤트 바인딩
  sampleCards.forEach(card => {
    card.addEventListener('click', () => {
      // 업로드 영역 리셋
      clearFileInput();
      
      // 선택 클래스 토글
      sampleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      // 선택 정보 저장
      selectedImageSrc = card.getAttribute('data-img');
      selectedRoomType = card.getAttribute('data-room-type');
      selectedRoomName = card.getAttribute('data-room-name');
      
      enableStartButton(true);
    });
  });

  // 8.2. 드롭존 파일 선택 창 유도
  if (uploadZone) {
    uploadZone.addEventListener('click', (e) => {
      if (e.target.closest('#btn-remove-preview')) return;
      scanFileInput.click();
    });

    // 드래그 앤 드롭 시각 피드백
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
      }, false);
    });

    uploadZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files.length > 0) {
        handleFile(files[0]);
      }
    });
  }

  if (scanFileInput) {
    scanFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // 업로드 파일 읽기 및 처리
  function handleFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      // 샘플 선택 영역 취소
      sampleCards.forEach(c => c.classList.remove('selected'));
      
      selectedImageSrc = e.target.result;
      selectedRoomType = "custom";
      selectedRoomName = "업로드한 내 방";
      
      uploadPreviewImg.src = selectedImageSrc;
      uploadInnerContent.style.display = 'none';
      uploadPreviewBox.style.display = 'block';
      
      enableStartButton(true);
    };
    reader.readAsDataURL(file);
  }

  // 미리보기 이미지 삭제
  if (btnRemovePreview) {
    btnRemovePreview.addEventListener('click', (e) => {
      e.stopPropagation();
      clearFileInput();
    });
  }

  // 파일 입력 리셋
  function clearFileInput() {
    if (scanFileInput) scanFileInput.value = "";
    selectedImageSrc = "";
    selectedRoomType = "";
    selectedRoomName = "";
    if (uploadPreviewImg) uploadPreviewImg.src = "";
    if (uploadPreviewBox) uploadPreviewBox.style.display = 'none';
    if (uploadInnerContent) uploadInnerContent.style.display = 'flex';
    enableStartButton(false);
  }

  // 시작 버튼 활성화 토글
  function enableStartButton(enable) {
    if (!startAnalysisBtn) return;
    if (enable) {
      startAnalysisBtn.classList.remove('disabled');
      startAnalysisBtn.removeAttribute('disabled');
    } else {
      startAnalysisBtn.classList.add('disabled');
      startAnalysisBtn.setAttribute('disabled', 'true');
    }
  }

  // 8.3. 3초 AI 공간분석 작동 핸들러
  if (startAnalysisBtn) {
    startAnalysisBtn.addEventListener('click', () => {
      // 업로드 화면 숨기기 -> 로딩 화면 보이기
      document.getElementById('scan-step-upload').classList.remove('active');
      document.getElementById('scan-step-loading').classList.add('active');
      
      // 스캔 배경에 선택한 이미지 주입
      document.getElementById('scanning-bg-img').src = selectedImageSrc;
      
      const countdownNum = document.getElementById('countdown-num');
      const loadingStatusText = document.getElementById('loading-status-text');
      const progressRingCircle = document.querySelector('.progress-ring__circle');
      
      let seconds = 3;
      countdownNum.textContent = seconds;
      loadingStatusText.textContent = "공간 구조 및 벽면 분석 중...";
      
      // Progress Ring 초기화 (stroke-dasharray=326.72)
      const perimeter = 326.72;
      progressRingCircle.style.strokeDashoffset = perimeter;
      
      // 3초 카운트다운 타이머 구동
      let progressInterval = setInterval(() => {
        seconds--;
        countdownNum.textContent = seconds;
        
        if (seconds === 2) {
          loadingStatusText.textContent = "가구 배치 및 조도 비율 분석 중...";
          progressRingCircle.style.strokeDashoffset = perimeter * (2/3);
        } else if (seconds === 1) {
          loadingStatusText.textContent = "최적의 앰비언트 라이팅 큐레이션 매칭 중...";
          progressRingCircle.style.strokeDashoffset = perimeter * (1/3);
        } else if (seconds <= 0) {
          clearInterval(progressInterval);
          progressRingCircle.style.strokeDashoffset = 0;
          
          // 결과 노출
          setTimeout(() => {
            renderAnalysisResults();
          }, 300);
        }
      }, 1000);
    });
  }

  // 8.4. 분석 결과 큐레이션 렌더링
  function renderAnalysisResults() {
    document.getElementById('scan-step-loading').classList.remove('active');
    document.getElementById('scan-step-result').classList.add('active');
    
    // 결과 방 스냅샷 설정
    document.getElementById('result-room-img').src = selectedImageSrc;
    
    // 기본 추천 세팅 (거실)
    let percent = "98%";
    let type = "거실 (Living Room)";
    let lux = "아늑한 밤 조도 (15 Lux)";
    let tone = "따뜻한 내추럴 우드 & 베이지";
    let recTitle = "아우라 플로어 램프";
    let recPrice = "180,000원";
    let recDesc = "내추럴한 거실 분위기에 은은하게 매칭되는 앰비언트 램프로, 5단계 조도 조절 기능이 어두운 야간 무드에 최적의 빛을 선사합니다.";
    let recImg = "img/Stand03.png";
    let paletteColors = ['#8C6A5C', '#D3C5B5', '#EDE6DE', '#121826'];
    
    if (selectedRoomType === 'modern') {
      percent = "95%";
      type = "도시형 거실 (Modern Living)";
      lux = "은은한 야간 조도 (35 Lux)";
      tone = "모던 쿨그레이 & 시크 네이비";
      recTitle = "스마트 App 연동 앰비언트 바";
      recPrice = "95,000원";
      recDesc = "창가 시티뷰와 조화를 이루는 스마트 조명으로, 모바일 앱 연동을 통한 무한한 컬러 제어와 예약 타이머가 인텔리전트한 현대적 무드를 제안합니다.";
      recImg = "img/Stand04.png";
      paletteColors = ['#3A4151', '#A1A8B8', '#121826', '#F89F35'];
    } else if (selectedRoomType === 'bedroom') {
      percent = "99%";
      type = "침실 (Cozy Bedroom)";
      lux = "매우 안락함 (5 Lux)";
      tone = "포근한 무드 웜 화이트";
      recTitle = "Luna Table Lamp";
      recPrice = "150,000원";
      recDesc = "수면에 가장 안락한 조도를 지원하는 원목 크래프트 탁상 무드등입니다. 2700K 색온도가 당신의 몸과 마음을 편안한 휴식 상태로 안내합니다.";
      recImg = "img/Stand02.png";
      paletteColors = ['#CBBBA9', '#5D5043', '#FFFDF7', '#F6AB40'];
    } else if (selectedRoomType === 'custom') {
      percent = "97%";
      type = "맞춤형 개인 공간 (Custom Space)";
      lux = "안정적인 조도 (20 Lux)";
      tone = "조화로운 크림 & 내추럴 브라운";
      recTitle = "Luna Designer Stand";
      recPrice = "165,000원";
      recDesc = "독창적인 스플라인 우드 곡선이 돋보이는 오가닉 디자인 무드등입니다. 업로드한 공간에 아트적인 입체감을 더해줍니다.";
      recImg = "img/Stand05.jpg";
      paletteColors = ['#D8CCA3', '#8A7E68', '#4B463C', '#FFF8E7'];
    }
    
    // 데이터 바인딩
    document.getElementById('result-match-percent').textContent = percent;
    document.getElementById('result-room-type').textContent = type;
    document.getElementById('result-lux-level').textContent = lux;
    document.getElementById('result-tone').textContent = tone;
    document.getElementById('rec-product-title').textContent = recTitle;
    document.getElementById('rec-product-price').textContent = recPrice;
    document.getElementById('rec-product-desc').textContent = recDesc;
    document.getElementById('rec-product-img-tag').src = recImg;
    
    // 컬러 팔레트 칩 색상 바인딩
    const dots = document.querySelectorAll('.color-dot');
    if (dots.length === paletteColors.length) {
      dots.forEach((dot, index) => {
        dot.style.backgroundColor = paletteColors[index];
      });
    }
  }

  // 다시 분석하기 버튼 이벤트 바인딩
  const reAnalyzeBtn = document.getElementById('btn-re-analyze');
  if (reAnalyzeBtn) {
    reAnalyzeBtn.addEventListener('click', () => {
      document.getElementById('scan-step-result').classList.remove('active');
      document.getElementById('scan-step-upload').classList.add('active');
      clearFileInput();
    });
  }

  // 추천 상품 장바구니 추가
  const resultAddCartBtn = document.getElementById('btn-result-add-cart');
  if (resultAddCartBtn) {
    resultAddCartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('rec-product-title').textContent;
      let price = 180000;
      let img = "img/Stand03.png";
      if (selectedRoomType === 'living') {
        price = 180000;
        img = "img/Stand03.png";
      } else if (selectedRoomType === 'bed') {
        price = 150000;
        img = "img/Stand02.png";
      } else if (selectedRoomType === 'custom') {
        price = 165000;
        img = "img/Stand05.jpg";
      }
      window.addProductToCart(name, price, img);
    });
  }

  // 추천 상품 즉시 구매
  const resultBuyBtn = document.getElementById('btn-result-buy');
  if (resultBuyBtn) {
    resultBuyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const name = document.getElementById('rec-product-title').textContent;
      alert(`💳 [${name}] 결제 페이지로 이동합니다.`);
    });
  }

  // ==========================================
  // 9. 가이드 모달 & 카메라 스캔 시뮬레이션 제어
  // ==========================================
  const guideModal = document.getElementById('scan-guide-modal');
  const cameraModal = document.getElementById('camera-scan-modal');
  
  const btnGuideCloseTop = document.getElementById('btn-guide-close-top');
  const btnGuideStart = document.getElementById('btn-guide-start');
  const btnGuideCancel = document.getElementById('btn-guide-cancel');
  const btnGuideSkip = document.getElementById('btn-guide-skip');
  const btnCameraClose = document.getElementById('btn-camera-close');
  const btnCameraRetake = document.getElementById('btn-camera-retake');
  const btnCameraViewResult = document.getElementById('btn-camera-view-result');
  const arTargetBox = document.getElementById('ar-target-box');
  const arLampPin = document.getElementById('ar-lamp-pin');
  const levelIndicator = document.querySelector('.horizontal-level-indicator');
  const levelBadgeText = document.getElementById('level-badge-text');
  const cameraProgressPct = document.getElementById('camera-progress-pct');
  const cameraProgressFill = document.getElementById('camera-progress-fill');
  
  let scanSimulationTimeout = null;
  let scanSimulationInterval = null;

  function openGuideModal() {
    if (guideModal) guideModal.classList.add('active');
  }

  function closeGuideModal() {
    if (guideModal) guideModal.classList.remove('active');
  }

  function openCameraModal() {
    closeGuideModal();
    if (cameraModal) cameraModal.classList.add('active');
    startCameraScanSimulation();
  }

  function closeCameraModal() {
    if (cameraModal) cameraModal.classList.remove('active');
    stopCameraScanSimulation();
  }

  if (btnGuideCloseTop) {
    btnGuideCloseTop.addEventListener('click', closeGuideModal);
  }
  if (btnGuideCancel) {
    btnGuideCancel.addEventListener('click', closeGuideModal);
  }
  if (btnGuideStart) {
    btnGuideStart.addEventListener('click', openCameraModal);
  }
  if (btnGuideSkip) {
    btnGuideSkip.addEventListener('click', openCameraModal);
  }
  if (btnCameraClose) {
    btnCameraClose.addEventListener('click', closeCameraModal);
  }

  // 스캔 시뮬레이션 작동 논리
  function startCameraScanSimulation() {
    stopCameraScanSimulation(); // 혹시 실행 중이면 정지

    // 1. UI 상태 리셋
    if (levelIndicator) levelIndicator.classList.remove('aligned');
    if (levelBadgeText) levelBadgeText.textContent = "수평 맞추는 중";
    if (arTargetBox) arTargetBox.classList.remove('active');
    if (arLampPin) arLampPin.classList.remove('visible');
    
    if (cameraProgressPct) cameraProgressPct.textContent = "0%";
    if (cameraProgressFill) cameraProgressFill.style.width = "0%";
    
    // 로그 리셋
    const logItems = [
      document.getElementById('log-item-1'),
      document.getElementById('log-item-2'),
      document.getElementById('log-item-3')
    ];
    logItems.forEach((item, index) => {
      if (item) {
        item.className = "log-item";
        const icon = item.querySelector('.log-status-icon');
        if (icon) icon.textContent = "circle";
      }
    });

    if (btnCameraViewResult) {
      btnCameraViewResult.classList.add('disabled');
      btnCameraViewResult.classList.remove('active-glow');
      btnCameraViewResult.setAttribute('disabled', 'true');
    }

    const arHintText = document.querySelector('.ar-hint-text');
    if (arHintText) arHintText.textContent = "카메라 수평이 맞춰지면 자동으로 스캔이 시작됩니다.";

    // 2. 수평 맞춤 단계 (1.2초 대기)
    scanSimulationTimeout = setTimeout(() => {
      if (levelIndicator) levelIndicator.classList.add('aligned');
      if (levelBadgeText) levelBadgeText.textContent = "수평 맞춤 완료";
      if (arTargetBox) arTargetBox.classList.add('active');
      if (arHintText) arHintText.textContent = "공간이 감지되어 스캔을 시작합니다.";
      
      // 3. 프로그레스 시작
      let progress = 0;
      scanSimulationInterval = setInterval(() => {
        progress += 2;
        if (progress > 100) progress = 100;
        
        if (cameraProgressPct) cameraProgressPct.textContent = `${progress}%`;
        if (cameraProgressFill) cameraProgressFill.style.width = `${progress}%`;

        // 진행도에 따른 로그 갱신
        // 0% - 35%: 1단계 감지 중
        if (progress > 0 && progress <= 35) {
          if (logItems[0]) logItems[0].className = "log-item active";
        }
        // 35% 초과: 1단계 완료, 2단계 감지 중
        if (progress > 35 && progress <= 70) {
          if (logItems[0]) {
            logItems[0].className = "log-item completed";
            const icon = logItems[0].querySelector('.log-status-icon');
            if (icon) icon.textContent = "check_circle";
          }
          if (logItems[1]) logItems[1].className = "log-item active";
        }
        // 70% 초과: 2단계 완료, 3단계 감지 중 + 추천 전구 앵커 등장
        if (progress > 70 && progress < 100) {
          if (logItems[1]) {
            logItems[1].className = "log-item completed";
            const icon = logItems[1].querySelector('.log-status-icon');
            if (icon) icon.textContent = "check_circle";
          }
          if (logItems[2]) logItems[2].className = "log-item active";
          if (arLampPin) arLampPin.classList.add('visible');
        }
        // 100% 도달: 3단계 완료, 완료 처리
        if (progress >= 100) {
          clearInterval(scanSimulationInterval);
          
          if (logItems[2]) {
            logItems[2].className = "log-item completed";
            const icon = logItems[2].querySelector('.log-status-icon');
            if (icon) icon.textContent = "check_circle";
          }
          
          if (levelBadgeText) levelBadgeText.textContent = "스캔 완료";
          if (arHintText) arHintText.textContent = "공간 분석이 완료되었습니다. 결과를 확인하세요!";
          
          if (btnCameraViewResult) {
            btnCameraViewResult.classList.remove('disabled');
            btnCameraViewResult.removeAttribute('disabled');
            btnCameraViewResult.classList.add('active-glow');
          }
        }
      }, 60); // 약 3초 동안 0에서 100까지 도달 (2% * 50번 * 60ms = 3000ms)
    }, 1200);
  }

  function stopCameraScanSimulation() {
    if (scanSimulationTimeout) clearTimeout(scanSimulationTimeout);
    if (scanSimulationInterval) clearInterval(scanSimulationInterval);
  }

  // 다시 촬영 이벤트 바인딩
  if (btnCameraRetake) {
    btnCameraRetake.addEventListener('click', () => {
      startCameraScanSimulation();
    });
  }

  // AI 분석 결과 보기 클릭 바인딩
  if (btnCameraViewResult) {
    btnCameraViewResult.addEventListener('click', () => {
      // 카메라 모달 닫기
      closeCameraModal();
      
      // 결과 화면 연동
      showView('scan');
      
      // 결과는 'livingroom.jpg' (샘플룸 중 내추럴 우드 거실) 분석으로 강제 매칭
      selectedRoomType = "living";
      selectedImageSrc = "img/livingroom.jpg";
      
      // 업로드 화면을 비활성화하고 결과 단계로 즉시 넘김
      document.getElementById('scan-step-upload').classList.remove('active');
      document.getElementById('scan-step-loading').classList.remove('active');
      
      renderAnalysisResults();
    });
  }

  // ==========================================
  // 10. 장바구니 & 마이페이지 인터랙션 핸들러
  // ==========================================

  // 10.1. 장바구니 가격 합산 업데이트
  window.updateCartTotals = function() {
    const itemCards = document.querySelectorAll('.cart-item-card');
    let subtotal = 0;
    
    // 장바구니 비어있음 텍스트 토글
    const emptyMsg = document.getElementById('cart-empty-message');
    if (emptyMsg) {
      emptyMsg.style.display = itemCards.length > 0 ? 'none' : 'block';
    }
    
    itemCards.forEach(card => {
      const price = parseInt(card.getAttribute('data-price')) || 0;
      const qtyValEl = card.querySelector('.qty-val');
      const qtyVal = qtyValEl ? (parseInt(qtyValEl.textContent) || 0) : 0;
      subtotal += price * qtyVal;
    });
    
    // AI 추천 조합 세트 혜택 (아이템 개수가 3개 이상이면 20% 세트 할인)
    let discount = 1.0;
    if (itemCards.length >= 3) {
      discount = 0.8;
    }
    
    const totalPrice = Math.round(subtotal * discount);
    
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total-price');
    
    if (subtotalEl) {
      subtotalEl.textContent = `${subtotal.toLocaleString()}원`;
    }
    
    if (totalEl) {
      if (discount < 1.0) {
        totalEl.innerHTML = `${totalPrice.toLocaleString()}원 <span style="font-size: 0.65rem; color: #E68A00; font-weight: 700; display: block; margin-top: 2px;">(20% 세트 할인 혜택 적용됨)</span>`;
      } else {
        totalEl.textContent = `${totalPrice.toLocaleString()}원`;
      }
    }

    // 장바구니 상태 localStorage에 자동 저장
    if (window.saveCartToStorage) window.saveCartToStorage();
  };

  // 10.2. 장바구니 수량 증감 버튼
  window.changeQty = function(itemId, amount) {
    const itemCard = document.getElementById(itemId);
    if (!itemCard) return;
    const qtyValEl = itemCard.querySelector('.qty-val');
    if (!qtyValEl) return;
    
    let qty = parseInt(qtyValEl.textContent) + amount;
    if (qty < 1) qty = 1;
    qtyValEl.textContent = qty;
    
    window.updateCartTotals();
    if (window.updateCartBadge) window.updateCartBadge();
  };

  // 10.3. 장바구니 품목 삭제
  window.removeCartItem = function(itemId) {
    const itemCard = document.getElementById(itemId);
    if (!itemCard) return;
    
    itemCard.style.opacity = '0';
    itemCard.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      itemCard.remove();
      window.updateCartTotals();
      if (window.updateCartBadge) window.updateCartBadge();
    }, 250);
  };

  // 10.4. AI 추천 제품 장바구니 담기
  window.addRecommendedToCart = function(recId) {
    const recCard = document.getElementById(recId);
    if (!recCard) return;
    
    const name = recCard.getAttribute('data-name');
    const price = parseInt(recCard.getAttribute('data-price')) || 0;
    const img = recCard.getAttribute('data-img');
    
    // 고유 ID 생성
    const newId = 'cart-item-' + Date.now();
    
    const newCardHtml = `
      <div class="cart-item-card" data-price="${price}" id="${newId}" style="opacity: 0; transform: scale(0.9); transition: all 0.25s;">
        <button type="button" class="cart-item-remove" onclick="removeCartItem('${newId}')">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="cart-item-thumb">
          <img src="${img}" alt="${name}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">${name}</h4>
          <p class="cart-item-price-label">${price.toLocaleString()}원</p>
          <div class="quantity-controller">
            <button type="button" class="qty-btn qty-minus" onclick="changeQty('${newId}', -1)">-</button>
            <span class="qty-val" id="qty-val-${newId}">1</span>
            <button type="button" class="qty-btn qty-plus" onclick="changeQty('${newId}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
    
    const container = document.getElementById('cart-items-container');
    if (container) {
      container.insertAdjacentHTML('beforeend', newCardHtml);
      
      // 애니메이션 노출
      setTimeout(() => {
        const newCard = document.getElementById(newId);
        if (newCard) {
          newCard.style.opacity = '1';
          newCard.style.transform = 'scale(1)';
        }
      }, 50);
      
      window.updateCartTotals();
      if (window.updateCartBadge) window.updateCartBadge();
      alert(`🛒 [${name}]가 장바구니에 추가되었습니다!\n3개 품목 이상으로 세트 20% 할인 혜택이 적용됩니다.`);
    }
  };

  // 10.5. 마이페이지 스마트 기기 ON/OFF 토글
  window.toggleDevice = function(deviceId) {
    const deviceEl = document.getElementById(deviceId);
    if (!deviceEl) return;
    
    const toggleBtn = deviceEl.querySelector('.btn-device-toggle');
    const sliderFill = deviceEl.querySelector('.slider-fill');
    const locationEl = deviceEl.querySelector('.device-location');
    
    if (!toggleBtn || !locationEl) return;
    const locationText = locationEl.textContent;
    
    if (toggleBtn.classList.contains('on')) {
      // ON -> OFF 전환
      toggleBtn.classList.remove('on');
      toggleBtn.classList.add('off');
      toggleBtn.textContent = 'OFF';
      deviceEl.classList.add('offline');
      if (sliderFill) sliderFill.style.width = '0%';
      if (locationText.includes('|')) {
        locationEl.textContent = locationText.split('|')[0] + '| Offline';
      }
    } else {
      // OFF -> ON 전환
      toggleBtn.classList.remove('off');
      toggleBtn.classList.add('on');
      toggleBtn.textContent = 'ON';
      deviceEl.classList.remove('offline');
      
      // 디폴트 조도 디밍 비율 복구
      const dimPercent = deviceId.includes('lumina') ? '60%' : '80%';
      if (sliderFill) sliderFill.style.width = dimPercent;
      if (locationText.includes('|')) {
        locationEl.textContent = locationText.split('|')[0] + '| 3000K Warm White';
      }
    }
  };

  // 10.6. 장바구니 결제하기 주문 버튼 이벤트
  const btnCartCheckout = document.getElementById('btn-cart-checkout');
  if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', (e) => {
      e.preventDefault();
      const itemCards = document.querySelectorAll('.cart-item-card');
      if (itemCards.length === 0) {
        alert('🛒 장바구니가 비어 있습니다. 제품을 담은 후 주문해 주세요!');
        return;
      }
      window.directCheckoutItem = null; // 장바구니 전체 결제 모드
      showView('checkout');
    });
  }

  // ==========================================
  // 11. 이달의 추천 조명 상세 화면 인터랙션
  // ==========================================

  // 11.1. 컬렉션 캐러셀 좌우 스크롤 제어
  const carousel = document.getElementById('collection-carousel');
  const btnPrev = document.getElementById('btn-carousel-prev');
  const btnNext = document.getElementById('btn-carousel-next');

  if (carousel && btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      carousel.scrollBy({ left: -154, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      carousel.scrollBy({ left: 154, behavior: 'smooth' });
    });
  }

  // 11.2. 컬렉션 개별 좋아요 하트 버튼 토글
  window.toggleCollectionLike = function(cardId) {
    const cardEl = document.getElementById(cardId);
    if (!cardEl) return;
    
    const likeBtn = cardEl.querySelector('.col-card-like-btn');
    if (!likeBtn) return;
    
    likeBtn.classList.toggle('active');
    
    const name = cardEl.querySelector('.col-product-name').textContent;
    if (likeBtn.classList.contains('active')) {
      alert(`❤️ [${name}] 제품을 관심 목록에 추가하였습니다.`);
    } else {
      alert(`💔 [${name}] 제품을 관심 목록에서 해제하였습니다.`);
    }
  };

  // ==========================================
  // 12. 검색 모달 및 스마트 라우팅 인터랙션
  // ==========================================

  let recentSearches = ['원목 무드등', '오로라', '스캔']; // 디폴트 최근 검색어 예시

  // 12.1. 최근 검색어 리스트 그리기
  window.renderRecentSearches = function() {
    const container = document.getElementById('recent-search-container');
    if (!container) return;
    
    if (recentSearches.length === 0) {
      container.innerHTML = `<div class="search-empty-text" id="recent-search-empty">최근 검색한 내역이 없습니다.</div>`;
      return;
    }
    
    let html = '';
    recentSearches.forEach((query, index) => {
      html += `
        <div class="recent-search-item">
          <span class="recent-query-text" onclick="clickSearchKeyword('${query}')">${query}</span>
          <button type="button" class="btn-remove-recent" onclick="removeRecentSearch(${index})">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      `;
    });
    container.innerHTML = html;
  };

  // 12.2. 최근 검색어 개별 삭제
  window.removeRecentSearch = function(index) {
    recentSearches.splice(index, 1);
    window.renderRecentSearches();
  };

  // 12.3. 검색어 키워드 클릭 시 검색 실행
  window.clickSearchKeyword = function(keyword) {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.value = keyword;
    }
    performSearch(keyword);
  };

  // 12.4. 검색 실행 및 스마트 라우팅 핵심 로직
  function performSearch(query) {
    if (!query || query.trim() === '') return;
    query = query.trim();

    // 최근 검색어 기록 추가 (중복 방지 및 상위 이동)
    const existingIndex = recentSearches.indexOf(query);
    if (existingIndex > -1) {
      recentSearches.splice(existingIndex, 1);
    }
    recentSearches.unshift(query);
    if (recentSearches.length > 5) {
      recentSearches.pop(); // 최대 5개까지만 노출
    }

    // 모달창 닫기
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
      searchModal.classList.remove('active');
    }

    // 검색어 키워드별 스마트 매핑 라우팅 분기
    const lowerQuery = query.toLowerCase();

    // 1. 카테고리 둘러보기 매핑 (무드등, 둘러보기, 카테고리, 원목, 아크릴, 캐릭터, 세라믹)
    if (lowerQuery.includes('무드등') || lowerQuery.includes('둘러보기') || lowerQuery.includes('카테고리') || lowerQuery.includes('원목') || lowerQuery.includes('아크릴') || lowerQuery.includes('세라믹') || lowerQuery.includes('공예') || lowerQuery.includes('캠핑') || lowerQuery.includes('종이')) {
      showView('category-all');
      return;
    }

    // 2. AI 스캔 및 공간분석 매핑 (분석, 스캔, 공간, 카메라, 촬영, 수평)
    if (lowerQuery.includes('분석') || lowerQuery.includes('스캔') || lowerQuery.includes('공간') || lowerQuery.includes('카메라') || lowerQuery.includes('촬영') || lowerQuery.includes('수평') || lowerQuery.includes('센서') || lowerQuery.includes('가이드')) {
      if (window.openGuideModal) {
        window.openGuideModal();
      } else {
        showView('scan');
      }
      return;
    }

    // 3. 이달의 추천 및 오로라 펜던트 매핑 (추천, 이달, 오로라, 펜던트, 에디터, 브라스)
    if (lowerQuery.includes('추천') || lowerQuery.includes('이달') || lowerQuery.includes('오로라') || lowerQuery.includes('펜던트') || lowerQuery.includes('에디터') || lowerQuery.includes('브라스') || lowerQuery.includes('아크')) {
      showView('featured-more');
      return;
    }

    // 4. 장바구니 및 구매 매핑 (장바구니, 구매, 결제, 카트, 주문)
    if (lowerQuery.includes('장바구니') || lowerQuery.includes('구매') || lowerQuery.includes('결제') || lowerQuery.includes('카트') || lowerQuery.includes('주문') || lowerQuery.includes('checkout')) {
      showView('cart');
      return;
    }

    // 5. 마이페이지 및 설정 매핑 (마이, 프로필, 설정, 제어, 스마트, 기기, 가입)
    if (lowerQuery.includes('마이') || lowerQuery.includes('프로필') || lowerQuery.includes('설정') || lowerQuery.includes('제어') || lowerQuery.includes('스마트') || lowerQuery.includes('기기') || lowerQuery.includes('가입') || lowerQuery.includes('smart')) {
      showView('mypage');
      return;
    }

    // 6. 그 외 키워드는 제품 둘러보기 페이지로 전체 검색 피드백 전달 후 라우팅
    alert(`🔍 [${query}] 검색 결과를 찾기 위해 무드등 둘러보기(제품 둘러보기) 페이지로 이동합니다.`);
    showView('category-all');
  }

  // 12.5. 모달 내 캔슬(취소) 및 백드롭 바인딩
  const btnSearchCancel = document.getElementById('btn-search-cancel');
  const searchBackdrop = document.getElementById('search-backdrop');

  function closeSearchModal() {
    const searchModal = document.getElementById('search-modal');
    if (searchModal) {
      searchModal.classList.remove('active');
    }
  }

  if (btnSearchCancel) {
    btnSearchCancel.addEventListener('click', closeSearchModal);
  }
  if (searchBackdrop) {
    searchBackdrop.addEventListener('click', closeSearchModal);
  }

  // 12.6. 검색창에서 엔터 키 입력 시 검색 실행
  const searchInputEl = document.getElementById('search-input');
  if (searchInputEl) {
    searchInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        performSearch(searchInputEl.value);
      }
    });
  }

  // ==========================================
  // 12.7. B&A 비교 스플릿 슬라이더 제어
  // ==========================================
  window.initBnaSlider = function() {
    const slider = document.getElementById('main-bna-slider');
    const overlay = document.getElementById('bna-after-overlay');
    const handle = document.getElementById('bna-slider-handle');
    if (!slider || !overlay || !handle) return;

    // Reset positions to 50%
    overlay.style.width = '50%';
    handle.style.left = '50%';

    let isDragging = false;

    function moveSlider(clientX) {
      const rect = slider.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      
      // Keep within bounds
      if (offsetX < 0) offsetX = 0;
      if (offsetX > rect.width) offsetX = rect.width;
      
      const percentage = (offsetX / rect.width) * 100;
      overlay.style.width = percentage + '%';
      handle.style.left = percentage + '%';
    }

    // Touch and mouse events
    const knob = handle.querySelector('.bna-handle-knob');
    if (knob) {
      knob.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
      });

      // Also allow dragging by clicking anywhere on the slider container
      slider.addEventListener('mousedown', (e) => {
        if (e.target.closest('.bna-handle-knob')) return; // Avoid double triggering
        isDragging = true;
        moveSlider(e.clientX);
      });
    }

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support for mobile/tablet simulation
    if (knob) {
      knob.addEventListener('touchstart', (e) => {
        isDragging = true;
      });

      slider.addEventListener('touchstart', (e) => {
        if (e.target.closest('.bna-handle-knob')) return;
        isDragging = true;
        if (e.touches && e.touches[0]) {
          moveSlider(e.touches[0].clientX);
        }
      });
    }

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches && e.touches[0]) {
        moveSlider(e.touches[0].clientX);
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  };

  // ==========================================
  // 13. 제품 상세보기 & 장바구니 실시간 연동
  // ==========================================

  const productsData = {
    // 1. 홈 화면 & 컬렉션 & 큐레이션용 오리지널 상품 정보 (홈페이지 비주얼 일치)
    "aurora-brass": {
      name: "오로라 브라스 펜던트",
      price: 450000,
      img: "img/light009.jpg",
      match: "98%",
      desc: "정제된 황동 소재와 따뜻한 빛의 조화가 다이닝 공간을 클래식하게 연출해줍니다. 시간의 흐름에 따라 깊어지는 질감을 경험해보세요.",
      specs: ["2700K~6500K", "Smart Control", "Dimmable"],
      insight: "이 조명은 구석의 그림자를 부드럽게 만들어주어 기존의 '미드나잇 네이비' 소파와 완벽하게 어울립니다.",
      colors: ["#E5C7B2", "#3E4C5E", "#1C1D1F"]
    },
    "wood-hexa": {
      name: "리얼 우드 헥사 스탠드",
      price: 75000,
      img: "img/light001.jpg",
      match: "92%",
      desc: "천연 무늬목의 결을 그대로 살려 자연스럽고 아늑한 침실 분위기를 만드는 헥사 쉐이프 테이블 스탠드입니다.",
      specs: ["3000K 단일", "800 Lux", "원터치 토글스위치"],
      insight: "침대 머리맡에 배치하여 은은한 독서등으로 제격이며, 우드 톤의 프레임 가구와 조화롭게 매칭됩니다.",
      colors: ["#8D5B4C", "#D2B48C", "#FFFFFF"]
    },
    "neo-able": {
      name: "네오 에블 라이트",
      price: 180000,
      img: "img/Stand03.png",
      match: "94%",
      desc: "컴팩트한 라인에 마그네틱 회전식 관절 헤드를 탑재하여 침실 벽면 간접 조명이나 집중 독서등으로 활용 가능한 신개념 램프입니다.",
      specs: ["3000K 단일", "900 Lux", "3단계 터치디밍"],
      insight: "자석 헤드가 360도 회전하여 눈부심을 방지하고 벽을 향해 비춤으로써 극도의 안락함을 도모합니다.",
      colors: ["#1C1D1F", "#E5C7B2", "#FFFFFF"]
    },
    "smart-cube": {
      name: "스마트 미니 큐브 무드등",
      price: 49000,
      img: "img/light004.jpg",
      match: "95%",
      desc: "1600만 가지 RGB 컬러 표현과 스마트폰 App 스케줄링으로 나만의 테마 분위기를 커스텀하는 스마트 무드등입니다.",
      specs: ["RGB Full Color", "500 Lux", "스마트 App 연동"],
      insight: "이 조명은 다채로운 분위기를 원스톱으로 연출할 수 있어, 파티션 공간이나 게이밍 데스크 분위기 조성에 탁월합니다.",
      colors: ["#FFFFFF", "#000000", "#CCCCCC"]
    },
    "luna-table": {
      name: "Luna Table Lamp",
      price: 150000,
      img: "img/Stand02.png",
      match: "97%",
      desc: "수면에 가장 안락한 조도를 지원하는 원목 크래프트 탁상 무드등입니다. 2700K 색온도가 당신의 몸과 마음을 편안한 휴식 상태로 안내합니다.",
      specs: ["2700K 단일", "600 Lux", "수면 타이머 모드"],
      insight: "협탁 위에 아담하게 자리잡는 크기로, 편안한 우드결 베이스가 침실에 온화한 자연 질감을 더해 줍니다.",
      colors: ["#D2B48C", "#8B5A2B", "#FFFFFF"]
    },
    "luna-designer": {
      name: "Luna Designer Stand",
      price: 165000,
      img: "img/Stand05.jpg",
      match: "97%",
      desc: "독창적인 스플라인 우드 곡선이 돋보이는 오가닉 디자인 무드등입니다. 업로드한 공간에 아트적인 입체감을 더해줍니다.",
      specs: ["3000K~5000K", "1000 Lux", "스마트 디밍 모드"],
      insight: "어느 각도에서 보아도 수려한 원목 곡선 프레임이 공간의 조형미를 극대화하며, 은은하게 흩어지는 잔잔한 빛이 매력적입니다.",
      colors: ["#8B4513", "#CD853F", "#FFF8DC"]
    },
    "lumina-floor": {
      name: "루미나 플로어 아크",
      price: 220000,
      img: "img/Stand05.jpg",
      match: "96%",
      desc: "아치형 스틸 프레임으로 넓은 거실 공간을 우아하고 포근하게 덮어주는 북유럽 스타일 프리미엄 플로어 조명입니다.",
      specs: ["2700K~4000K", "1400 Lux", "풋스위치 컨트롤"],
      insight: "이 스탠드는 긴 아치 곡선으로 소파 위를 부드럽게 감싸안는 세련된 라인감을 선사합니다.",
      colors: ["#C0C0C0", "#1C1D1F", "#FFFFFF"]
    },
    "ambient-strip": {
      name: "엠비언트 스트립",
      price: 62000,
      img: "img/Stand04.png",
      match: "97%",
      desc: "TV 배후나 침대 헤드 뒤에 부착하여 미세한 색상 조절로 공간의 깊이감을 더해주는 부착형 스마트 LED 라이트 스트립입니다.",
      specs: ["RGBIC 멀티컬러", "600 Lux", "스마트 App & 소리반응"],
      insight: "음악이나 소리에 맞춰 반응하는 인터랙티브 모션 라이팅으로 홈시네마 분위기를 한 차원 업그레이드합니다.",
      colors: ["#FFFFFF", "#000000"]
    },
    "aura-floor": {
      name: "아우라 플로어 램프",
      price: 180000,
      img: "img/img002.png",
      match: "98%",
      desc: "내추럴한 거실 분위기에 은은하게 매칭되는 앰비언트 램프로, 5단계 조도 조절 기능이 어두운 야간 무드에 최적의 빛을 선사합니다.",
      specs: ["2200K~4000K", "1500 Lux", "터치식 무단계 조절"],
      insight: "거실 소파 옆이나 빈 벽면 구석 코너에 빛을 쏘아 올려 벽면 반사광을 통한 따뜻하고 깊은 입체감을 줍니다.",
      colors: ["#3A3B3C", "#C0C0C0", "#EBEBEB"]
    },

    // 2. [제품 둘러보기] 10종 전용 상품 정보 (둘러보기 목록 이미지와 100% 일치)
    "explore-wood-hexa": {
      name: "원목 감성 무드등",
      price: 75000,
      img: "img/light001.jpg",
      match: "92%",
      desc: "천연 무늬목의 결을 그대로 살려 자연스럽고 아늑한 침실 분위기를 만드는 헥사 쉐이프 테이블 스탠드입니다.",
      specs: ["3000K 단일", "800 Lux", "원터치 토글스위치"],
      insight: "침대 머리맡에 배치하여 은은한 독서등으로 제격이며, 우드 톤의 프레임 가구와 조화롭게 매칭됩니다.",
      colors: ["#8D5B4C", "#D2B48C", "#FFFFFF"]
    },
    "explore-cozy-acrylic": {
      name: "포근한 아크릴 무드등",
      price: 180000,
      img: "img/light002.jpg",
      match: "94%",
      desc: "수려한 라인의 아크릴 바디가 공간 전체에 부드러운 간접 빛을 고루 전파하는 모던 디자인 램프입니다.",
      specs: ["3000K 단일", "900 Lux", "3단계 터치디밍"],
      insight: "자석 헤드가 360도 회전하여 눈부심을 방지하고 벽을 향해 비춤으로써 극도의 안락함을 도모합니다.",
      colors: ["#1C1D1F", "#E5C7B2", "#FFFFFF"]
    },
    "explore-aurora-wave": {
      name: "오로라 웨이브 무드등",
      price: 90000,
      img: "img/light003.jpg",
      match: "96%",
      desc: "신비롭고 다채로운 오로라 파동의 빛을 공간에 수놓아 감각적인 분위기를 자아내는 프리미어 테이블 조명입니다.",
      specs: ["Aurora Light", "700 Lux", "USB 전원구동"],
      insight: "밋밋한 벽면에 투사하여 물결치는 파동 효과를 연출함으로써 깊고 화려한 무드를 완성합니다.",
      colors: ["#E5C7B2", "#3E4C5E", "#1C1D1F"]
    },
    "explore-smart-cube": {
      name: "스마트 IoT 무드등",
      price: 49000,
      img: "img/light004.jpg",
      match: "95%",
      desc: "1600만 가지 RGB 컬러 표현과 스마트폰 App 스케줄링으로 나만의 테마 분위기를 커스텀하는 스마트 무드등입니다.",
      specs: ["RGB Full Color", "500 Lux", "스마트 App 연동"],
      insight: "이 조명은 다채로운 분위기를 원스톱으로 연출할 수 있어, 파티션 공간이나 게이밍 데스크 분위기 조성에 탁월합니다.",
      colors: ["#FFFFFF", "#000000", "#CCCCCC"]
    },
    "explore-minimal-ceramic": {
      name: "미니멀 세라믹 무드등",
      price: 150000,
      img: "img/light005.jpg",
      match: "97%",
      desc: "정제된 점토로 수공예 제작되어 아늑하고 포근한 감성을 선사하는 미니멀한 라운드 세라믹 램프입니다.",
      specs: ["2700K 단일", "550 Lux", "아날로그 스위치"],
      insight: "우아하고 깨끗한 화이트 톤 가구 및 원목 베드 헤드보드 위에 따뜻한 분위기 메이커로 조화롭습니다.",
      colors: ["#FAF6EE", "#E5DCD0", "#FFFFFF"]
    },
    "explore-designer-handcraft": {
      name: "디자이너 수공예 무드등",
      price: 165000,
      img: "img/light006.jpg",
      match: "97%",
      desc: "수공예 유리 블로잉 아트로 제작되어 신비롭고 영롱한 투명 질감을 선사하는 디자이너 시그니처 조명입니다.",
      specs: ["3000K~5000K", "1000 Lux", "스마트 디밍 모드"],
      insight: "어느 각도에서 보아도 수려한 원목 곡선 프레임이 공간의 조형미를 극대화하며, 은은하게 흩어지는 잔잔한 빛이 매력적입니다.",
      colors: ["#8B4513", "#CD853F", "#FFF8DC"]
    },
    "explore-crystal-art": {
      name: "크리스탈 아트 무드등",
      price: 220000,
      img: "img/light007.jpg",
      match: "96%",
      desc: "기하학적 크리스탈 컷팅을 통과해 사방으로 번지는 화려한 보석 빛 반사 효과를 자아내는 거실 인테리어 포인트 등입니다.",
      specs: ["2700K~4000K", "1400 Lux", "풋스위치 컨트롤"],
      insight: "이 스탠드는 긴 아치 곡선으로 소파 위를 부드럽게 감싸안는 세련된 라인감을 선사합니다.",
      colors: ["#C0C0C0", "#1C1D1F", "#FFFFFF"]
    },
    "explore-paper-folding": {
      name: "에코 종이 폴딩 무드등",
      price: 62000,
      img: "img/light008.jpg",
      match: "97%",
      desc: "에코 친화적인 한지 및 폴딩 디자인으로 동양적인 부드러운 감성을 뿜어내는 수공예 종이 펜던트 램프입니다.",
      specs: ["2700K 단일", "500 Lux", "패브릭 케이블 스위치"],
      insight: "빛이 한지를 통과하며 산란되어 눈이 편안하며 한옥 감성이나 내추럴 모던 가구와 융합도가 높습니다.",
      colors: ["#FAF6EE", "#FFFFFF"]
    },
    "explore-brass-pendant": {
      name: "황동 미니멀 펜던트 무드등",
      price: 450000,
      img: "img/light009.jpg",
      match: "98%",
      desc: "정제된 황동 소재와 따뜻한 빛의 조화가 다이닝 공간을 클래식하게 연출해줍니다. 시간의 흐름에 따라 깊어지는 질감을 경험해보세요.",
      specs: ["2700K~6500K", "Smart Control", "Dimmable"],
      colors: ["#E5C7B2", "#3E4C5E", "#1C1D1F"]
    },
    "explore-camping-portable": {
      name: "실외 포터블 캠핑 무드등",
      price: 49000,
      img: "img/light010.jpg",
      match: "95%",
      desc: "1600만 가지 RGB 컬러 표현과 컴팩트 핸들 탑재로 실외나 캠핑 텐트 안에서 다채롭게 활용하는 방수형 스마트 아웃도어 무드등입니다.",
      specs: ["RGB Full Color", "450 Lux", "IP65 방수방진"],
      insight: "방수 규격 설계 및 컴팩트 핸들 탑재로 캠핑 텐트 내부나 아웃도어 환경에서 매우 활용도가 높습니다.",
      colors: ["#FFFFFF", "#000000"]
    }
  };

  let activeProductKey = "aurora-brass"; // 현재 열려있는 상품의 키

  // 13.2. 실시간 장바구니 추가 로직
  window.addProductToCart = function(name, price, img) {
    const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
    if (!isLoggedIn) {
      if (window.showToast) window.showToast('로그인 후 사용해 주세요.', 'error');
      if (window.openLoginModal) window.openLoginModal();
      return;
    }
    const newId = 'cart-item-' + Date.now();
    const newCardHtml = `
      <div class="cart-item-card" data-price="${price}" id="${newId}" style="opacity: 0; transform: scale(0.9); transition: all 0.25s;">
        <button type="button" class="cart-item-remove" onclick="removeCartItem('${newId}')">
          <span class="material-symbols-outlined">close</span>
        </button>
        <div class="cart-item-thumb">
          <img src="${img}" alt="${name}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">${name}</h4>
          <p class="cart-item-price-label">${price.toLocaleString()}원</p>
          <div class="quantity-controller">
            <button type="button" class="qty-btn qty-minus" onclick="changeQty('${newId}', -1)">-</button>
            <span class="qty-val" id="qty-val-${newId}">1</span>
            <button type="button" class="qty-btn qty-plus" onclick="changeQty('${newId}', 1)">+</button>
          </div>
        </div>
      </div>
    `;
    
    const container = document.getElementById('cart-items-container');
    if (container) {
      container.insertAdjacentHTML('beforeend', newCardHtml);
      
      // 애니메이션 노출
      setTimeout(() => {
        const newCard = document.getElementById(newId);
        if (newCard) {
          newCard.style.opacity = '1';
          newCard.style.transform = 'scale(1)';
        }
      }, 50);
      
      window.updateCartTotals();
      window.updateCartBadge();
      alert(`🛒 [${name}]가 장바구니에 추가되었습니다!\n3개 품목 이상으로 세트 20% 할인 혜택이 적용됩니다.`);
    }
  };

  // 탭바 장바구니 뱃지 카운트 업데이트
  window.updateCartBadge = function() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
    if (!isLoggedIn) {
      badge.style.display = 'none';
      return;
    }
    let total = 0;
    document.querySelectorAll('.cart-item-card').forEach(card => {
      const qtyValEl = card.querySelector('.qty-val');
      total += qtyValEl ? (parseInt(qtyValEl.textContent) || 0) : 0;
    });
    if (total > 0) {
      badge.textContent = total > 99 ? '99+' : total;
      badge.style.display = 'flex';
      // 뱃지 팝 애니메이션 재실행
      badge.style.animation = 'none';
      badge.offsetHeight; // reflow
      badge.style.animation = '';
    } else {
      badge.style.display = 'none';
    }
  };

  // 페이지 로드 시 장바구니 및 뱃지 복원 (updateCartBadge 정의 이후 실행)
  restoreCartFromStorage();

  // 13.3. 상세 정보 화면에 제품 바인딩 및 노출
  window.openProductDetail = function(productKey) {
    let data = productsData[productKey];
    if (!data) {
      data = productsData["aurora-brass"];
      productKey = "aurora-brass";
    }
    
    activeProductKey = productKey;
    
    // 텍스트 및 속성 채우기
    const pdHeaderTitle = document.getElementById('pd-header-title');
    const pdTitle = document.getElementById('pd-title');
    const pdDesc = document.getElementById('pd-desc');
    const pdPrice = document.getElementById('pd-price');
    const pdImg = document.getElementById('pd-img');
    const pdMatchVal = document.getElementById('pd-match-val');
    const pdSpec1 = document.getElementById('pd-spec-1');
    const pdSpec2 = document.getElementById('pd-spec-2');
    const pdSpec3 = document.getElementById('pd-spec-3');
    const pdInsightDesc = document.getElementById('pd-insight-desc');
    const pdColorContainer = document.getElementById('pd-color-container');

    if (pdHeaderTitle) pdHeaderTitle.textContent = data.name;
    if (pdTitle) pdTitle.textContent = data.name;
    if (pdDesc) pdDesc.textContent = data.desc;
    if (pdPrice) pdPrice.textContent = data.price.toLocaleString() + '원';
    if (pdImg) pdImg.src = data.img;
    if (pdMatchVal) pdMatchVal.textContent = data.match + ' 매칭';
    if (pdSpec1) pdSpec1.textContent = (data.specs && data.specs[0]) ? data.specs[0] : '';
    if (pdSpec2) pdSpec2.textContent = (data.specs && data.specs[1]) ? data.specs[1] : '';
    if (pdSpec3) pdSpec3.textContent = (data.specs && data.specs[2]) ? data.specs[2] : '';
    if (pdInsightDesc) pdInsightDesc.textContent = data.insight;
    
    // 컬러 파레트 채우기
    if (pdColorContainer) {
      let colorHtml = '';
      if (data.colors && data.colors.length) {
        data.colors.forEach((color, idx) => {
          const activeClass = (idx === 0) ? 'active' : '';
          colorHtml += `<span class="pd-color-circle ${activeClass}" style="background-color: ${color};" onclick="selectPdColor(this)"></span>`;
        });
      }
      pdColorContainer.innerHTML = colorHtml;
    }
    
    // 하트 아이콘 초기화 (좋아요 해제 상태)
    const pdLikeIcon = document.getElementById('pd-like-icon');
    if (pdLikeIcon) {
      pdLikeIcon.textContent = 'favorite_border';
      pdLikeIcon.classList.remove('active');
      pdLikeIcon.style.color = '';
    }
    
    // 화면 이동
    showView('product-detail');
  };

  // 13.4. 상세 정보 화면 색상 토글
  window.selectPdColor = function(el) {
    const siblings = el.parentElement.querySelectorAll('.pd-color-circle');
    siblings.forEach(circle => circle.classList.remove('active'));
    el.classList.add('active');
  };

  // 13.5. 상세 정보 화면 하트 좋아요 토글
  window.togglePdLike = function() {
    const pdLikeIcon = document.getElementById('pd-like-icon');
    if (!pdLikeIcon) return;
    
    const isActive = pdLikeIcon.classList.toggle('active');
    if (isActive) {
      pdLikeIcon.textContent = 'favorite';
      pdLikeIcon.style.color = '#FF5252';
      alert('❤️ 관심 상품 목록에 등록되었습니다.');
    } else {
      pdLikeIcon.textContent = 'favorite_border';
      pdLikeIcon.style.color = '';
      alert('💔 관심 상품 목록에서 해제되었습니다.');
    }
  };

  // 13.6. 상세 정보 뒤로가기 버튼
  const btnPdBack = document.getElementById('btn-pd-back');
  if (btnPdBack) {
    btnPdBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  // 13.7. 상세 정보 장바구니 담기 버튼 바인딩
  const btnPdAddCart = document.getElementById('btn-pd-add-cart');
  if (btnPdAddCart) {
    btnPdAddCart.addEventListener('click', (e) => {
      e.preventDefault();
      const data = productsData[activeProductKey];
      if (data) {
        window.addProductToCart(data.name, data.price, data.img);
      }
    });
  }

  // 13.8. 상세 정보 AI 공간 분석 이동
  const btnPdScan = document.getElementById('btn-pd-scan');
  if (btnPdScan) {
    btnPdScan.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openGuideModal) {
        window.openGuideModal();
      } else {
        showView('scan');
      }
    });
  }

  // 13.9. 상세 정보 바로 구매하기 버튼 바인딩
  const btnPdBuy = document.getElementById('btn-pd-buy');
  if (btnPdBuy) {
    btnPdBuy.addEventListener('click', (e) => {
      e.preventDefault();
      const data = productsData[activeProductKey];
      if (data) {
        // 단품 바로 구매 모드 세팅 (기존 장바구니 아이템과 섞이지 않음)
        window.directCheckoutItem = {
          name: data.name,
          price: data.price,
          img: data.img,
          qty: 1
        };
      }
      showView('checkout');
    });
  }

  // 13.10. 홈 화면 메인 조명 카드 장바구니 담기 바인딩
  const btnCartHome = document.getElementById('btn-cart');
  if (btnCartHome) {
    btnCartHome.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // 카드 자체 클릭 이벤트 전파 차단
      window.addProductToCart("오로라 브라스 펜던트", 90000, "img/light009.jpg");
    });
  }

  // 13.11. 제품 카드 클릭 시 상세 페이지로 이동 연동
  const featProductMain = document.getElementById('feat-product-main');
  if (featProductMain) {
    featProductMain.addEventListener('click', (e) => {
      if (e.target.closest('.like-toggle') || e.target.closest('.add-to-cart-btn')) return;
      window.openProductDetail('aurora-brass');
    });
  }

  const recProduct1 = document.getElementById('rec-product-1');
  if (recProduct1) {
    recProduct1.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn') || e.target.closest('.col-card-cart-btn')) return;
      window.openProductDetail('aurora-brass');
    });
  }

  const recProduct2 = document.getElementById('rec-product-2');
  if (recProduct2) {
    recProduct2.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn') || e.target.closest('.col-card-cart-btn')) return;
      window.openProductDetail('wood-hexa');
    });
  }

  const recProduct3 = document.getElementById('rec-product-3');
  if (recProduct3) {
    recProduct3.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn') || e.target.closest('.col-card-cart-btn')) return;
      window.openProductDetail('smart-cube');
    });
  }

  // AI 스캔 추천 램프 카드 클릭 연동
  const recProductInner = document.querySelector('.recommended-product-inner');
  if (recProductInner) {
    recProductInner.addEventListener('click', () => {
      let key = "aura-floor";
      if (selectedRoomType === 'living') key = "aura-floor";
      else if (selectedRoomType === 'bed') key = "luna-table";
      else if (selectedRoomType === 'custom') key = "luna-designer";
      window.openProductDetail(key);
    });
  }

  // 이달의 추천 세 가지 서브 카드 클릭 연동
  const colCard1 = document.getElementById('col-card-1');
  if (colCard1) {
    colCard1.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn')) return;
      window.openProductDetail('lumina-floor');
    });
  }

  const colCard2 = document.getElementById('col-card-2');
  if (colCard2) {
    colCard2.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn')) return;
      window.openProductDetail('neo-able');
    });
  }

  const colCard3 = document.getElementById('col-card-3');
  if (colCard3) {
    colCard3.addEventListener('click', (e) => {
      if (e.target.closest('.col-card-like-btn')) return;
      window.openProductDetail('ambient-strip');
    });
  }

  // ==========================================
  // 14. 결제하기 페이지 연동 로직
  // ==========================================

  // 14.1. 결제 수단 선택 제어
  let selectedPayMethodType = 'card';
  window.selectPayMethod = function(method) {
    selectedPayMethodType = method;
    const cardBtn = document.getElementById('pay-method-card');
    const checkBtn = document.getElementById('pay-method-check');
    if (cardBtn && checkBtn) {
      cardBtn.classList.remove('active');
      checkBtn.classList.remove('active');
      if (method === 'card') {
        cardBtn.classList.add('active');
      } else {
        checkBtn.classList.add('active');
      }
    }
  };

  // 14.2. 공간 연출 드롭다운 제어
  window.toggleCheckoutDropdown = function() {
    const box = document.getElementById('checkout-dropdown-options-box');
    const btn = document.getElementById('checkout-dropdown-btn');
    if (box && btn) {
      const isOpen = btn.classList.toggle('open');
      if (isOpen) {
        box.classList.add('show');
      } else {
        box.classList.remove('show');
      }
    }
  };

  // 드롭다운 바깥 클릭 시 닫기
  document.addEventListener('click', (e) => {
    const dropdownBtn = document.getElementById('checkout-dropdown-btn');
    const dropdownBox = document.getElementById('checkout-dropdown-options-box');
    if (dropdownBtn && dropdownBox) {
      if (!dropdownBtn.contains(e.target) && !dropdownBox.contains(e.target)) {
        dropdownBtn.classList.remove('open');
        dropdownBox.classList.remove('show');
      }
    }
  });

  // 드롭다운 버튼 클릭 리스너 연결
  const checkoutDropdownBtn = document.getElementById('checkout-dropdown-btn');
  if (checkoutDropdownBtn) {
    checkoutDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.toggleCheckoutDropdown();
    });
  }

  // 드롭다운 옵션 선택
  window.selectCheckoutDropdownOption = function(optionText) {
    const textEl = document.getElementById('checkout-selected-dropdown-text');
    const btn = document.getElementById('checkout-dropdown-btn');
    const box = document.getElementById('checkout-dropdown-options-box');
    
    if (textEl) textEl.textContent = optionText;
    if (btn) btn.classList.remove('open');
    if (box) box.classList.remove('show');
    
    // 연출 공간 입력 필드에도 힌트 동기화
    const spaceInput = document.getElementById('checkout-space-input');
    if (spaceInput) {
      spaceInput.value = optionText;
    }
  };

  // 14.3. 결제 화면 초기 진입 및 장바구니 매핑
  let currentCheckoutTotalPrice = "280,000원";
  window.directCheckoutItem = null; // 단품 바로 구매 정보 보관용

  window.initCheckoutView = function() {
    const galleryRow = document.querySelector('.checkout-gallery-row');
    const mainTitle = document.getElementById('checkout-main-title');
    const mainPriceBadge = document.getElementById('checkout-main-price-badge');
    const mainSub = document.getElementById('checkout-main-sub');
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const checkoutTotalQty = document.getElementById('checkout-total-qty');
    const btnSubmitText = document.getElementById('btn-checkout-submit-text');
    const checkoutDiscBox = document.getElementById('checkout-discount-info');

    if (!galleryRow) return;

    // 1. 단품 바로 구매 모드 (상세페이지에서 바로 구매 클릭 시)
    if (window.directCheckoutItem) {
      const item = window.directCheckoutItem;
      const formattedPrice = item.price.toLocaleString() + '원';

      galleryRow.innerHTML = `
        <div class="checkout-thumb-main" style="width: 160px; height: 160px;">
          <img src="${item.img}" alt="${item.name}">
        </div>
      `;

      if (mainTitle) mainTitle.textContent = item.name;
      if (mainPriceBadge) mainPriceBadge.textContent = formattedPrice;
      if (mainSub) mainSub.textContent = item.desc ? item.desc.substring(0, 30) + '...' : '바로 구매 상품';

      if (checkoutTotalPrice) checkoutTotalPrice.textContent = formattedPrice;
      if (checkoutTotalQty) checkoutTotalQty.textContent = "1";
      if (btnSubmitText) btnSubmitText.textContent = `${formattedPrice} 결제하기`;
      if (checkoutDiscBox) checkoutDiscBox.style.display = 'none';

      currentCheckoutTotalPrice = formattedPrice;

      // 입력 필드 및 드롭다운 초기화
      const spaceInput = document.getElementById('checkout-space-input');
      if (spaceInput) spaceInput.value = '내방 책상';
      const dropdownText = document.getElementById('checkout-selected-dropdown-text');
      if (dropdownText) dropdownText.textContent = '내방 책상';

      window.selectPayMethod('card');
      return;
    }

    // 2. 일반 장바구니 결제 모드 (장바구니에서 주문하기 클릭 시)
    const itemCards = document.querySelectorAll('.cart-item-card');
    let totalQtyVal = 0;
    
    // 갤러리 로우 비우기
    galleryRow.innerHTML = '';
    
    const names = [];
    itemCards.forEach(card => {
      const qtyValEl = card.querySelector('.qty-val');
      const qtyVal = qtyValEl ? (parseInt(qtyValEl.textContent) || 0) : 0;
      totalQtyVal += qtyVal;

      const imgSrc = card.querySelector('.cart-item-thumb img')?.src || '';
      const name = card.querySelector('.cart-item-name')?.textContent || '';
      
      names.push(name);

      // 각 상품마다 이미지 박스 추가
      const thumbHtml = `
        <div class="checkout-thumb-main" style="width: 130px; height: 130px; margin: 0 4px;">
          <img src="${imgSrc}" alt="${name}" style="width:100%; height:100%; object-fit:contain; padding:8px; box-sizing:border-box;">
        </div>
      `;
      galleryRow.insertAdjacentHTML('beforeend', thumbHtml);
    });

    const totalPriceVal = document.getElementById('cart-total-price') ? document.getElementById('cart-total-price').textContent : "0원";
    const cleanPrice = totalPriceVal ? totalPriceVal.split('(')[0].trim() : '0원';

    if (mainTitle) {
      if (names.length > 2) {
        mainTitle.textContent = `${names[0]} 외 ${names.length - 1}건`;
      } else if (names.length > 0) {
        mainTitle.textContent = names.join(' + ');
      } else {
        mainTitle.textContent = '주문 상품 없음';
      }
    }
    if (mainPriceBadge) mainPriceBadge.textContent = cleanPrice;
    if (mainSub) mainSub.textContent = '장바구니 선택 결제 상품';

    if (checkoutTotalPrice) checkoutTotalPrice.textContent = cleanPrice;
    if (checkoutTotalQty) checkoutTotalQty.textContent = totalQtyVal;
    if (btnSubmitText) btnSubmitText.textContent = `${cleanPrice} 결제하기`;

    // 할인 혜택 포함 시 상단 전용 뱃지로 깔끔하게 분리 노출
    if (totalPriceVal.includes('할인') || totalPriceVal.includes('혜택')) {
      if (checkoutDiscBox) checkoutDiscBox.style.display = 'flex';
    } else {
      if (checkoutDiscBox) checkoutDiscBox.style.display = 'none';
    }

    currentCheckoutTotalPrice = cleanPrice;

    // 입력 필드 및 드롭다운 초기화
    const spaceInput = document.getElementById('checkout-space-input');
    if (spaceInput) spaceInput.value = '내방 책상';
    
    const dropdownText = document.getElementById('checkout-selected-dropdown-text');
    if (dropdownText) dropdownText.textContent = '내방 책상';
    
    window.selectPayMethod('card');
  };

  // 14.4. 결제하기 뒤로가기 버튼
  const btnCheckoutBack = document.getElementById('btn-checkout-back');
  if (btnCheckoutBack) {
    btnCheckoutBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  // 14.5. 결제하기 최종 승인 버튼 클릭
  const btnCheckoutSubmit = document.getElementById('btn-checkout-submit');
  if (btnCheckoutSubmit) {
    btnCheckoutSubmit.addEventListener('click', (e) => {
      e.preventDefault();
      
      const spaceVal = document.getElementById('checkout-space-input') ? document.getElementById('checkout-space-input').value.trim() : "";
      const spaceDisplayName = spaceVal ? spaceVal : "내방 책상";
      const methodText = selectedPayMethodType === 'card' ? '신용카드' : '체크카드';
      
      alert(`🎉 [${currentCheckoutTotalPrice}] 결제가 성공적으로 완료되었습니다!\n\n📍 배송 장소: ${spaceDisplayName}\n💳 결제 수단: ${methodText}\n\n감사합니다! 주문하신 조명과 함께 최적의 AI 스페이스 셋업 가이드가 배송 차량을 통해 전달됩니다.`);
      
      // 장바구니 결제였던 경우에만 장바구니 비우기
      if (!window.directCheckoutItem) {
        const container = document.getElementById('cart-items-container');
        if (container) {
          container.innerHTML = '';
        }
        if (window.updateCartTotals) window.updateCartTotals();
      }

      window.directCheckoutItem = null; // 단품 결제 정보 리셋
      showView('home');
    });
  }

  // 14.6. 홈 화면 대표 아우라 플로어 램프 카드 클릭 연동
  const mainLampCard = document.querySelector('.main-lamp-card');
  if (mainLampCard) {
    mainLampCard.addEventListener('click', (e) => {
      window.openProductDetail('aura-floor');
    });
  }

  // ==========================================
  // 15. Curation Report 화면 연동 로직
  // ==========================================
  
  // 15.1. 뒤로가기 버튼
  const btnReportBack = document.getElementById('btn-report-back');
  if (btnReportBack) {
    btnReportBack.addEventListener('click', (e) => {
      e.preventDefault();
      window.goBack();
    });
  }

  // 15.2. AR 체험 버튼 연동
  const btnReportAr = document.getElementById('btn-report-ar');
  if (btnReportAr) {
    btnReportAr.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.openGuideModal) {
        window.openGuideModal();
      } else {
        showView('scan');
      }
    });
  }

  // 15.3. 추천 무드등 일괄 담기 버튼 연동 (4개 품목 일괄 추가)
  const btnReportBulkCart = document.getElementById('btn-report-bulk-cart');
  if (btnReportBulkCart) {
    btnReportBulkCart.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 첫 번째 제품 추가: 집중된 안락함 (490,000원)
      window.addProductToCart("집중된 안락함", 490000, "img/light009.jpg");
      
      // 두 번째 제품 추가: 앰비언트 모드 (200,000원)
      setTimeout(() => {
        window.addProductToCart("앰비언트 모드", 200000, "img/Stand03.png");
      }, 400);

      // 세 번째 제품 추가: 자연광 시너지 (75,000원)
      setTimeout(() => {
        window.addProductToCart("자연광 시너지", 75000, "img/light001.jpg");
      }, 800);

      // 네 번째 제품 추가: 스마트 큐브 셋업 (49,000원)
      setTimeout(() => {
        window.addProductToCart("스마트 큐브 셋업", 49000, "img/light004.jpg");
      }, 1200);
    });
  }

  // 15.4. 추천 무드등 더보기 버튼(점 세 개) 클릭 시 무드등 둘러보기(category-all) 이동
  const btnReportMoreCuration = document.getElementById('btn-report-more-curation');
  if (btnReportMoreCuration) {
    btnReportMoreCuration.addEventListener('click', (e) => {
      e.preventDefault();
      showView('category-all');
    });
  }

  // ==========================================
  // 16. 실시간 알림 모달 제어 로직
  // ==========================================
  const notiModal = document.getElementById('notification-modal');
  const notiCloseBtn = document.getElementById('btn-noti-close');
  const notiBackdrop = document.getElementById('noti-backdrop');

  // 알림 모달 열기 함수
  window.openNotificationModal = function() {
    if (notiModal) {
      notiModal.classList.add('active');
    }
  };

  // 알림 모달 닫기 함수
  window.closeNotificationModal = function() {
    if (notiModal) {
      notiModal.classList.remove('active');
    }
  };

  // 모든 notifications 링크에 클릭 이벤트 매핑
  const notiTriggers = document.querySelectorAll('a[href="#notifications"]');
  notiTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      window.openNotificationModal();
    });
  });

  // 닫기 버튼 및 백드롭 이벤트 바인딩
  if (notiCloseBtn) {
    notiCloseBtn.addEventListener('click', window.closeNotificationModal);
  }
  if (notiBackdrop) {
    notiBackdrop.addEventListener('click', window.closeNotificationModal);
  }

  // 모든 알림 읽음 처리 기능
  window.clearAllNotifications = function() {
    const unreadItems = document.querySelectorAll('.noti-item.new');
    if (unreadItems.length > 0) {
      unreadItems.forEach(item => {
        item.classList.remove('new');
      });
      alert('🔔 모든 실시간 알림을 읽음 처리했습니다.');
    } else {
      alert('🔔 새로 온 미확인 알림이 없습니다.');
    }
  };

  // ==========================================
  // 17. 15% 쿠폰팩 모달 제어 로직
  // ==========================================
  // 쿠폰 모달 열기
  window.openCouponModal = function() {
    const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
    if (!isLoggedIn) {
      if (window.showToast) window.showToast('로그인 후 사용해 주세요.', 'error');
      if (window.openLoginModal) window.openLoginModal();
      return;
    }
    const couponModal = document.getElementById('coupon-modal');
    if (!couponModal) return;
    
    // 이미 쿠폰을 다운로드 받았는지 확인
    const isClaimed = localStorage.getItem('viewlight_coupon_claimed') === 'true';
    updateCouponUIState(isClaimed);

    couponModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // 쿠폰 모달 닫기
  window.closeCouponModal = function() {
    const couponModal = document.getElementById('coupon-modal');
    if (!couponModal) return;
    couponModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // 쿠폰 UI 상태 업데이트
  function updateCouponUIState(isClaimed) {
    const badges = [
      document.getElementById('badge-status-1'),
      document.getElementById('badge-status-2'),
      document.getElementById('badge-status-3')
    ];
    const claimBtnText = document.getElementById('claim-btn-text');
    const claimCouponsBtn = document.getElementById('btn-claim-coupons');
    const couponToastMsg = document.getElementById('coupon-toast-msg');

    if (isClaimed) {
      badges.forEach(badge => {
        if (badge) {
          badge.classList.add('claimed');
          badge.textContent = '✅ 발급완료';
        }
      });
      if (claimCouponsBtn) {
        claimCouponsBtn.classList.add('claimed');
      }
      if (claimBtnText) {
        claimBtnText.textContent = '✅ 쿠폰팩 발급 완료 (쿠폰함 보관됨)';
      }
      if (couponToastMsg) {
        couponToastMsg.classList.add('show');
      }
    } else {
      badges.forEach(badge => {
        if (badge) {
          badge.classList.remove('claimed');
          badge.textContent = '미발급';
        }
      });
      if (claimCouponsBtn) {
        claimCouponsBtn.classList.remove('claimed');
      }
      if (claimBtnText) {
        claimBtnText.textContent = '✨ 15% 쿠폰팩 받기';
      }
      if (couponToastMsg) {
        couponToastMsg.classList.remove('show');
      }
    }
  }

  // 쿠폰 다운로드 실행
  window.claimCoupons = function() {
    const claimCouponsBtn = document.getElementById('btn-claim-coupons');
    localStorage.setItem('viewlight_coupon_claimed', 'true');
    updateCouponUIState(true);

    // 버튼 임팩트 애니메이션
    if (claimCouponsBtn) {
      claimCouponsBtn.style.transform = 'scale(0.96)';
      setTimeout(() => {
        claimCouponsBtn.style.transform = '';
      }, 150);
    }
  };

  // 쿠폰 열기 트리거 바인딩 (desktop button, event banner, all href="#coupon")
  const couponTriggers = document.querySelectorAll('a[href="#coupon"], #btn-coupon-download, #btn-brand-event-coupon');
  couponTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      window.openCouponModal();
    });
  });

  // 로그인 버튼 클릭 핸들러 바인딩
  const loginButtons = document.querySelectorAll('.btn-header-login');
  loginButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.closeMenuDrawer) window.closeMenuDrawer();
      window.openLoginModal();
    });
  });

  const couponCloseBtn = document.getElementById('btn-coupon-close');
  const couponBackdrop = document.getElementById('coupon-backdrop');
  const claimCouponsBtn = document.getElementById('btn-claim-coupons');

  if (couponCloseBtn) {
    couponCloseBtn.addEventListener('click', window.closeCouponModal);
  }
  if (couponBackdrop) {
    couponBackdrop.addEventListener('click', window.closeCouponModal);
  }
  if (claimCouponsBtn) {
    claimCouponsBtn.addEventListener('click', window.claimCoupons);
  }

  // AI 공간 분석 모달 액션 버튼 바인딩
  const btnTechModalBna = document.getElementById('btn-tech-modal-bna');
  if (btnTechModalBna) {
    btnTechModalBna.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeAiTechModal();
      showView('bna-all');
    });
  }

  const btnTechModalScan = document.getElementById('btn-tech-modal-scan');
  if (btnTechModalScan) {
    btnTechModalScan.addEventListener('click', (e) => {
      e.preventDefault();
      window.closeAiTechModal();
      showView('scan');
    });
  }
});

/* ==========================================
   이미지 뷰어 모달 — 전역 함수
   ========================================== */
window.openImageViewer = function(src, caption) {
  const modal  = document.getElementById('image-viewer-modal');
  const imgEl  = document.getElementById('img-viewer-src');
  const capEl  = document.getElementById('img-viewer-caption');
  if (!modal || !imgEl) return;

  imgEl.src = src;
  imgEl.alt = caption || '';
  if (capEl) capEl.textContent = caption || '';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeImageViewer = function() {
  const modal = document.getElementById('image-viewer-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
};

/* ==========================================
   AI 공간 분석 설명 모달 — 전역 함수
   ========================================== */
window.openAiTechModal = function() {
  const modal = document.getElementById('ai-tech-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeAiTechModal = function() {
  const modal = document.getElementById('ai-tech-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

/* ==========================================
   공지사항 / 이벤트 / 고객센터 심플 모달 — 전역 함수
   ========================================== */
const infoModalData = {
  notice: {
    badge: '📢 NOTICE',
    title: '공지사항',
    html: `
      <div class="info-list-group">
        <div class="info-list-item">
          <span class="info-date">2026.08.15</span>
          <h4 class="info-item-title">[안내] ViewLight 2.0 AI 비전 큐레이션 업데이트</h4>
          <p class="info-item-desc">사진 1장으로 조도와 공간 분위기를 분석하는 AI 엔진이 더욱 정밀해졌습니다.</p>
        </div>
        <div class="info-list-item">
          <span class="info-date">2026.08.10</span>
          <h4 class="info-item-title">[필독] 첫 구매 웰컴 15% 쿠폰팩 사용 안내</h4>
          <p class="info-item-desc">발급받으신 쿠폰은 세트 할인 혜택과 함께 중복 적용이 가능합니다.</p>
        </div>
        <div class="info-list-item">
          <span class="info-date">2026.08.01</span>
          <h4 class="info-item-title">[안내] 전 상품 무료 배송 & 무상 AS 1년 개시</h4>
          <p class="info-item-desc">ViewLight의 모든 무드등 라인업은 무상 1년 보증을 지원합니다.</p>
        </div>
      </div>
    `
  },
  events: {
    badge: '🎉 EVENT',
    title: '이벤트',
    html: `
      <div class="info-list-group">
        <div class="info-list-item highlight">
          <span class="info-badge-tag">진행중</span>
          <h4 class="info-item-title">✨ 웰컴 15% 쿠폰팩 즉시 발급</h4>
          <p class="info-item-desc">뷰라이트 첫 방문 고객님께 3종 티켓 패키지를 드립니다.</p>
        </div>
        <div class="info-list-item highlight">
          <span class="info-badge-tag">진행중</span>
          <h4 class="info-item-title">⚡ AI 큐레이션 세트 구매 시 20% 자동 할인</h4>
          <p class="info-item-desc">3개 이상 조명 일괄 구매 시 세트 특가 할인이 적용됩니다.</p>
        </div>
        <div class="info-list-item">
          <span class="info-badge-tag secondary">상시</span>
          <h4 class="info-item-title">📸 포토 리뷰 작성 시 5,000원 적립금</h4>
          <p class="info-item-desc">마이페이지 리뷰 작성 고객 전원에게 현금성 포인트를 증정합니다.</p>
        </div>
      </div>
    `
  },
  cs: {
    badge: '🎧 CUSTOMER CENTER',
    title: '고객센터',
    html: `
      <div class="cs-info-box">
        <div class="cs-phone-section">
          <span class="cs-phone-num">1588-0000</span>
          <span class="cs-time">평일 09:00 ~ 18:00 (점심 12:00 ~ 13:00)</span>
        </div>
        <div class="cs-detail-list">
          <div class="cs-detail-item">
            <span class="material-symbols-outlined">chat</span>
            <div>
              <strong>카카오톡 상담</strong>
              <p>@뷰라이트_VIEWLIGHT (24시간 AI 실시간 상담)</p>
            </div>
          </div>
          <div class="cs-detail-item">
            <span class="material-symbols-outlined">mail</span>
            <div>
              <strong>이메일 문의</strong>
              <p>support@viewlight.co.kr</p>
            </div>
          </div>
          <div class="cs-detail-item">
            <span class="material-symbols-outlined">local_shipping</span>
            <div>
              <strong>교환 / 반품 주소</strong>
              <p>서울특별시 강남구 테헤란로 뷰라이트 타워 5F CS센터</p>
            </div>
          </div>
        </div>
      </div>
    `
  }
};

window.openInfoModal = function(type) {
  if (type !== 'notice' && type !== 'events') {
    const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
    if (!isLoggedIn) {
      if (window.showToast) window.showToast('로그인 후 사용해 주세요.', 'error');
      if (window.openLoginModal) window.openLoginModal();
      return;
    }
  }
  const modal = document.getElementById('simple-info-modal');
  const badgeEl = document.getElementById('info-modal-badge');
  const titleEl = document.getElementById('info-modal-title');
  const bodyEl = document.getElementById('info-modal-body');

  const data = infoModalData[type] || infoModalData.notice;
  if (badgeEl) badgeEl.textContent = data.badge;
  if (titleEl) titleEl.textContent = data.title;
  if (bodyEl) bodyEl.innerHTML = data.html;

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeInfoModal = function() {
  const modal = document.getElementById('simple-info-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

window.closeMenuDrawer = function() {
  const menuDrawer = document.getElementById('menu-drawer');
  if (menuDrawer) {
    menuDrawer.classList.remove('open');
  }
};

/* ESC 키로도 모달 닫기 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    window.closeImageViewer();
    if (window.closeCouponModal) window.closeCouponModal();
    if (window.closeNotificationModal) window.closeNotificationModal();
    if (window.closeAiTechModal) window.closeAiTechModal();
    if (window.closeInfoModal) window.closeInfoModal();
    if (window.closeWriteReviewModal) window.closeWriteReviewModal();
    if (window.closeAddShippingModal) window.closeAddShippingModal();
    if (window.closeCsInquiryModal) window.closeCsInquiryModal();
  }
});

/* ==========================================================================
   마이페이지 서브 메뉴 5종 인터랙션 핸들러 (Order History, Reviews, Shipping, CS, Settings)
   ========================================================================== */

// 서브 뷰 상단 뒤로가기 버튼 바인딩
document.addEventListener('DOMContentLoaded', () => {
  const backButtons = ['orders', 'reviews', 'shipping', 'cs', 'settings'];
  backButtons.forEach(id => {
    const btn = document.getElementById(`btn-${id}-back`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.goBack();
      });
    }
  });
});

// 1. 주문 내역 필터링
window.filterOrders = function(period, btn) {
  const filterBtns = document.querySelectorAll('.order-filter-btn');
  filterBtns.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const cards = document.querySelectorAll('.order-card');
  cards.forEach(card => {
    if (period === 'all' || card.getAttribute('data-period') === period) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
};

// 2. 배송 추적 알림
window.openTrackingModal = function(info) {
  alert(`📦 [실시간 배송 추적 정보]\n\n운송장: ${info}\n현재 상태: [서울강남HUB] 배송 출발 (오늘 16:00~18:00 도착 예정)`);
};

// 3. 내 리뷰 탭 전환
window.switchReviewTab = function(tabName) {
  const btnWriteable = document.getElementById('tab-btn-writeable');
  const btnWritten = document.getElementById('tab-btn-written');
  const panelWriteable = document.getElementById('review-panel-writeable');
  const panelWritten = document.getElementById('review-panel-written');

  if (tabName === 'writeable') {
    if (btnWriteable) btnWriteable.classList.add('active');
    if (btnWritten) btnWritten.classList.remove('active');
    if (panelWriteable) panelWriteable.classList.add('active');
    if (panelWritten) panelWritten.classList.remove('active');
  } else {
    if (btnWritten) btnWritten.classList.add('active');
    if (btnWriteable) btnWriteable.classList.remove('active');
    if (panelWritten) panelWritten.classList.add('active');
    if (panelWriteable) panelWriteable.classList.remove('active');
  }
};

// 4. 리뷰 작성 모달 제어 및 제출
let currentReviewRating = 5;
let currentReviewProduct = { name: '', imgUrl: '' };
let currentUploadedImageBase64 = null;

window.handleReviewImageUpload = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    currentUploadedImageBase64 = e.target.result;
    
    // Show preview
    const previewContainer = document.getElementById('review-image-preview-container');
    const previewImg = document.getElementById('review-image-preview');
    if (previewImg) previewImg.src = e.target.result;
    if (previewContainer) previewContainer.style.display = 'block';

    // Update upload box text
    const uploadText = document.getElementById('upload-box-text');
    if (uploadText) uploadText.textContent = '사진 변경하기';
  };
  reader.readAsDataURL(file);
};

window.clearReviewImage = function(event) {
  if (event) {
    event.stopPropagation();
  }
  currentUploadedImageBase64 = null;

  const fileInput = document.getElementById('review-image-input');
  if (fileInput) fileInput.value = '';

  const previewContainer = document.getElementById('review-image-preview-container');
  if (previewContainer) previewContainer.style.display = 'none';

  const previewImg = document.getElementById('review-image-preview');
  if (previewImg) previewImg.src = '';

  const uploadText = document.getElementById('upload-box-text');
  if (uploadText) uploadText.textContent = '사진 첨부하기 (선택)';
};

// 4. 리뷰 작성 모달 제어 및 제출
window.openWriteReviewModal = function(prodName, imgUrl) {
  currentReviewProduct = { name: prodName || 'Luna Table Lamp', imgUrl: imgUrl || 'img/Stand02.png' };
  
  const targetName = document.getElementById('review-modal-target-name');
  if (targetName) targetName.textContent = currentReviewProduct.name;
  
  // Reset rating to 5
  window.setReviewRating(5);
  
  // Reset textarea
  const textInput = document.getElementById('review-input-text');
  if (textInput) textInput.value = '';
  
  // Reset image
  window.clearReviewImage();
  
  const modal = document.getElementById('write-review-modal');
  if (modal) modal.classList.add('open');
};

window.closeWriteReviewModal = function() {
  const modal = document.getElementById('write-review-modal');
  if (modal) modal.classList.remove('open');
};

window.setReviewRating = function(rating) {
  currentReviewRating = rating;
  const stars = document.querySelectorAll('#review-star-picker .star-icon');
  stars.forEach((s, idx) => {
    if (idx < rating) {
      s.classList.add('active');
    } else {
      s.classList.remove('active');
    }
  });
};

window.submitReviewForm = function() {
  const text = document.getElementById('review-input-text')?.value;
  if (!text || text.trim().length === 0) {
    alert('리뷰 내용을 기재해 주세요.');
    return;
  }
  
  // 1. Generate Star display rating HTML string
  const starString = '★'.repeat(currentReviewRating) + '☆'.repeat(5 - currentReviewRating);
  const ratingNum = currentReviewRating.toFixed(1);

  // 2. Generate date string (YYYY.MM.DD)
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');
  const dateString = `${year}.${month}.${date}`;

  // 3. Create review card element
  const card = document.createElement('div');
  card.className = 'written-review-card';
  
  let photoListHtml = '';
  if (currentUploadedImageBase64) {
    photoListHtml = `
      <div class="written-photo-list">
        <img src="${currentUploadedImageBase64}" alt="리뷰 사진" onclick="openImageViewer('${currentUploadedImageBase64}', '${currentReviewProduct.name} 실구매 설치샷')">
      </div>
    `;
  }

  card.innerHTML = `
    <div class="written-header">
      <img src="${currentReviewProduct.imgUrl}" alt="${currentReviewProduct.name}" class="review-prod-thumb">
      <div class="written-title-box">
        <h4 class="written-prod-name">${currentReviewProduct.name}</h4>
        <div class="star-rating-display">${starString} <span class="rating-num">${ratingNum}</span></div>
      </div>
      <span class="written-date">${dateString}</span>
    </div>
    <p class="written-body">${text.replace(/\n/g, '<br>')}</p>
    ${photoListHtml}
    <div class="written-actions">
      <button type="button" class="btn-review-edit" onclick="alert('리뷰 수정 기능 준비 중입니다.')">수정</button>
      <button type="button" class="btn-review-del" onclick="deleteReviewCard(this)">삭제</button>
    </div>
  `;

  // 4. Prepend review card to written panel
  const panelWritten = document.getElementById('review-panel-written');
  if (panelWritten) {
    panelWritten.insertBefore(card, panelWritten.firstChild);
  }

  // 5. Remove matching writable card
  const writeableCards = document.querySelectorAll('#review-panel-writeable .writeable-card');
  writeableCards.forEach(card => {
    const titleEl = card.querySelector('.review-prod-title');
    if (titleEl && titleEl.textContent.trim() === currentReviewProduct.name) {
      card.remove();
    }
  });

  // 6. Update counts and handle placeholder if no writable cards left
  const remainingWriteableCount = document.querySelectorAll('#review-panel-writeable .writeable-card').length;
  const writeableBadge = document.querySelector('#tab-btn-writeable .count-badge');
  if (writeableBadge) {
    writeableBadge.textContent = remainingWriteableCount;
  }

  if (remainingWriteableCount === 0 && !document.getElementById('no-writeable-reviews-placeholder')) {
    const emptyPlaceholder = document.createElement('div');
    emptyPlaceholder.id = 'no-writeable-reviews-placeholder';
    emptyPlaceholder.className = 'empty-reviews-placeholder';
    emptyPlaceholder.style.textAlign = 'center';
    emptyPlaceholder.style.padding = '40px 20px';
    emptyPlaceholder.style.color = '#94A3B8';
    emptyPlaceholder.style.fontWeight = '700';
    emptyPlaceholder.style.fontSize = '0.95rem';
    emptyPlaceholder.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 48px; margin-bottom: 8px; color: #475569; display: block;">rate_review</span>
      작성 가능한 리뷰가 없습니다.
    `;
    const panelWriteable = document.getElementById('review-panel-writeable');
    if (panelWriteable) {
      panelWriteable.appendChild(emptyPlaceholder);
    }
  }

  const currentWrittenCount = document.querySelectorAll('#review-panel-written .written-review-card').length;
  const writtenBadge = document.querySelector('#tab-btn-written .count-badge');
  if (writtenBadge) {
    writtenBadge.textContent = currentWrittenCount;
  }

  alert('✨ 리뷰가 등록되었습니다!\n포인트 1,000P가 마일리지로 적립되었습니다.');
  closeWriteReviewModal();
  switchReviewTab('written');
};

window.deleteReviewCard = function(btn) {
  if (confirm('작성하신 리뷰를 삭제하시겠습니까?')) {
    const card = btn.closest('.written-review-card');
    if (card) {
      card.remove();
      // Update badge count
      const writtenBadge = document.querySelector('#tab-btn-written .count-badge');
      if (writtenBadge) {
        const currentWrittenCount = document.querySelectorAll('#review-panel-written .written-review-card').length;
        writtenBadge.textContent = currentWrittenCount;
      }
    }
  }
};

// 5. 배송지 관리 모달 & 카드 동작
window.openAddShippingModal = function(mode, name, phone, zip, addr, memo) {
  const title = document.getElementById('shipping-modal-title');
  if (title) title.textContent = mode === 'edit' ? '배송지 수정' : '새 배송지 추가';
  
  if (mode === 'edit') {
    if (document.getElementById('ship-input-name')) document.getElementById('ship-input-name').value = name || '';
    if (document.getElementById('ship-input-phone')) document.getElementById('ship-input-phone').value = phone || '';
    if (document.getElementById('ship-input-zip')) document.getElementById('ship-input-zip').value = zip || '06123';
    if (document.getElementById('ship-input-addr')) document.getElementById('ship-input-addr').value = addr || '';
    if (document.getElementById('ship-input-memo')) document.getElementById('ship-input-memo').value = memo || '';
  } else {
    if (document.getElementById('ship-input-name')) document.getElementById('ship-input-name').value = '';
    if (document.getElementById('ship-input-phone')) document.getElementById('ship-input-phone').value = '';
    if (document.getElementById('ship-input-addr')) document.getElementById('ship-input-addr').value = '';
    if (document.getElementById('ship-input-memo')) document.getElementById('ship-input-memo').value = '';
  }

  const modal = document.getElementById('add-shipping-modal');
  if (modal) modal.classList.add('open');
};

window.closeAddShippingModal = function() {
  const modal = document.getElementById('add-shipping-modal');
  if (modal) modal.classList.remove('open');
};

window.saveShippingAddress = function() {
  const name = document.getElementById('ship-input-name')?.value;
  const addr = document.getElementById('ship-input-addr')?.value;
  if (!name || !addr) {
    alert('받는 분 이름과 기본 주소를 입력해 주세요.');
    return;
  }
  alert('배송지가 정상적으로 저장되었습니다.');
  closeAddShippingModal();
};

window.setDefaultShipping = function(btn) {
  const container = document.getElementById('shipping-list-container');
  if (!container) return;
  const cards = container.querySelectorAll('.shipping-card');
  cards.forEach(c => {
    c.classList.remove('default-card');
    const badge = c.querySelector('.badge-default');
    if (badge) badge.remove();
    const actions = c.querySelector('.shipping-card-actions');
    if (actions && !actions.querySelector('.btn-shipping-set-default')) {
      const setDefBtn = document.createElement('button');
      setDefBtn.className = 'btn-shipping-set-default';
      setDefBtn.setAttribute('onclick', 'setDefaultShipping(this)');
      setDefBtn.textContent = '기본 배송지로 설정';
      actions.insertBefore(setDefBtn, actions.firstChild);
    }
  });

  const targetCard = btn.closest('.shipping-card');
  targetCard.classList.add('default-card');
  const recipientBox = targetCard.querySelector('.shipping-recipient');
  if (recipientBox) {
    const badge = document.createElement('span');
    badge.className = 'badge-default';
    badge.textContent = '기본 배송지';
    recipientBox.appendChild(badge);
  }
  btn.remove();
  alert('기본 배송지로 변경되었습니다.');
};

window.deleteShippingCard = function(btn) {
  if (confirm('이 배송지를 삭제하시겠습니까?')) {
    const card = btn.closest('.shipping-card');
    if (card) card.remove();
  }
};

// 6. 고객센터 (CS) FAQ & 1:1 문의
window.filterFaqItems = function(query) {
  const items = document.querySelectorAll('.faq-item');
  const q = query.toLowerCase().trim();
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(q)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

window.filterFaqCategory = function(cat, btn) {
  const chips = document.querySelectorAll('.cs-cat-chip');
  chips.forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    if (cat === 'all' || item.getAttribute('data-category') === cat) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

window.toggleFaq = function(element) {
  const faqItem = element.closest('.faq-item');
  if (faqItem) {
    faqItem.classList.toggle('open');
  }
};

window.openCsInquiryModal = function() {
  const modal = document.getElementById('cs-inquiry-modal');
  if (modal) modal.classList.add('open');
};

window.closeCsInquiryModal = function() {
  const modal = document.getElementById('cs-inquiry-modal');
  if (modal) modal.classList.remove('open');
};

window.submitCsInquiry = function() {
  const text = document.getElementById('cs-inquiry-text')?.value;
  if (!text || text.trim().length === 0) {
    alert('문의 내용을 입력해주세요.');
    return;
  }
  alert('1:1 문의가 제출되었습니다.\n담당자 확인 후 등록된 연락처로 답변을 드립니다.');
  closeCsInquiryModal();
};

// 7. 설정 (Settings) 토글 동작
window.toggleSettingState = function(settingName, isChecked) {
  if (settingName === '다크 모드') {
    if (isChecked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('viewlight_dark_mode', isChecked ? 'true' : 'false');
  }
  alert(`[${settingName}] 설정이 ${isChecked ? 'ON(켜짐)' : 'OFF(꺼짐)'}으로 변경되었습니다.`);
};

window.toggleGlowCursorSetting = function(isChecked) {
  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');
  if (dot && glow) {
    dot.style.display = isChecked ? 'block' : 'none';
    glow.style.display = isChecked ? 'block' : 'none';
  }
  if (isChecked) {
    document.body.classList.add('custom-cursor-active');
  } else {
    document.body.classList.remove('custom-cursor-active');
  }
  alert(`커스텀 GLOW 커서 효과가 ${isChecked ? '활성화' : '비활성화'}되었습니다.`);
};

// 16. 제품 둘러보기 화면 (view-category-all) 카드 스크롤 애니메이션 (Intersection Observer)
document.addEventListener('DOMContentLoaded', () => {
  const categoryCards = document.querySelectorAll('.category-list-card');
  if (categoryCards.length > 0 && 'IntersectionObserver' in window) {
    categoryCards.forEach(card => {
      card.classList.add('scroll-animate');
    });

    const observerOptions = {
      root: null, // 브라우저 뷰포트 기준
      rootMargin: '0px 0px -50px 0px', // 스크롤 감지 임계 영역 최적화
      threshold: 0.15
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // 한 번만 실행되도록 해제
        }
      });
    }, observerOptions);

    categoryCards.forEach(card => {
      cardObserver.observe(card);
    });
  }

  // 17.1. 로그인 상태 인터랙션 동기화
  window.updateLoginUI = function() {
    const isLoggedIn = localStorage.getItem('viewlight_logged_in') === 'true';
    const drawerLoginBtn = document.querySelector('.drawer-login-btn');
    const drawerFooter = document.querySelector('.menu-drawer-footer');

    if (isLoggedIn) {
      if (drawerLoginBtn) drawerLoginBtn.style.display = 'none';
      if (drawerFooter) drawerFooter.style.display = 'flex';
    } else {
      if (drawerLoginBtn) drawerLoginBtn.style.display = 'block';
      if (drawerFooter) drawerFooter.style.display = 'none';
    }

    // 로그인 상태 변경에 따른 장바구니 뱃지 즉시 동기화
    if (window.updateCartBadge) window.updateCartBadge();
  };

  // 로그아웃 버튼 이벤트 바인딩
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.setItem('viewlight_logged_in', 'false');
      window.updateLoginUI();
      if (window.showToast) window.showToast('로그아웃 되었습니다.');
      showView('home'); // 비로그인 전용 화면으로 롤백
    });
  }

  // 초기 로드 시 로그인 상태 UI 업데이트
  window.updateLoginUI();
});

// 17. 로그인 / 회원가입 모달 핸들러
window.openLoginModal = function() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('open');
    switchLoginTab('login'); // 기본 로그인 탭으로 초기화
  }
};

window.closeLoginModal = function() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('open');
    // 입력 폼 초기화
    document.getElementById('form-email-login')?.reset();
    document.getElementById('form-email-signup')?.reset();
    document.getElementById('form-email-find-password')?.reset();
  }
};

window.switchLoginTab = function(tab) {
  const loginForm = document.getElementById('login-form-wrapper');
  const signupForm = document.getElementById('signup-form-wrapper');
  const findForm = document.getElementById('find-password-form-wrapper');
  const title = document.getElementById('login-modal-title');
  const sub = document.getElementById('login-modal-sub');

  if (!loginForm || !signupForm || !findForm) return;

  if (tab === 'signup') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
    findForm.style.display = 'none';
    if (title) title.textContent = '이메일 회원가입';
    if (sub) sub.textContent = '이메일 주소로 빠르고 간편하게 가입하세요.';
  } else if (tab === 'find-password') {
    loginForm.style.display = 'none';
    signupForm.style.display = 'none';
    findForm.style.display = 'flex';
    if (title) title.textContent = '비밀번호 변경';
    if (sub) sub.textContent = '가입하신 이메일과 변경할 새 비밀번호를 입력해주세요.';
  } else {
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
    findForm.style.display = 'none';
    if (title) title.textContent = '로그인';
    if (sub) sub.textContent = 'ViewLight 회원만을 위한 특별한 조명 제어 혜택을 누리세요.';
  }
};

window.showToast = function(message, type = 'info') {
  let container = document.getElementById('global-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'global-toast-container';
    container.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1000000;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      pointer-events: none;
      width: calc(100% - 40px);
      max-width: 380px;
    `;
    document.body.appendChild(container);
  } else {
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.bottom = 'auto';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.zIndex = '1000000';
  }

  const toast = document.createElement('div');
  const isError = type === 'error';
  toast.style.cssText = `
    background: ${isError ? 'rgba(239, 68, 68, 0.95)' : 'rgba(15, 23, 42, 0.95)'};
    color: #FFFFFF;
    padding: 16px 22px;
    border-radius: 16px;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.5;
    text-align: center;
    white-space: pre-line;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(12px);
    border: 1px solid ${isError ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 171, 64, 0.3)'};
    opacity: 0;
    transform: scale(0.85) translateY(10px);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;
  toast.textContent = message;
  container.appendChild(toast);

  toast.offsetHeight; // reflow

  toast.style.opacity = '1';
  toast.style.transform = 'scale(1) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'scale(0.85) translateY(-10px)';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2500);
};

// 브라우저 기본 alert 창을 중앙 토스트 알림으로 대체
window.alert = function(message) {
  if (window.showToast) {
    window.showToast(message);
  }
};

// 비밀번호 오류 카운터 맵
let failedAttemptsMap = {};

window.handleSocialLogin = function(provider) {
  if (window.showToast) window.showToast(`[소셜 로그인] ${provider} 계정으로 로그인을 진행합니다.`);
  localStorage.setItem('viewlight_logged_in', 'true');
  if (window.updateLoginUI) window.updateLoginUI();
  closeLoginModal();
};

window.handleEmailLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value?.trim();
  const pw = document.getElementById('login-password')?.value;
  
  if (!email || !pw) return;

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem('viewlight_registered_users') || '[]');
  } catch(err) {
    users = [];
  }

  const user = users.find(u => u.email === email);
  
  // 미가입 이메일 체크
  if (!user) {
    if (email === 'test@email.com') {
      if (pw === '1234') {
        if (window.showToast) window.showToast('로그인이 완료되었습니다. 환영합니다!');
        localStorage.setItem('viewlight_logged_in', 'true');
        if (window.updateLoginUI) window.updateLoginUI();
        closeLoginModal();
      } else {
        failedAttemptsMap[email] = (failedAttemptsMap[email] || 0) + 1;
        if (failedAttemptsMap[email] >= 3) {
          const findWrapper = document.getElementById('password-find-wrapper');
          if (findWrapper) findWrapper.style.display = 'block';
        }
        if (window.showToast) window.showToast('비밀번호가 틀렸습니다.', 'error');
      }
    } else {
      if (window.showToast) window.showToast('존재하지 않는 이메일입니다.', 'error');
    }
    return;
  }

  // 비밀번호 불일치 체크
  if (user.password !== pw) {
    failedAttemptsMap[email] = (failedAttemptsMap[email] || 0) + 1;
    if (failedAttemptsMap[email] >= 3) {
      const findWrapper = document.getElementById('password-find-wrapper');
      if (findWrapper) findWrapper.style.display = 'block';
    }
    if (window.showToast) window.showToast('비밀번호가 틀렸습니다.', 'error');
    return;
  }

  // 로그인 성공
  failedAttemptsMap[email] = 0;
  const findWrapper = document.getElementById('password-find-wrapper');
  if (findWrapper) findWrapper.style.display = 'none';

  if (window.showToast) window.showToast('로그인이 완료되었습니다. 환영합니다!');
  localStorage.setItem('viewlight_logged_in', 'true');
  if (window.updateLoginUI) window.updateLoginUI();
  closeLoginModal();
};

window.handleEmailSignup = function(e) {
  e.preventDefault();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pw = document.getElementById('signup-password')?.value;
  const pwConfirm = document.getElementById('signup-password-confirm')?.value;

  if (!email || !pw) return;

  if (pw !== pwConfirm) {
    if (window.showToast) window.showToast('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.', 'error');
    return;
  }

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem('viewlight_registered_users') || '[]');
  } catch(err) {
    users = [];
  }

  const exists = users.some(u => u.email === email);
  if (exists) {
    if (window.showToast) window.showToast('이미 등록된 이메일 주소입니다.', 'error');
    return;
  }

  users.push({ email, password: pw });
  localStorage.setItem('viewlight_registered_users', JSON.stringify(users));

  if (window.showToast) window.showToast('회원가입이 완료되었습니다!');
  localStorage.setItem('viewlight_logged_in', 'true');
  if (window.updateLoginUI) window.updateLoginUI();
  closeLoginModal();
};

window.handleResetPassword = function(e) {
  e.preventDefault();
  const email = document.getElementById('find-email')?.value?.trim();
  const pw = document.getElementById('find-new-password')?.value;
  const pwConfirm = document.getElementById('find-new-password-confirm')?.value;

  if (!email || !pw) return;

  if (pw !== pwConfirm) {
    if (window.showToast) window.showToast('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.', 'error');
    return;
  }

  let users = [];
  try {
    users = JSON.parse(localStorage.getItem('viewlight_registered_users') || '[]');
  } catch(err) {
    users = [];
  }

  // 가입 여부 체크
  const userIdx = users.findIndex(u => u.email === email);
  if (userIdx === -1 && email !== 'test@email.com') {
    if (window.showToast) window.showToast('존재하지 않는 이메일입니다.', 'error');
    return;
  }

  // 비밀번호 덮어쓰기 및 업데이트
  if (email === 'test@email.com') {
    // 테스트용 임시 변경은 가상으로 성공 처리
  } else {
    users[userIdx].password = pw;
    localStorage.setItem('viewlight_registered_users', JSON.stringify(users));
  }

  // 횟수 초기화 및 버튼 숨김
  failedAttemptsMap[email] = 0;
  const findWrapper = document.getElementById('password-find-wrapper');
  if (findWrapper) findWrapper.style.display = 'none';

  if (window.showToast) window.showToast('비밀번호가 성공적으로 변경되었습니다!');
  switchLoginTab('login');
};

// ── 프로필 수정 기능 실장 ───────────────────────────────
let selectedAvatarPath = 'img/Stand01.jpg';

window.handleAvatarFileSelect = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    const dataUrl = e.target.result;
    selectedAvatarPath = dataUrl;
    
    // 프리셋 활성화 해제
    const presets = document.querySelectorAll('#edit-profile-modal .avatar-preset-item');
    presets.forEach(p => {
      p.classList.remove('active');
      p.style.borderColor = 'transparent';
    });
    
    // 파일 업로드 래퍼에 이미지 노출 및 테두리 효과
    const uploadWrapper = document.querySelector('.custom-upload-btn-wrapper');
    if (uploadWrapper) {
      uploadWrapper.classList.add('active');
      uploadWrapper.style.borderColor = 'var(--color-primary)';
      uploadWrapper.style.borderStyle = 'solid';
      
      let img = uploadWrapper.querySelector('.preview-uploaded-avatar');
      if (!img) {
        img = document.createElement('img');
        img.className = 'preview-uploaded-avatar';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        uploadWrapper.appendChild(img);
      }
      img.src = dataUrl;
      
      const icon = uploadWrapper.querySelector('.material-symbols-outlined');
      if (icon) icon.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
};

window.openEditProfileModal = function() {
  const modal = document.getElementById('edit-profile-modal');
  const nameInput = document.getElementById('edit-profile-name');
  const nameText = document.getElementById('profile-name-text');
  
  if (nameText && nameInput) {
    nameInput.value = nameText.textContent.trim();
  }
  
  // 현재 아바타 경로 읽어 프리셋 활성화 매칭
  const currentAvatar = document.getElementById('profile-avatar-img');
  if (currentAvatar) {
    const src = currentAvatar.getAttribute('src');
    selectedAvatarPath = src;
    
    const presets = document.querySelectorAll('#edit-profile-modal .avatar-preset-item');
    presets.forEach(p => {
      // 파일 업로드 래퍼는 제외
      if (p.classList.contains('custom-upload-btn-wrapper')) return;
      
      const img = p.querySelector('img');
      if (img && img.getAttribute('src') === src) {
        p.classList.add('active');
        p.style.borderColor = 'var(--color-primary)';
      } else {
        p.classList.remove('active');
        p.style.borderColor = 'transparent';
      }
    });

    // 커스텀 이미지인 경우의 매칭
    const isPreset = ['img/Stand01.jpg', 'img/Stand02.png', 'img/Stand03.png'].includes(src);
    const uploadWrapper = document.querySelector('.custom-upload-btn-wrapper');
    if (!isPreset && uploadWrapper) {
      uploadWrapper.classList.add('active');
      uploadWrapper.style.borderColor = 'var(--color-primary)';
      uploadWrapper.style.borderStyle = 'solid';
      
      let img = uploadWrapper.querySelector('.preview-uploaded-avatar');
      if (!img) {
        img = document.createElement('img');
        img.className = 'preview-uploaded-avatar';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        uploadWrapper.appendChild(img);
      }
      img.src = src;
      
      const icon = uploadWrapper.querySelector('.material-symbols-outlined');
      if (icon) icon.style.display = 'none';
    } else if (uploadWrapper) {
      uploadWrapper.classList.remove('active');
      uploadWrapper.style.borderColor = '#bbb';
      uploadWrapper.style.borderStyle = 'dashed';
      
      const img = uploadWrapper.querySelector('.preview-uploaded-avatar');
      if (img) img.remove();
      
      const icon = uploadWrapper.querySelector('.material-symbols-outlined');
      if (icon) icon.style.display = 'block';
    }
  }

  if (modal) {
    modal.classList.add('active');
  }
};

window.closeEditProfileModal = function() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) {
    modal.classList.remove('active');
  }
};

window.selectAvatarPreset = function(path, element) {
  selectedAvatarPath = path;
  const presets = document.querySelectorAll('#edit-profile-modal .avatar-preset-item');
  presets.forEach(p => {
    p.classList.remove('active');
    p.style.borderColor = 'transparent';
  });
  element.classList.add('active');
  element.style.borderColor = 'var(--color-primary)';

  // 파일 업로드 프리뷰 제거
  const uploadWrapper = document.querySelector('.custom-upload-btn-wrapper');
  if (uploadWrapper) {
    uploadWrapper.classList.remove('active');
    uploadWrapper.style.borderColor = '#bbb';
    uploadWrapper.style.borderStyle = 'dashed';
    
    const img = uploadWrapper.querySelector('.preview-uploaded-avatar');
    if (img) img.remove();
    
    const icon = uploadWrapper.querySelector('.material-symbols-outlined');
    if (icon) icon.style.display = 'block';
  }
  // 파일 인풋 값 리셋
  const fileInput = document.getElementById('avatar-file-input');
  if (fileInput) fileInput.value = '';
};

window.handleSaveProfile = function(event) {
  event.preventDefault();
  const nameInput = document.getElementById('edit-profile-name');
  const nameText = document.getElementById('profile-name-text');
  const avatarImg = document.getElementById('profile-avatar-img');
  const drawerAvatarImg = document.querySelector('.user-profile .avatar-img');
  const drawerUserNameText = document.querySelector('.user-profile .user-name strong');

  if (nameInput && nameInput.value.trim()) {
    const newName = nameInput.value.trim();
    
    // 화면 텍스트 실시간 동기화
    if (nameText) nameText.textContent = newName;
    if (drawerUserNameText) drawerUserNameText.textContent = `'${newName}'`;
    
    // 아바타 이미지 실시간 동기화
    if (avatarImg) avatarImg.setAttribute('src', selectedAvatarPath);
    if (drawerAvatarImg) drawerAvatarImg.setAttribute('src', selectedAvatarPath);
    
    // 로컬스토리지에도 보관하여 지속성 유지
    localStorage.setItem('viewlight_username', newName);
    localStorage.setItem('viewlight_avatar', selectedAvatarPath);

    if (window.showToast) window.showToast('프로필이 성공적으로 변경되었습니다!');
    window.closeEditProfileModal();
  }
};

// 페이지 로드 시 기존 커스텀 프로필 복구
window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('viewlight_username');
  const savedAvatar = localStorage.getItem('viewlight_avatar');
  
  if (savedName) {
    const nameText = document.getElementById('profile-name-text');
    const drawerUserNameText = document.querySelector('.user-profile .user-name strong');
    if (nameText) nameText.textContent = savedName;
    if (drawerUserNameText) drawerUserNameText.textContent = `'${savedName}'`;
  }
  
  if (savedAvatar) {
    const avatarImg = document.getElementById('profile-avatar-img');
    const drawerAvatarImg = document.querySelector('.user-profile .avatar-img');
    if (avatarImg) avatarImg.setAttribute('src', savedAvatar);
    if (drawerAvatarImg) drawerAvatarImg.setAttribute('src', savedAvatar);
  }
});

// ── 큐레이션 리포트 목록 / 상세 ─────────────────────────────

const reportDataMap = {
  'wood-cream': {
    title: '내 방 책상 - 우드&크림',
    date: '2026.08.10 AI 분석',
    img: "img/livingroom.jpg",
    desc: '분석된 공간은 부드러운 자연광과 뉴트럴한 색조가 돋보입니다. 따뜻한 조명은 나무의 자연스러운 질감과 어우러져 피로를 덜어주고 집중력을 높이는 데 도움이 됩니다.',
    tags: ['따뜻한 웜 미니멀리스트', '부드러운 베이지 톤', '로우 컨트라스트'],
    score: 98,
    scenes: [
      { title: '집중된 안락함', desc: '드라마틱하고 낮게 드리워진 펜던트 조명', price: '490,000원', img: 'img/light009.jpg', key: 'aurora-brass', label: 'SCENE 01' },
      { title: '앰비언트 모드', desc: '부드럽고 자연스럽게 스며드는 간접 조명', price: '200,000원', img: 'img/Stand03.png', key: 'neo-able', label: 'SCENE 02' },
      { title: '자연광 시너지', desc: '천연 우드 결이 자연광 반사 무드와 극치 융합', price: '75,000원', img: 'img/light001.jpg', key: 'wood-hexa', label: 'SCENE 03' },
      { title: '스마트 큐브 셋업', desc: '다채로운 색조 조합을 모바일로 실시간 컨트롤', price: '49,000원', img: 'img/light004.jpg', key: 'smart-cube', label: 'SCENE 04' },
    ]
  },
  'dark-ambient': {
    title: '거실 소파 - 다크 앰비언트',
    date: '2026.07.22 AI 분석',
    img: "img/light009.jpg",
    desc: '깊은 어두움 속 포인트 조명이 드라마틱한 분위기를 연출합니다. 하이 컨트라스트 무드가 공간에 깊이와 고급스러움을 더해줍니다.',
    tags: ['다크 무드', '하이 컨트라스트', '드라마틱 포인트'],
    score: 94,
    scenes: [
      { title: '뮤트 골드 펜던트', desc: '황금빛 포인트 조명이 다크 배경과 조화', price: '450,000원', img: 'img/light009.jpg', key: 'aurora-brass', label: 'SCENE 01' },
      { title: '딥 앰비언트 스트립', desc: 'RGB 스트립이 만드는 몰입감 있는 벽면 무드', price: '62,000원', img: 'img/Stand04.png', key: 'ambient-strip', label: 'SCENE 02' },
      { title: '무드 플로어 하프', desc: '반투명 갓에서 퍼지는 부드러운 하향 조명', price: '90,000원', img: 'img/Stand02.png', key: 'lumina-floor', label: 'SCENE 03' },
    ]
  },
  'night-relax': {
    title: '침실 - 나이트 릴렉스',
    date: '2026.07.05 AI 분석',
    img: "img/light001.jpg",
    desc: '취침 전 긴장을 풀어주는 2700K 이하의 따뜻한 저조도 조명 세팅이 이상적입니다. 소프트한 간접광이 수면의 질을 높여줍니다.',
    tags: ['소프트 라이트', '로우 컨트라스트', '2700K 웜'],
    score: 91,
    scenes: [
      { title: '자연광 우드 헥사', desc: '우드 프레임 육각 조명의 따뜻한 저녁빛', price: '75,000원', img: 'img/light001.jpg', key: 'wood-hexa', label: 'SCENE 01' },
      { title: '루미나 플로어 하프', desc: '아래로 은은하게 퍼지는 나이트 스탠드 무드', price: '90,000원', img: 'img/Stand01.jpg', key: 'lumina-floor', label: 'SCENE 02' },
    ]
  },
  'focus-mode': {
    title: '홈 오피스 - 포커스 모드',
    date: '2026.06.18 AI 분석',
    img: "img/light004.jpg",
    desc: '업무 집중도를 극대화하는 5000K~6500K의 쿨 화이트 조명 환경입니다. 피로 없이 장시간 집중이 가능하도록 색온도와 조도를 최적화했습니다.',
    tags: ['쿨 화이트', '고집중 셋업', '6500K 데이라이트'],
    score: 96,
    scenes: [
      { title: '스마트 큐브 데스크', desc: '쿨 화이트 색온도로 업무 효율 극대화', price: '49,000원', img: 'img/light004.jpg', key: 'smart-cube', label: 'SCENE 01' },
      { title: '오로라 브라스 집중등', desc: '황동 암 아래 집중되는 하향 작업 조명', price: '320,000원', img: 'img/Stand01.jpg', key: 'aurora-brass', label: 'SCENE 02' },
    ]
  }
};

window.openReportDetail = function(reportKey) {
  const data = reportDataMap[reportKey];
  if (!data) return;

  // 히어로 이미지 & 텍스트 업데이트
  const heroImg = document.getElementById('report-hero-img');
  const heroTitle = document.getElementById('report-hero-title');
  const heroDate = document.getElementById('report-hero-date');
  const heroTag = document.getElementById('report-hero-tag');
  if (heroImg) heroImg.style.backgroundImage = `url('${data.img}')`;
  if (heroTitle) heroTitle.textContent = data.title;
  if (heroDate) heroDate.textContent = data.date;
  if (heroTag) heroTag.textContent = 'ANALYSIS';

  // 설명 & 태그 업데이트
  const descEl = document.getElementById('report-detail-desc');
  const tagsEl = document.getElementById('report-detail-tags');
  if (descEl) descEl.textContent = data.desc;
  if (tagsEl) {
    tagsEl.innerHTML = data.tags.map(t => `<span class="report-summary-tag">${t}</span>`).join('');
  }

  // 스코어 업데이트
  const scoreVal = document.getElementById('report-score-val');
  const scoreFill = document.getElementById('report-score-fill');
  if (scoreVal) scoreVal.textContent = data.score + '%';
  if (scoreFill) {
    scoreFill.style.width = '0%';
    setTimeout(() => { scoreFill.style.width = data.score + '%'; }, 100);
  }

  // 추천 카드 캐러셀 업데이트
  const carousel = document.getElementById('report-carousel');
  if (carousel) {
    carousel.innerHTML = data.scenes.map(s => `
      <div class="report-rec-card" onclick="openProductDetail('${s.key}')">
        <div class="report-card-img-box">
          <img src="${s.img}" alt="${s.title}">
          <span class="scene-badge">${s.label}</span>
        </div>
        <div class="report-card-body">
          <h5 class="report-card-title">${s.title}</h5>
          <p class="report-card-desc">${s.desc}</p>
          <span class="report-card-price">${s.price}</span>
        </div>
      </div>
    `).join('');
  }

  // 현재 어떤 리포트 상세인지 키값 저장
  window.currentReportKey = reportKey;

  // 헤더 타이틀 변경
  const viewTitle = document.getElementById('report-view-title');
  if (viewTitle) viewTitle.textContent = data.title;

  // 패널 전환: 목록 숨기고 상세 노출
  const listPanel = document.getElementById('report-list-panel');
  const detailPanel = document.getElementById('report-detail-panel');
  if (listPanel) listPanel.style.display = 'none';
  if (detailPanel) {
    detailPanel.style.display = 'flex';
    detailPanel.scrollTop = 0;
  }
};

window.handleReportBack = function() {
  const listPanel = document.getElementById('report-list-panel');
  const detailPanel = document.getElementById('report-detail-panel');
  const viewTitle = document.getElementById('report-view-title');

  // 상세 화면이 보이는 경우: 목록으로 복귀
  if (detailPanel && detailPanel.style.display !== 'none') {
    detailPanel.style.display = 'none';
    if (listPanel) listPanel.style.display = 'flex';
    if (viewTitle) viewTitle.textContent = 'AI 큐레이션 리포트';
  } else {
    // 목록 화면: 이전 뷰(마이페이지)로 이동
    showView('mypage');
  }
};

// ── 추천 무드등 전체보기 모달 기능 실장 ────────────────────────

let selectedRecItems = []; // 현재 선택된 아이템 key 배열

window.openRecAllModal = function() {
  const modal = document.getElementById('rec-all-modal');
  if (!modal) return;

  const data = reportDataMap[window.currentReportKey];
  if (!data) return;

  // 모달 서브 텍스트에 공간 이름 반영
  const subText = document.getElementById('rec-all-sub-text');
  if (subText) subText.textContent = `'${data.title}' 리포트의 모든 추천 무드등`;

  // 기본적으로 전체 선택 상태로 로드
  selectedRecItems = data.scenes.map(s => s.key);

  renderRecAllList(data);
  updateRecAllSelectBar();

  modal.classList.add('active');
};

window.closeRecAllModal = function() {
  const modal = document.getElementById('rec-all-modal');
  if (modal) modal.classList.remove('active');
};

function renderRecAllList(data) {
  const container = document.getElementById('rec-all-list');
  if (!container) return;

  container.innerHTML = data.scenes.map(s => {
    const isSelected = selectedRecItems.includes(s.key);
    return `
      <div class="rec-all-item ${isSelected ? 'selected' : ''}" onclick="toggleSelectRecItem('${s.key}', event)">
        <span class="material-symbols-outlined rec-all-item-check">
          ${isSelected ? 'check_box' : 'check_box_outline_blank'}
        </span>
        <img class="rec-all-item-img" src="${s.img}" alt="${s.title}">
        <div class="rec-all-item-info">
          <h4 class="rec-all-item-title">${s.title}</h4>
          <p class="rec-all-item-desc">${s.desc}</p>
          <span class="rec-all-item-price">${s.price}</span>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleSelectRecItem = function(key, event) {
  // 이벤트 버블링 차단
  if (event) event.stopPropagation();

  const index = selectedRecItems.indexOf(key);
  if (index > -1) {
    selectedRecItems.splice(index, 1);
  } else {
    selectedRecItems.push(key);
  }

  const data = reportDataMap[window.currentReportKey];
  renderRecAllList(data);
  updateRecAllSelectBar();
};

window.toggleSelectAllRec = function() {
  const data = reportDataMap[window.currentReportKey];
  if (!data) return;

  const allKeys = data.scenes.map(s => s.key);
  const toggleBtn = document.getElementById('rec-all-toggle-all');

  if (selectedRecItems.length === allKeys.length) {
    // 이미 전체 선택된 상태 -> 전체 해제
    selectedRecItems = [];
    if (toggleBtn) toggleBtn.textContent = '전체 선택';
  } else {
    // 전체 선택
    selectedRecItems = allKeys;
    if (toggleBtn) toggleBtn.textContent = '전체 해제';
  }

  renderRecAllList(data);
  updateRecAllSelectBar();
};

function updateRecAllSelectBar() {
  const data = reportDataMap[window.currentReportKey];
  if (!data) return;

  const countEl = document.getElementById('rec-all-select-count');
  if (countEl) countEl.textContent = `${selectedRecItems.length}개 선택됨`;

  const toggleBtn = document.getElementById('rec-all-toggle-all');
  if (toggleBtn) {
    if (selectedRecItems.length === data.scenes.length) {
      toggleBtn.textContent = '전체 해제';
    } else {
      toggleBtn.textContent = '전체 선택';
    }
  }

  // 하단 버튼 텍스트 업데이트
  const btnText = document.getElementById('rec-all-cart-btn-text');
  if (btnText) {
    btnText.textContent = `${selectedRecItems.length}개 항목 장바구니에 담기`;
  }
}

window.addSelectedRecToCart = function() {
  if (selectedRecItems.length === 0) {
    if (window.showToast) window.showToast('선택된 조명이 없습니다.', 'error');
    return;
  }

  const data = reportDataMap[window.currentReportKey];
  if (!data) return;

  let addedCount = 0;
  selectedRecItems.forEach(key => {
    const scene = data.scenes.find(s => s.key === key);
    if (scene) {
      const priceVal = parseInt(scene.price.replace(/,/g, '').replace('원', ''));
      if (window.addProductToCart) {
        window.addProductToCart(scene.title, priceVal, scene.img);
        addedCount++;
      }
    }
  });

  if (addedCount > 0) {
    closeRecAllModal();
  }
};


