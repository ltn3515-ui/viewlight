import React from 'react';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { BottomNav } from '../components/common/BottomNav';
import { HeroBanner } from '../components/home/HeroBanner';
import { AiScanSection } from '../components/home/AiScanSection';
import { ProductGrid } from '../components/home/ProductGrid';
import { TransformationSection } from '../components/home/TransformationSection';
import { ReviewSection } from '../components/home/ReviewSection';
import { FaqSection } from '../components/home/FaqSection';

export const HomePage: React.FC = () => {
  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-home" className="mobile-view active">
          <Header />
          <div className="service-content">
            <HeroBanner />
            <AiScanSection />
            <ProductGrid />
            <TransformationSection />
            <ReviewSection />
            <FaqSection />
            <Footer />
          </div>
          <BottomNav />
        </div>
      </main>
    </div>
  );
};
