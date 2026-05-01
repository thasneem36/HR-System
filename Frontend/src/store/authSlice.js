import { createSlice } from '@reduxjs/toolkit';

const storedToken = localStorage.getItem('token');
const storedUser  = localStorage.getItem('user');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: storedToken || null,
    user:  storedUser ? JSON.parse(storedUser) : null,
  },
  reducers: {
    setCredentials(state, action) {
      const { token, user } = action.payload;
      state.token = token;
      state.user  = user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    updateUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout(state) {
      state.token = null;
      state.user  = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsLoggedIn   = (state) => !!state.auth.token;
export const selectUserRole     = (state) => state.auth.user?.role;
export const selectIsAdmin      = (state) => state.auth.user?.role === 'super_admin';
export const selectIsHR         = (state) => ['super_admin', 'hr_manager'].includes(state.auth.user?.role);

export default authSlice.reducer;
