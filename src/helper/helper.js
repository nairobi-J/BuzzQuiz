import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export function attempts_Number(result) {
    return result.filter((r) => r !== undefined).length;
}
// export function earn_points(result, answers) {
//     return result
//         .map((selectedOption, i) => {
//             const correctOptions = answers[i].CorrectOptions;

//             // Handle true/false comparison
//             if (answers[i].QuestionType === 'true/false') {
//                 return (
//                     (selectedOption === 'True' && correctOptions.includes(true)) ||
//                     (selectedOption === 'False' && correctOptions.includes(false))
//                 );
//             }

//             // Handle short answer comparison (case insensitive and trimmed)
//             if (answers[i].QuestionType === 'short answer') {
//                 return correctOptions.some(correctAnswer =>
//                     correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase()
//                 );
//             }

//             // For other types (like multiple-choice)
//             return correctOptions.includes(selectedOption);
//         })
//         .filter(isCorrect => isCorrect)
//         .map(() => 10)
//         .reduce((prev, curr) => prev + curr, 0);
// }

export function earn_points(result, answers) {

    console.log(answers)
    return result
        .map((selectedOption, i) => {
            const correctOptions = answers[i]?.CorrectOptions;

            // If no CorrectOptions, return 0 points for this answer
            if (!correctOptions) return false;

            // Handle true/false comparison
            if (answers[i].QuestionType === 'true/false') {
                return (
                    (selectedOption === 'True' && correctOptions.includes(true)) ||
                    (selectedOption === 'False' && correctOptions.includes(false))
                );
            }

            // Handle short answer comparison (case insensitive and trimmed)
            if (answers[i].QuestionType === 'short answer') {
                return correctOptions.some(correctAnswer =>
                    correctAnswer.trim().toLowerCase() === selectedOption.trim().toLowerCase()
                );
            }

            // For other types (like multiple-choice)
            return correctOptions.includes(selectedOption);
        })
        .filter(isCorrect => isCorrect)
        .map(() => 10)
        .reduce((prev, curr) => prev + curr, 0);
}


export function flag_result(totalpoints, earnPoints) {
    return (totalpoints * 50) / 100 < earnPoints;
}
/** check user auth  */
export function CheckUserExist({ children }) {
    const auth = useSelector((state) => state.user.userId);
    return auth ? children : <Navigate to={'/login'} replace={true}></Navigate>;
}
export function CheckUserAdmin({ children }) {
    const auth = useSelector((state) => state.user.userRole);

    return auth === 'admin' ? (
        children
    ) : (
        <Navigate to={'/'} replace={true}></Navigate>
    );
}
export function CheckUserTeacher({ children }) {
    const auth = useSelector((state) => state.user.userRole);
    return auth === 'teacher' ? (
        children
    ) : (
        <Navigate to={'/'} replace={true}></Navigate>
    );
}
export function CheckUserStudent({ children }) {
    const auth = useSelector((state) => state.user.userRole);
    return auth === 'student' ? (
        children
    ) : (
        <Navigate to={'/'} replace={true}></Navigate>
    );
}
