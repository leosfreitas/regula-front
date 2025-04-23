import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import publicRoutes from './pages/public/routes';
import adminRoutes from './pages/admin/routes';

export const router = createBrowserRouter([
    ...publicRoutes,
    ...adminRoutes,
    {
        path: "/",
        element: <App />,
    }
]);

