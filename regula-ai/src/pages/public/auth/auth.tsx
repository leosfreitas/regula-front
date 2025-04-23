import { CaretDoubleLeft } from '@phosphor-icons/react';
import { useNavigate, useLocation } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import { SelectLogin } from './nested/selectLogin/select';
import { AdminLogin } from './nested/adminLogin/login';
import { UserLogin } from './nested/userLogin/login';
import { UserRegister } from './nested/userRegister/register';
import { RequestPasswordReset } from './nested/resetPass/RequestPasswordReset';
import { PasswordReset } from './nested/resetPass/PasswordReset';

export const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const backRoutes: { [key: string]: string } = {
        "/auth/select": "/home",
        "/auth/admin": "/auth/select",
        "/auth/user": "/auth/select",
        "/auth/register": "/home",
        "/auth/reset-password": "/auth/select",
        "auth/reset-password/:token": "/auth/select",
    };

    const handleBack = () => {
        const currentPath: string = location.pathname;
        const backPath = backRoutes[currentPath] || "/home"; 
        navigate(backPath);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <button
                className="absolute top-4 left-4 text-white hover:text-gray-300 z-30"
                onClick={handleBack}
            >
                <CaretDoubleLeft size={50} />
            </button>



            <div className="absolute inset-0 flex items-center justify-center z-20">
                <Routes>
                    <Route path="select" element={<SelectLogin />} />
                    <Route path="admin" element={<AdminLogin />} />
                    <Route path="user" element={<UserLogin />} />
                    <Route path="register" element={<UserRegister />} />
                    <Route path="reset-password" element={<RequestPasswordReset />} />
                    <Route path="reset-password/:token" element={<PasswordReset />} />
                </Routes>
            </div>
        </div>
    );
};
