import React, { createContext, useContext, useState } from 'react';
import { ModalType, Product } from '../types';

interface ModalContextType {
  activeModal: ModalType;
  selectedProduct: Product | null;
  openModal: (type: ModalType, product?: Product) => void;
  closeModal: () => void;
  unreadNotiCount: number;
  clearNotifications: () => void;
}

const ModalContext = createContext<ModalContextType>({
  activeModal: null,
  selectedProduct: null,
  openModal: () => {},
  closeModal: () => {},
  unreadNotiCount: 2,
  clearNotifications: () => {},
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [unreadNotiCount, setUnreadNotiCount] = useState(2);

  const openModal = (type: ModalType, product?: Product) => {
    setActiveModal(type);
    if (product) {
      setSelectedProduct(product);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProduct(null);
  };

  const clearNotifications = () => {
    setUnreadNotiCount(0);
  };

  return (
    <ModalContext.Provider value={{ activeModal, selectedProduct, openModal, closeModal, unreadNotiCount, clearNotifications }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
