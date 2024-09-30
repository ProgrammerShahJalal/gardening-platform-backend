import { Router } from 'express';
import { UserRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  //   {
  //     path: '/rooms',
  //     route: RoomRoutes,
  //   },
  //   {
  //     path: '/slots',
  //     route: SlotRoutes,
  //   },
  //   {
  //     path: '/',
  //     route: bookingRouters,
  //   },
  //   {
  //     path: '/',
  //     route: PaymentRoutes,
  //   },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
