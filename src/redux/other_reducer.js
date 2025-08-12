import { createSlice } from '@reduxjs/toolkit';

export const otherReducer = createSlice({
    name: 'other',
    initialState: {
        courseId: null,
        quizId: null,
    },
    reducers: {
        setCourseId: (state, action) => {
            state.courseId = action.payload;
        },
        setQuizID: (state, action) => {
            state.quizId = action.payload;
        },
        resetOther: (state) => {
            state.courseId = null;
            state.quizId = null;
        },
    },
});

export const { setCourseId, setQuizID, resetOther } = otherReducer.actions;
export default otherReducer.reducer;
