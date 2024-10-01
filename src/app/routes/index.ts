import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProfileRoutes } from '../modules/profile/profile.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
