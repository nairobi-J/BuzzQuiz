import { createSlice } from '@reduxjs/toolkit';

/** create reducer */
export const questionReducer = createSlice({
    name: 'questions',
    initialState: {
        queue: [],
        answers: [],
        trace: 0,
        courseName: null,
    },
    reducers: {
        setCourseName: (state, action) => {
            state.courseName = action.payload;
        },
        startExamAction: (state, action) => {
            let { questions, answers } = action.payload;
            return {
                ...state,
                queue: questions,
                answers,
            };
        },
        moveNextAction: (state) => {
            return {
                ...state,
                trace: state.trace + 1,
            };
        },
        movePrevAction: (state) => {
            return {
                ...state,
                trace: state.trace - 1,
            };
        },
        resetAllAction: () => {
            return {
                queue: [],
                answers: [],
                trace: 0,
            };
        },
    },
});

export const {
    setCourseName,
    startExamAction,
    moveNextAction,
    movePrevAction,
    resetAllAction,
} = questionReducer.actions;

export default questionReducer.reducer;
