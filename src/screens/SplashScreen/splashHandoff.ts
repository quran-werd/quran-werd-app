import {createContext, useContext} from 'react';

export const LOGIN_BRAND_MARK_TOP = 120;

export const BrandMarkHeldContext = createContext(false);

export function useBrandMarkHeldBySplash() {
  return useContext(BrandMarkHeldContext);
}
