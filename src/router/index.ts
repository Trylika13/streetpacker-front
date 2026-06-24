import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'Login',
            // Lazy Loading : Chargé uniquement si on va sur la page
            component: () => import('../views/auth/LoginView.vue')
        },
        {
            path: '/register',
            name: 'Register',
            component: () => import('../views/auth/RegisterView.vue'),
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('../views/DashboardView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/marketplace',
            name: 'MarketPlace',
            component: () => import('../views/MarketPlaceView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/create-ad',
            name: 'Create Ad',
            component: () => import('../views/CreateAdView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile/spots',
            name: 'my-spots',
            component: () => import('../views/MySpotsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile/ads',
            name: 'my-ads',
            component: () => import('../views/MyAdsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile/settings',
            name: 'profile-settings',
            component: () => import('../views/SettingsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/profile/favorites',
            name: 'my-favorites',
            component: () => import('../views/MyFavoritesView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/spots/:id',
            name: 'SpotDetail',
            component: () => import('@/views/SpotDetailView.vue')
        },
        {
            path: '/marketplace/:id',
            name: 'AdDetail',
            component: () => import('@/views/AdDetailView.vue')
        }
    ]
});


// Naviguation guard
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Récupération du jeton d'accès JWT
    const token = localStorage.getItem('token');

    if (requiresAuth && !token) {
        next('/login');
    } else if ((to.name === 'Login' || to.name === 'Register') && token) {
        next('/dashboard');
    } else {
        next();
    }
});

export default router;