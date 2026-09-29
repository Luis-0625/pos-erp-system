import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// Hook tipado para useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Hook tipado para useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
