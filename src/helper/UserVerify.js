import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../redux/user_reducer';

export function CheckUserExist({ children }) {
    const dispatch = useDispatch();
    const { isLoggedIn, userId } = useSelector((state) => state.user);
    const id = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await axios.get(
                    `http://localhost:8000/api/user/${id}`,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                const user = response.data;
                console.log(user);
                dispatch(
                    setUser({
                        userId: user.UserID,
                        userName: user.Username,
                        userRole: user.UserRole,
                        isLoggedIn: true,
                    })
                );
            } catch (error) {
                console.error('Error fetching user data:', error);
                dispatch(setUser({ isLoggedIn: false }));
            }
        }

        if (isLoggedIn && userId && token) {
            fetchUserData();
        }
    }, [dispatch, isLoggedIn, userId]);

    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export function CheckUserAdmin({ children }) {
    const { isLoggedIn, userRole } = useSelector((state) => state.user);

    return isLoggedIn && userRole === 'admin' ? (
        children
    ) : (
        <Navigate to="/" replace />
    );
}
