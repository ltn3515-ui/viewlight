export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  img: string;
  category: 'table' | 'floor' | 'ambient' | 'smart' | 'pendant';
  rating?: number;
  reviewCount?: number;
  description?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  qty: number;
}

export interface User {
  email: string;
  name?: string;
  photoURL?: string;
  uid?: string;
}

export type ModalType =
  | 'login'
  | 'signup'
  | 'forgotPassword'
  | 'cart'
  | 'checkout'
  | 'search'
  | 'notification'
  | 'coupon'
  | 'settings'
  | 'productDetail'
  | 'aiTech'
  | 'scanGuide'
  | 'cameraScan'
  | 'editProfile'
  | 'menu'
  | 'orderHistory'
  | 'myReviews'
  | 'imageViewer'
  | 'wishlist'
  | null;
