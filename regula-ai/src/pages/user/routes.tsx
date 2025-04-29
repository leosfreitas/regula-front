import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { checkToken } from './auth/token/api/CheckToken';
import { Home } from './dashboard/nested/home/homepage';
import { Profile } from './dashboard/nested/profile/profile';

const routes: RouteObject[] = [
  {
    path: "user/dashboard",
    element: <Dashboard />,
    id: "user-dashboard",
    loader: async () => {
      try {
        await checkToken();
        return null;
      } catch (error) {
        return redirect('/auth/select');
      }
    },
    children: [
      {
        index: true,
        loader: async () => redirect('/user/dashboard/home'),
      },
      {
        path: "home",
        element: <Home />,
        id: "user-home",
      },
      {
        path: "profile",
        element: <Profile />,
        id: "user-profile",
      }
    ],
  },
];

export default routes;
