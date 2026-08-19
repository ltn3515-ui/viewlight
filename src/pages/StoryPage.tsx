import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DesktopBrand } from '../components/home/DesktopBrand';
import { BottomNav } from '../components/common/BottomNav';
import { useModal } from '../context/ModalContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 20px;
  gap: 28px;
  background: var(--color-bg-cream, #FAF9F6);
`;

const HeroCard = styled.div`
  width: 100%;
  height: 380px;
  border-radius: 24px;
  position: relative;
  background-image: url('img/livingroom.jpg');
  background-size: cover;
  background-position: center;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--color-border, #E2E8F0);
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 30%, rgba(0, 0, 0, 0.85) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 28px 24px;
`;

const HeroTitle = styled.h2`
  font-size: 1.7rem;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1.35;
  letter-spacing: -0.5px;
  word-break: keep-all;
`;

const HeroSub = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
  line-height: 1.45;
  word-break: keep-all;
`;

const TechCard = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #FAF5EB 0%, #F3EDE0 100%);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid var(--color-border, #E2E8F0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.02);

  body.dark-mode & {
    background: linear-gradient(135deg, #1E293B 0%, #111827 100%);
  }
`;

const TechTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-main, #121826);
  line-height: 1.45;
  word-break: keep-all;
`;

const AccentText = styled.span`
  display: block;
  font-size: 1.35rem;
  font-weight: 900;
  background: linear-gradient(90deg, #FFAB40 0%, #FF8F00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-top: 4px;
`;

const TechDesc = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--color-text-sub, #64748B);
  line-height: 1.6;
  margin-top: 16px;
  word-break: keep-all;
`;

const SectionTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--color-text-main, #121826);
  margin-top: 8px;
  margin-bottom: 4px;
  letter-spacing: -0.3px;
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StepCard = styled.div`
  width: 100%;
  background: var(--color-bg-card, #FFFFFF);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--color-border, #E2E8F0);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IconCircle = styled.div<{ $bgColor: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: ${props => props.$bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  span {
    font-size: 1.4rem;
  }
`;

const StepTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-text-main, #121826);
`;

const StepDesc = styled.p`
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-sub, #64748B);
  line-height: 1.5;
  word-break: keep-all;
`;

const FooterBanner = styled.div`
  width: 100%;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
  margin-top: 12px;
`;

const FooterText = styled.p`
  font-size: 1.2rem;
  font-weight: 800;
  color: #FFFFFF;
  line-height: 1.55;
  word-break: keep-all;
  white-space: pre-line;
`;

export const StoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal, unreadNotiCount } = useModal();

  return (
    <div className="app-container">
      <DesktopBrand />
      <main className="mobile-service-section">
        <div id="view-story" className="mobile-view active">
          {/* 상단바 */}
          <header className="service-header" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="header-icon-btn back-btn"
              onClick={() => navigate('/')}
              title="뒤로가기"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: 'var(--color-text-main, #121826)' }}>chevron_left</span>
            </button>
            <div className="service-logo">
              <span className="service-logo-text" onClick={() => navigate('/')} style={{ cursor: 'pointer', fontSize: '1.4rem', fontWeight: 800 }}>
                ViewLight
              </span>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="header-icon-btn"
                onClick={() => openModal('notification')}
                title="알림"
                style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', color: 'var(--color-text-main, #121826)' }}>notifications</span>
                {unreadNotiCount > 0 && (
                  <span className="noti-badge" style={{
                    position: 'absolute',
                    top: '-1px',
                    right: '-1px',
                    background: '#EF4444',
                    color: '#FFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderRadius: '50%',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    border: '2px solid #FFF',
                    boxSizing: 'border-box',
                  }}>{unreadNotiCount}</span>
                )}
              </button>
            </div>
          </header>

          {/* 스크롤 콘텐츠 영역 */}
          <div className="service-content story-content" style={{ overflowY: 'auto', paddingBottom: '80px' }}>
            <Container>
              {/* 1. 메인 히어로 카드 */}
              <HeroCard>
                <HeroOverlay>
                  <HeroTitle>공간을 완성하는 무드등, 뷰라이트 스토리</HeroTitle>
                  <HeroSub>단순히 전구를 파는 것이 아니라, 완벽한 분위기를 연출합니다.</HeroSub>
                </HeroOverlay>
              </HeroCard>

              {/* 2. 테크 카드 섹션 */}
              <TechCard>
                <TechTitle>
                  단순한 무드등을 넘어,
                  <br />
                  당신의 삶을 이해하는
                  <AccentText>AI 앰비언트 테크</AccentText>
                </TechTitle>
                <TechDesc>
                  우리는 무드등을 파는 것이 아닙니다. 당신의 일상 공간을 분석하고, 그 순간에 가장 완벽한 분위기를 선사하는 큐레이터입니다.
                </TechDesc>
              </TechCard>

              {/* 3. How ViewLight Works 섹션 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <SectionTitle>How ViewLight Works</SectionTitle>
                
                <StepList>
                  {/* 스캔 */}
                  <StepCard>
                    <IconCircle $bgColor="var(--color-text-main, #121826)">
                      <span className="material-symbols-outlined" style={{ color: '#FFFFFF' }}>filter_center_focus</span>
                    </IconCircle>
                    <div>
                      <StepTitle>1. Scan</StepTitle>
                      <StepDesc style={{ marginTop: '4px' }}>스마트폰 카메라로 당신의 공간을 스캔하세요. 구조, 가구, 자연광을 인식합니다.</StepDesc>
                    </div>
                  </StepCard>

                  {/* 분석 */}
                  <StepCard>
                    <IconCircle $bgColor="var(--color-accent, #FFAB40)">
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-text-main, #121826)' }}>equalizer</span>
                    </IconCircle>
                    <div>
                      <StepTitle>2. Analyze</StepTitle>
                      <StepDesc style={{ marginTop: '4px' }}>AI 비전 기술이 공간의 톤앤매너와 현재 시간을 분석하여 최적의 무드등 조도를 계산합니다.</StepDesc>
                    </div>
                  </StepCard>

                  {/* 큐레이팅 */}
                  <StepCard>
                    <IconCircle $bgColor="var(--color-border, #E2E8F0)">
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-text-main, #121826)' }}>auto_awesome</span>
                    </IconCircle>
                    <div>
                      <StepTitle>3. Curate</StepTitle>
                      <StepDesc style={{ marginTop: '4px' }}>오직 당신만을 위한 맞춤형 앰비언트 라이팅 프리셋이 완성됩니다.</StepDesc>
                    </div>
                  </StepCard>
                </StepList>
              </div>

              {/* 4. 하단 베너 */}
              <FooterBanner>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-accent, #FFAB40)', fontSize: '2.4rem', marginBottom: '16px' }}>lightbulb</span>
                <FooterText>
                  {`단순한 무드등이 아닌,
                  당신만의 완벽한 무드를
                  선물합니다.`}
                </FooterText>
              </FooterBanner>
            </Container>
          </div>

          <BottomNav />
        </div>
      </main>
    </div>
  );
};
