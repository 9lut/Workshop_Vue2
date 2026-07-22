import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
    {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/Login.vue')
      },
      {
        path: 'cat', 
        name: 'cat',
        component: () => import('../views/CatView.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
      },
      {
        path: 'calGrade',
        name: 'calGrade',
        component: () => import('../views/CalGradeView.vue')
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('../views/ProductView.vue')
      },
      {
        path: 'api-test',
        name: 'apiTest',
        component: () => import('../views/ApiTestView.vue')
      },
      {
        path: 'manage/products',
        name: 'manageProducts',
        component: () => import('../views/ManageProducts.vue')
      },
      {
        path: 'manage/orders',
        name: 'manageOrders',
        component: () => import('../views/ManageOrders.vue')
      },
      {
        path: 'cart',
        name: 'cart',
        component: () => import('../views/CartView.vue')
      },
      {
        path: 'my-orders',
        name: 'myOrders',
        component: () => import('../views/MyOrders.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('../views/Register.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'manage/users',
        name: 'manageUsers',
        component: () => import('../views/ManageUsers.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

import store from '../store';

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const user = store.getters.getUser;
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      return next({ name: 'login' });
    }
  }

  if (to.matched.some(record => record.meta.guestOnly)) {
    if (isAuthenticated) {
      return next({ name: 'home' });
    }
  }

  if (to.matched.some(record => record.meta.requiresAdmin)) {
    if (!isAuthenticated || user?.role !== 'admin') {
      return next({ name: 'home' });
    }
  }
  
  // Checking for generic manage paths for shop/admin
  if (to.path.startsWith('/manage/products') || to.path.startsWith('/manage/orders')) {
    if (!isAuthenticated || (user?.role !== 'admin' && user?.role !== 'shop')) {
      return next({ name: 'home' });
    }
  }

  next();
});

export default router
