import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: null,
    userName: null,
    userRole: null,
    isLoggedIn: false,
};

const userReducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId;
            state.userName = action.payload.userName;
            state.userRole = action.payload.userRole;
            state.isLoggedIn = true;
        },
        clearUser: (state) => {
            state.userId = null;
            state.userName = null;
            state.userRole = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = userReducer.actions;
export default userReducer.reducer;
