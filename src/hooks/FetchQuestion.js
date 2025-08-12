import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

/** redux actions */
import * as Action from '../redux/question_reducer';

/** fetch question hook to fetch api data and set value to store */
export const useFetchQuizData = () => {
    const dispatch = useDispatch();
    const { quizId } = useSelector((state) => state.other);
    const [getData, setGetData] = useState({
        isLoading: false,
        apiData: {},
        serverError: null,
    });

    useEffect(() => {
        setGetData((prev) => ({ ...prev, isLoading: true }));

        (async () => {
            try {
                const [questionsResponse, correctOptionsResponse] =
                    await Promise.all([
                        axios.get(
                            `http://localhost:8000/api/question/quizzes/${quizId}/questions`
                        ),
                        axios.get(
                            `http://localhost:8000/api/options/quizzes/${quizId}/options`
                        ),
                    ]);

                const questions = questionsResponse.data;
                const answers = correctOptionsResponse.data;
               
                // && answers.length > 0
                if (questions.length > 0) {
                    setGetData((prev) => ({ ...prev, isLoading: false }));
                    setGetData((prev) => ({
                        ...prev,
                        apiData: { questions, answers },
                    }));

                    dispatch(Action.startExamAction({ questions, answers }));
                } else {
                    throw new Error('No Question or Correct Options Available');
                }
            } catch (error) {
                setGetData((prev) => ({ ...prev, isLoading: false }));
                setGetData((prev) => ({ ...prev, serverError: error }));
            }
        })();
    }, [dispatch]);

    return [getData, setGetData];
};

/** MoveAction Dispatch function */
export const MoveNextQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.moveNextAction()); /** increase trace by 1 */
    } catch (error) {
        console.log(error);
    }
};

/** PrevAction Dispatch function */
export const MovePrevQuestion = () => async (dispatch) => {
    try {
        dispatch(Action.movePrevAction()); /** decrease trace by 1 */
    } catch (error) {
        console.log(error);
    }
};
