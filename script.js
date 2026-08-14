document.addEventListener('DOMContentLoaded', () => {

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

  function showView(viewId) {
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
    }
    
    // Update bottom tab items active state
    tabItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if ((viewId === 'home' || viewId === 'featured-more' || viewId === 'category-all' || viewId === 'bna-all' || viewId === 'product-detail' || viewId === 'checkout') && href === '#home') item.classList.add('active');
      if (viewId === 'scan' && href === '#ai') item.classList.add('active');
      if (viewId === 'cart' && href === '#cart') item.classList.add('active');
      if (viewId === 'mypage' && href === '#mypage') item.classList.add('active');
    });
  }

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
      alert(`[${categoryName}] 카테고리 목록으로 이동합니다.`);
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

  const heroCollectionBtn = document.querySelector('.hero-sub-btn[href="#collection"]');
  if (heroCollectionBtn) {
    heroCollectionBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('category-all');
    });
  }

  // 7. 뒤로가기 및 탭바 이동 처리
  const backToHomeBtn = document.getElementById('btn-back-to-home');
  if (backToHomeBtn) {
    backToHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
    });
  }

  const scanBackBtn = document.getElementById('btn-scan-back');
  if (scanBackBtn) {
    scanBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
    });
  }

  const scanHomeGoBtn = document.getElementById('btn-scan-home-go');
  if (scanHomeGoBtn) {
    scanHomeGoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
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
      showView('home');
    });
  }

  const cartCheckoutBtn = document.getElementById('btn-cart-checkout');
  if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const itemCards = document.querySelectorAll('.cart-item-card');
      if (itemCards.length === 0) {
        alert('🛒 장바구니가 비어 있습니다. 제품을 담은 후 주문해 주세요!');
        return;
      }
      showView('checkout');
    });
  }

  const mypageBackBtn = document.getElementById('btn-mypage-back');
  if (mypageBackBtn) {
    mypageBackBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
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
      showView('home');
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
      showView('home');
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
      showView('home');
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
    btnCartCheckout.addEventListener('click', () => {
      const totalPriceText = document.getElementById('cart-total-price').textContent;
      alert(`💳 총 결제 금액 [${totalPriceText}] 주문서 접수 및 결제가 최종 완료되었습니다!`);
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

  // 13.1. 제품 데이터 목록 정의
  const productsData = {
    "aurora-brass": {
      name: "오로라 브라스 펜던트",
      price: 90000,
      img: "img/light009.jpg",
      match: "98%",
      desc: "부드럽고 따뜻한 빛을 선사하는 우아한 매트 피니시 펜던트 무드연출 조명입니다.",
      specs: ["2700K~6500K", "1200 Lux", "스마트 App 연동"],
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
    "aura-floor": {
      name: "아우라 플로어 램프",
      price: 180000,
      img: "img/Stand03.png",
      match: "98%",
      desc: "내추럴한 거실 분위기에 은은하게 매칭되는 앰비언트 램프로, 5단계 조도 조절 기능이 어두운 야간 무드에 최적의 빛을 선사합니다.",
      specs: ["2200K~4000K", "1500 Lux", "터치식 무단계 조절"],
      insight: "거실 소파 옆이나 빈 벽면 구석 코너에 빛을 쏘아 올려 벽면 반사광을 통한 따뜻하고 깊은 입체감을 줍니다.",
      colors: ["#3A3B3C", "#C0C0C0", "#EBEBEB"]
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
    "ambient-strip": {
      name: "엠비언트 스트립",
      price: 62000,
      img: "img/Stand04.png",
      match: "97%",
      desc: "TV 배후나 침대 헤드 뒤에 부착하여 미세한 색상 조절로 공간의 깊이감을 더해주는 부착형 스마트 LED 라이트 스트립입니다.",
      specs: ["RGBIC 멀티컬러", "600 Lux", "스마트 App & 소리반응"],
      insight: "음악이나 소리에 맞춰 반응하는 인터랙티브 모션 라이팅으로 홈시네마 분위기를 한 차원 업그레이드합니다.",
      colors: ["#FFFFFF", "#000000"]
    }
  };

  let activeProductKey = "aurora-brass"; // 현재 열려있는 상품의 키

  // 13.2. 실시간 장바구니 추가 로직
  window.addProductToCart = function(name, price, img) {
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
      alert(`🛒 [${name}]가 장바구니에 추가되었습니다!\n3개 품목 이상으로 세트 20% 할인 혜택이 적용됩니다.`);
    }
  };

  // 13.3. 상세 정보 화면에 제품 바인딩 및 노출
  window.openProductDetail = function(productKey) {
    const data = productsData[productKey];
    if (!data) return;
    
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
    if (pdSpec1) pdSpec1.textContent = data.specs[0];
    if (pdSpec2) pdSpec2.textContent = data.specs[1];
    if (pdSpec3) pdSpec3.textContent = data.specs[2];
    if (pdInsightDesc) pdInsightDesc.textContent = data.insight;
    
    // 컬러 파레트 채우기
    if (pdColorContainer) {
      let colorHtml = '';
      data.colors.forEach((color, idx) => {
        const activeClass = (idx === 0) ? 'active' : '';
        colorHtml += `<span class="pd-color-circle ${activeClass}" style="background-color: ${color};" onclick="selectPdColor(this)"></span>`;
      });
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
      showView('home');
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
        alert(`🛍️ [${data.name}] 바로 구매 페이지로 이동합니다.`);
      }
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
  
  window.initCheckoutView = function() {
    // 장바구니 아이템들을 검사하여 대표 이미지 및 가격 등을 로드
    const itemCards = document.querySelectorAll('.cart-item-card');
    const totalQtyVal = document.getElementById('cart-total-count') ? parseInt(document.getElementById('cart-total-count').textContent) : 0;
    const totalPriceVal = document.getElementById('cart-total-price') ? document.getElementById('cart-total-price').textContent : "0원";
    
    // 대표 상품 로드
    if (itemCards.length > 0) {
      const firstCard = itemCards[0];
      const imgTag = firstCard.querySelector('.cart-item-thumb img');
      const nameTag = firstCard.querySelector('.cart-item-name');
      const priceLabel = firstCard.querySelector('.cart-item-price-label');
      
      if (imgTag && nameTag && priceLabel) {
        // 대표 뷰 세팅
        const mainImg = document.getElementById('checkout-main-img');
        const mainTitle = document.getElementById('checkout-main-title');
        const mainPriceBadge = document.getElementById('checkout-main-price-badge');
        
        if (mainImg) mainImg.src = imgTag.src;
        if (mainTitle) mainTitle.textContent = nameTag.textContent;
        if (mainPriceBadge) mainPriceBadge.textContent = priceLabel.textContent;
      }
      
      // 양 옆 플랭크 이미지 썸네일 세팅
      const sideLeftImg = document.getElementById('checkout-side-img-left');
      const sideRightImg = document.getElementById('checkout-side-img-right');
      
      if (itemCards.length > 1) {
        const secondCard = itemCards[1];
        const secondImg = secondCard.querySelector('.cart-item-thumb img');
        if (sideLeftImg && secondImg) sideLeftImg.src = secondImg.src;
      } else {
        if (sideLeftImg) sideLeftImg.src = "img/light005.jpg";
      }
      
      if (itemCards.length > 2) {
        const thirdCard = itemCards[2];
        const thirdImg = thirdCard.querySelector('.cart-item-thumb img');
        if (sideRightImg && thirdImg) sideRightImg.src = thirdImg.src;
      } else {
        if (sideRightImg) sideRightImg.src = "img/light006.jpg";
      }
    } else {
      // 장바구니가 비어 있을 시 기본 셋업 복귀
      const mainImg = document.getElementById('checkout-main-img');
      const mainTitle = document.getElementById('checkout-main-title');
      const mainPriceBadge = document.getElementById('checkout-main-price-badge');
      if (mainImg) mainImg.src = "img/light009.jpg";
      if (mainTitle) mainTitle.textContent = "램프 스웜";
      if (mainPriceBadge) mainPriceBadge.textContent = "90,000원";
    }

    // 총 금액 및 총 개수 동기화
    const checkoutTotalPrice = document.getElementById('checkout-total-price');
    const checkoutTotalQty = document.getElementById('checkout-total-qty');
    const btnSubmitText = document.getElementById('btn-checkout-submit-text');
    
    if (checkoutTotalPrice) checkoutTotalPrice.textContent = totalPriceVal;
    if (checkoutTotalQty) checkoutTotalQty.textContent = totalQtyVal;
    if (btnSubmitText) btnSubmitText.textContent = `${totalPriceVal} 결제하기`;
    
    currentCheckoutTotalPrice = totalPriceVal;
    
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
      showView('cart');
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
      
      // 장바구니 비우기
      const container = document.getElementById('cart-items-container');
      if (container) {
        container.innerHTML = '';
      }
      
      // 장바구니 갱신 및 홈으로 이동
      if (window.updateCartTotals) window.updateCartTotals();
      showView('home');
    });
  }
});
