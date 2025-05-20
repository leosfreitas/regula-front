import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import publicRoutes from './pages/public/routes';
import adminRoutes from './pages/admin/routes';
import userRoutes from './pages/user/routes';

export const router = createBrowserRouter([
    ...publicRoutes,
    ...adminRoutes,
    ...userRoutes,
    {
        path: "/",
        element: <Navigate to ="/home" replace />,
    }
]);

