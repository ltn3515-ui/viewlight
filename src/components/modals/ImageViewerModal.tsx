import React from 'react';
import { useModal } from '../../context/ModalContext';

export const ImageViewerModal: React.FC = () => {
  const { activeModal, selectedProduct, closeModal } = useModal();

  if (activeModal !== 'imageViewer' || !selectedProduct) return null;

  return (
    <div
      id="image-viewer-modal"
      className="fixed-modal-wrapper active"
      onClick={closeModal}
      style={{ zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="img-viewer-backdrop"></div>
      <div className="img-viewer-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="img-viewer-close-btn" onClick={closeModal} title="닫기">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="img-viewer-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <img
            id="img-viewer-src"
            src={selectedProduct.img}
            alt={selectedProduct.name}
            className="img-viewer-img"
            style={{ maxWidth: '100%', maxHeight: '75vh', objectFit: 'contain' }}
          />
        </div>
        <div className="img-viewer-caption" id="img-viewer-caption">
          {selectedProduct.name}
        </div>
      </div>
    </div>
  );
};
