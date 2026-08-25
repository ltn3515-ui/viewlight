import React, { useState, useRef, useEffect } from 'react';
import { useModal } from '../../context/ModalContext';

export const ImageViewerModal: React.FC = () => {
  const { activeModal, selectedProduct, closeModal } = useModal();
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset states when the modal is opened/changed
  useEffect(() => {
    if (activeModal === 'imageViewer') {
      setSliderPos(50);
      setAspectRatio(null);
      isDragging.current = false;
      hasDragged.current = false;
    }
  }, [activeModal, selectedProduct]);

  if (activeModal !== 'imageViewer' || !selectedProduct) return null;

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPos(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    handleSliderMove(clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    hasDragged.current = true;
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    if (e.cancelable) {
      e.preventDefault();
    }
    hasDragged.current = true;
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (selectedProduct.id === 'bna-home-zoom') {
      // Side-by-side split image: aspect ratio of a single view is half of the combined width
      setAspectRatio((naturalWidth / 2) / naturalHeight);
    } else {
      // Single image
      setAspectRatio(naturalWidth / naturalHeight);
    }
  };

  const handleWrapperClick = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }
    closeModal();
  };

  return (
    <div
      id="image-viewer-modal"
      className="fixed-modal-wrapper active"
      onClick={handleWrapperClick}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchEnd={handleMouseUp}
      style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="img-viewer-backdrop"></div>
      <div className="img-viewer-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="img-viewer-close-btn" onClick={closeModal} title="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Hidden image loader to detect natural dimensions and compute aspect ratio */}
        <img
          src={selectedProduct.img}
          onLoad={handleImageLoad}
          style={{ display: 'none' }}
          alt="hidden loader"
        />

        <div className="img-viewer-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '16px' }}>
          <div
            ref={sliderRef}
            className="bna-comparison-slider"
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: aspectRatio ? `${aspectRatio}` : '1 / 1',
              maxHeight: '65vh',
              overflow: 'hidden',
              cursor: 'ew-resize',
              userSelect: 'none',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
              backgroundColor: '#111318',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            {selectedProduct.id === 'bna-home-zoom' ? (
              // Case 1: Side-by-side split image
              <>
                {/* Before layer (left half of the combined image, scaled 200% and aligned left) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                  <img
                    src={selectedProduct.img}
                    alt="Before"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '200%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                  <span className="bna-tag-badge before-badge" style={{ pointerEvents: 'none' }}>Before</span>
                </div>

                {/* After layer (right half of the combined image, scaled 200% and aligned right, clipped by slider position) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    clipPath: `inset(0 0 0 ${sliderPos}%)`,
                    WebkitClipPath: `inset(0 0 0 ${sliderPos}%)`,
                    transition: isDragging.current ? 'none' : 'clip-path 0.1s ease-out, -webkit-clip-path 0.1s ease-out',
                  }}
                >
                  <img
                    src={selectedProduct.img}
                    alt="After"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '200%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                  <span className="bna-tag-badge after-badge" style={{ pointerEvents: 'none', right: '12px', left: 'auto' }}>After</span>
                </div>
              </>
            ) : (
              // Case 2: Single image with dark/warm contrast filters
              <>
                {/* Before layer (dark filter applied) */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                  <img
                    src={selectedProduct.img}
                    alt="Before"
                    className="dark-filter"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                  <span className="bna-tag-badge before-badge" style={{ pointerEvents: 'none' }}>Before</span>
                </div>

                {/* After layer (warm filter applied, clipped by slider position) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    clipPath: `inset(0 0 0 ${sliderPos}%)`,
                    WebkitClipPath: `inset(0 0 0 ${sliderPos}%)`,
                    transition: isDragging.current ? 'none' : 'clip-path 0.1s ease-out, -webkit-clip-path 0.1s ease-out',
                  }}
                >
                  <img
                    src={selectedProduct.img}
                    alt="After"
                    className="warm-filter"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                  <span className="bna-tag-badge after-badge" style={{ pointerEvents: 'none', right: '12px', left: 'auto' }}>After</span>
                </div>
              </>
            )}

            {/* Slider vertical line and draggable knob */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: `${sliderPos}%`,
                transform: 'translateX(-50%)',
                height: '100%',
                cursor: 'ew-resize',
                zIndex: 30,
                pointerEvents: 'none',
                transition: isDragging.current ? 'none' : 'left 0.1s ease-out',
              }}
            >
              <div className="bna-handle-line"></div>
              <div className="bna-handle-knob" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-dark-navy)', transform: 'none', width: 'auto', height: 'auto' }}>chevron_left</span>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-dark-navy)', transform: 'none', width: 'auto', height: 'auto' }}>chevron_right</span>
              </div>
            </div>
          </div>
        </div>

        <div className="img-viewer-caption" id="img-viewer-caption">
          {selectedProduct.name}
        </div>
      </div>
    </div>
  );
};

