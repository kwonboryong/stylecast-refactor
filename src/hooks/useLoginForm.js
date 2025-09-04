import { useReducer } from 'react';

export const initialState = {
  email: '',
  password: '',
  showPassword: false,
  warnings: { email: '', password: '', auth: '' },
  isSubmitting: false
};

export function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'TOGGLE_PASSWORD':
      return { ...state, showPassword: !state.showPassword };
    case 'SET_WARNING':
      return { ...state, warnings: { ...state.warnings, ...action.payload } };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    default:
      return state;
  }
}

export function useLoginForm() {
  return useReducer(reducer, initialState);
}