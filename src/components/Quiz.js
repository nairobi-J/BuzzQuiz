import Mcq from './Mcq';
import '../styles/Quiz.css';
/** redux store import */
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
/**import functions from hooks */
import { MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';
import { PushAnswer } from '../hooks/setResult';
import { Navigate } from 'react-router-dom';
export default function Quiz() {
    const { queue, trace } = useSelector((state) => state.questions);
    const result = useSelector((state) => state.result.result);
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const [check, setCheck] = useState(undefined);
    useEffect(() => {
        console.log(state);
    });

    function onPrev() {
        if (trace > 0) {
            dispatch(MovePrevQuestion());
        }
    }
    function onNext() {
        if (trace < queue.length) {
            dispatch(MoveNextQuestion());
            if (result.length <= trace) {
                dispatch(PushAnswer(check));
            }
        }
        /**reset value */
        setCheck(undefined);
    }
    function onChecked(check) {
        setCheck(check);
    }
    /**finished exam show result table */
    if (result.length && result.length >= queue.length) {
        return <Navigate to={'/result'} replace="true"></Navigate>;
    }
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center pl-4 font-serif"
        style={{
            backgroundImage: `url(quiz2.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}
        >
            <h1 className="text-black ">{state.questions.courseName}</h1>
             
            <Mcq onChecked={onChecked} />

            <div className="pt-2 flex gap-80">
                <button
                    className=" text-white bg-blue-900 hover:bg-gray-200 hover:text-black p-2 pt-2 pb-2 pr-16 pl-16 border-2 border-white rounded-md  "
                    onClick={onPrev}
                    disabled={trace <= 0 ? true : false}
                >
                  <FaArrowLeft size={25}/> 
                </button>
                
                <button  className=" text-white bg-blue-900 hover:bg-gray-200 hover:text-black p-2 pt-2 pb-2 pr-16 pl-16 border-2 border-white rounded-md " onClick={onNext}>
                <FaArrowRight size={25}/> 
                </button>
            </div>
        </div>
    );
}
