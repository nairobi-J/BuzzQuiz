import React, { useEffect, useState } from 'react';
import '../styles/TrueFalse.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateResult } from '../hooks/setResult';
import { useFetchQuizData } from '../hooks/FetchQuestion';

export default function TrueFalse({ onChecked }) {
    const [checked, setChecked] = useState(undefined);
    const dispatch = useDispatch();
    const [{ isLoading, serverError }] = useFetchQuizData();

    const trace = useSelector((state) => state.questions.trace);
    const result = useSelector((state) => state.result.result);
    const questions = useSelector(
        (state) => state.questions.queue[state.questions.trace]
    );
    const state = useSelector((state) => state);

    useEffect(() => {
        console.log(state);
        dispatch(updateResult({ trace, checked }));
    }, [checked]);

    function onSelect(option) {
        onChecked(option);
        setChecked(option);
        dispatch(updateResult({ trace, checked }));
    }

    if (isLoading) return <h3 className="text-light">isLoading</h3>;
    if (serverError) {
        // Check if the error is an object and stringify it for display
        return (
            <h3 className="text-light">
                {typeof serverError === 'object' ? JSON.stringify(serverError) : serverError || 'Unknown Error'}
            </h3>
        );
    }

    return (
        <div className="truefalse_body"
        style={{
            backgroundImage: `url(quiz2.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            <h2 className="question_title">{questions?.QuestionText}</h2>
            <ul key={questions?.QuestionID}>
                <li>
                    <input
                        type="radio"
                        name="truefalse"
                        id={`true-option`}
                        onChange={() => onSelect(true)}
                    />
                    <label className="radio_label" htmlFor={`true-option`}>
                        True
                    </label>
                    <div
                        className={`check ${result[trace] === true ? 'checked' : ''}`}
                    ></div>
                </li>
                <li>
                    <input
                        type="radio"
                        name="truefalse"
                        id={`false-option`}
                        onChange={() => onSelect(false)}
                    />
                    <label className="radio_label" htmlFor={`false-option`}>
                        False
                    </label>
                    <div
                        className={`check ${result[trace] === false ? 'checked' : ''}`}
                    ></div>
                </li>
            </ul>
        </div>
    );
}
