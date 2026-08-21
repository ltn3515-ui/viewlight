import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { CustomCursor } from './components/common/CustomCursor';
import { WishlistProvider } from './context/WishlistContext';


import { HomePage } from './pages/HomePage';
import { CommendPage } from './pages/CommendPage';
import { SplashPage } from './pages/SplashPage';
import { CategoryAllPage } from './pages/CategoryAllPage';
import { FeaturedMorePage } from './pages/FeaturedMorePage';
import { MyPage } from './pages/MyPage';
import { BnaAllPage } from './pages/BnaAllPage';
import { StoryPage } from './pages/StoryPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailPage } from './pages/PaymentFailPage';

import { AuthModal } from './components/modals/AuthModal';
import { CartDrawer } from './components/modals/CartDrawer';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { SearchModal } from './components/modals/SearchModal';
import { NotificationModal } from './components/modals/NotificationModal';
import { CouponModal } from './components/modals/CouponModal';
import { SettingsDrawer } from './components/modals/SettingsDrawer';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { MenuDrawer } from './components/modals/MenuDrawer';
import { AiTechModal } from './components/modals/AiTechModal';
import { ScanGuideModal } from './components/modals/ScanGuideModal';
import { CameraScanModal } from './components/modals/CameraScanModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { OrderHistoryModal } from './components/modals/OrderHistoryModal';
import { MyReviewsModal } from './components/modals/MyReviewsModal';
import { ImageViewerModal } from './components/modals/ImageViewerModal';
import { WishlistModal } from './components/modals/WishlistModal';
import { LoginGuideModal } from './components/modals/LoginGuideModal';


export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ModalProvider>
            <CartProvider>
              <WishlistProvider>
                <GlobalStyle />
                <CustomCursor />
                <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/commend" element={<CommendPage />} />
                  <Route path="/splash" element={<SplashPage />} />
                  <Route path="/category-all" element={<CategoryAllPage />} />
                  <Route path="/featured-more" element={<FeaturedMorePage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/bna-all" element={<BnaAllPage />} />
                  <Route path="/story" element={<StoryPage />} />
                  <Route path="/payment/success" element={<PaymentSuccessPage />} />
                  <Route path="/payment/fail" element={<PaymentFailPage />} />
                </Routes>

                {/* Modals & Drawers must be inside BrowserRouter for useNavigate to work! */}
                <MenuDrawer />
                <AuthModal />
                <CartDrawer />
                <CheckoutModal />
                <SearchModal />
                <NotificationModal />
                <CouponModal />
                <SettingsDrawer />
                <ProductDetailModal />
                <AiTechModal />
                <ScanGuideModal />
                <CameraScanModal />
                <EditProfileModal />
                <OrderHistoryModal />
                <MyReviewsModal />
                <ImageViewerModal />
                <WishlistModal />
                <LoginGuideModal />
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </ModalProvider>
      </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
