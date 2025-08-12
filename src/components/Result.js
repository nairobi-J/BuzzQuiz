import React, { useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetAllAction } from '../redux/question_reducer';
import { resetResultAction } from '../redux/result_reducer';
import { attempts_Number, earn_points, flag_result } from '../helper/helper';
import { resetOther } from '../redux/other_reducer';

export default function Result() {
    const dispatch = useDispatch();
    const {
        questions: { queue, answers },
        result: { result, userId },
    } = useSelector((state) => state);

    useEffect(() => {
        console.log(earnPoints);
    });

    const totalpoints = queue.length * 10;
    const attempts = attempts_Number(result);
    const earnPoints = earn_points(result, answers);
    const flag = flag_result(totalpoints, earnPoints);
    function onRestart() {
        console.log('Restart the exam');
        dispatch(resetAllAction());
        dispatch(resetResultAction());
        dispatch(resetOther());
    }
    return (
        <div className="w-full h-screen font-serif flex flex-col justify-center items-center  gap-4 " 
        style={{
            backgroundImage: `url(quiz2.webp)`,
            backgroundSize: "cover", // Ensures the image covers the full page
            backgroundRepeat: "no-repeat", // Prevents the image from repeating
            backgroundPosition: "center", // Centers the image
          }}>
            <h1 className="bg-blue-400 border-2 border-white pt-2 pb-2 pr-2 pl-2 rounded-md w-1/8 flex justify-center font-serif text-black text-2xl">Quiz Application</h1>
            <div className="bg-blue-300 border-2 pt-4 pr-4 pl-4 pb-4  w-1/3  font-serif flex flex-col gap-2">
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between">
                    <span className='font-serif text-xl text-black '>Username:</span>
                    <span className="font-serif text-2xl text-black">{userId}</span>
                </div>
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between">
                    <span className='font-serif text-xl text-black'>Total Quiz Points:</span>
                    <span className="font-serif text-2xl text-black">{totalpoints}</span>
                </div>
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between">
                    <span className='font-serif text-xl text-black'>Total Questions : </span>
                    <span className="font-serif text-2xl text-black">{queue.length}</span>
                </div>
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between">
                <span className='font-serif text-xl text-black'>Total Attempts : </span>
                    <span className="font-serif text-2xl text-black">{attempts}</span>
                </div>
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between ">
                <span className='font-serif text-xl text-black'>Total Earn Points : </span>
                
                    <span className="font-serif text-2xl text-black ">{earnPoints}</span>
                </div>
                <div className="flex bg-blue-400 border-2 border-white rounded-md items-center pt-2 pr-2 pl-2 justify-between">
                <span className='font-serif text-xl text-black flex '>Quiz Result: </span>
                    <span
                        style={{ color: `${flag ? '#01440d' : '#ff2a66'}` }}
                        className="font-serif text-2xl text-black"
                    >
                        {flag ? 'Passed' : 'Failed'}
                    </span>
                </div>
            </div>
            <div className="">
                <Link className="btn bg-blue-600 hover:bg-blue-400 hover:p-4 text-white font-extralight" to={'/'} onClick={onRestart}>
                    Restart
                </Link>
            </div>
            {/* <div className="container">
                {/* result table */}
            {/* <ResultTable></ResultTable>
            </div> */}{' '}
        </div>
    );
}
