import { defineConfig } from '@umijs/max';

export default defineConfig({
  jsMinifier: 'terser',
  antd: {},
  access: {},
  model: {},
  dva: {},
  define: {
    API_ROOT: 'https://hilton-backend.50d.top/',
    // API_PREFIX: '/api',
    API_PREFIX: '',
    GRAPHQL_PREFIX: '/graphql',
  },

  initialState: {},
  request: {},
  layout: {
    title: ' ',
  },

  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      name: 'login',
      path: '/login',
      component: './Login',
      layout: false
    },
    {
      name: 'Reservation',
      path: '/reservation',
      component: './Reservation',
    },
    {
      name: 'Reservation management',
      path: '/reservation-management',
      component: './ReservationManagement',
      access: 'adminRouteFilter'
    },
    {
      name: 'Restaurant management',
      path: '/restaurant',
      component: './Restaurant',
      access: 'adminRouteFilter'
    },
    {
      path: '*',
      component: './404',
    },
  ],

  npmClient: 'yarn',
  tailwindcss: {},
});
