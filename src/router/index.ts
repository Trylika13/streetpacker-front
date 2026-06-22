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
            // Code Splitting / Lazy Loading : Chargé uniquement si on va sur la page
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
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/profile',
            name: 'Profile',
            component: () => import('../views/ProfileView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/marketplace',
            name: 'MarketPlace',
            component: () => import('../views/MarketPlaceView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/create-ad',
            name: 'Create Ad',
            component: () => import('../views/CreateAdView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/profile/spots',
            name: 'my-spots',
            component: () => import('../views/MySpotsView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/profile/ads',
            name: 'my-ads',
            component: () => import('../views/MyAdsView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/profile/settings',
            name: 'profile-settings',
            component: () => import('../views/SettingsView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
        },
        {
            path: '/profile/favorites',
            name: 'my-favorites',
            component: () => import('../views/MyFavoritesView.vue'),
            meta: { requiresAuth: true } // 🔒 Route protégée
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

// 🔒 REPERE DE SÉCURITÉ (ROUTE GUARD)
router.beforeEach((to, from, next) => {
    // Vérifie si la route demande une authentification
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    // Récupération du jeton d'accès JWT
    const token = localStorage.getItem('token');

    if (requiresAuth && !token) {
        // Pas de token et route sécurisée ? Redirection vers le login direct
        next('/login');
    } else if ((to.name === 'Login' || to.name === 'Register') && token) {
        // Déjà connecté ? Interdit de retourner sur l'auth, on renvoie sur le dashboard
        next('/dashboard');
    } else {
        // Sinon, on laisse passer tranquillement
        next();
    }
});

export default router;