import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { PostRoutes } from '../modules/post/post.route';

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
  {
    path: '/post',
    route: PostRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
