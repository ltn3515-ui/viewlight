import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles/GlobalStyle';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { CustomCursor } from './components/common/CustomCursor';

import { HomePage } from './pages/HomePage';
import { CommendPage } from './pages/CommendPage';
import { SplashPage } from './pages/SplashPage';
import { CategoryAllPage } from './pages/CategoryAllPage';
import { FeaturedMorePage } from './pages/FeaturedMorePage';
import { MyPage } from './pages/MyPage';
import { BnaAllPage } from './pages/BnaAllPage';
import { StoryPage } from './pages/StoryPage';

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

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <AuthProvider>
            <ModalProvider>
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
              </BrowserRouter>
            </ModalProvider>
          </AuthProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};
