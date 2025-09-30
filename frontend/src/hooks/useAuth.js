import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { loginUser, registerUser, logout, clearError, loadUserFromStorage } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  // useEffect(() => {
  //   if (!isAuthenticated && !loading) {
  //     dispatch(loadUserFromStorage());
  //   }
  // }, [dispatch, isAuthenticated, loading]);

  const login = async (loginRequest) => {
    const result = await dispatch(loginUser(loginRequest));
    return result.type === 'auth/login/fulfilled';
  };

  const register = async (registerRequest) => {
    const result = await dispatch(registerUser(registerRequest));
    return result.type === 'auth/register/fulfilled';
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
