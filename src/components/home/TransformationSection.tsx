import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/ModalContext';

export const TransformationSection: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();

  const handleZoomClick = (title: string, img: string) => {
    openModal('imageViewer', {
      id: 'bna-home-zoom',
      name: title,
      price: 0,
      img: img,
      category: 'floor',
    });
  };

  return (
    <section className="section-bna">
      <div className="section-header-title">
        <div>
          <h3>AI Before & After Gallery</h3>
          <p className="sub-text">AI 큐레이션이 제안하는 놀라운 공간의 변화를 확인해보세요.</p>
        </div>
        <span
          className="more-link"
          onClick={() => navigate('/bna-all')}
          style={{ cursor: 'pointer' }}
        >
          전체보기 ➔
        </span>
      </div>

      <div className="bna-list">
        {/* B&A 카드 1 */}
        <div className="bna-item-card" onClick={() => handleZoomClick('거실 | 아우라 플로어 램프 적용', 'img/Transformation Card 1.png')}>
          <div className="bna-img-box" style={{ cursor: 'pointer' }}>
            <img src="img/Transformation Card 1.png" alt="거실 아우라 플로어 램프 적용" className="bna-img" />
            <span className="bna-pill before-pill">BEFORE</span>
            <span className="bna-pill after-pill">AFTER</span>
            <div className="bna-zoom-hint">
              <span className="material-symbols-outlined">zoom_in</span>
            </div>
          </div>
          <div className="bna-caption">거실 | 아우라 플로어 램프 적용</div>
        </div>

        {/* B&A 카드 2 */}
        <div className="bna-item-card" onClick={() => handleZoomClick('다이닝 | 포근한 펜던트 조명 큐레이션', 'img/Transformation Card 2.png')}>
          <div className="bna-img-box" style={{ cursor: 'pointer' }}>
            <img src="img/Transformation Card 2.png" alt="다이닝 포근한 펜던트 조명 큐레이션" className="bna-img" />
            <span className="bna-pill before-pill">BEFORE</span>
            <span className="bna-pill after-pill">AFTER</span>
            <div className="bna-zoom-hint">
              <span className="material-symbols-outlined">zoom_in</span>
            </div>
          </div>
          <div className="bna-caption">다이닝 | 포근한 펜던트 조명 큐레이션</div>
        </div>
      </div>
    </section>
  );
};
