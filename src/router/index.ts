import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import AddSpotView from "../views/AddSpotView.vue";

const router = createRouter({
    history: createWebHistory('/'),
    routes: [{
        path: '/',
        name: 'Home',
        component: HomeView

    },
        {
            path: '/login',
            name: 'Login',
            component: LoginView
        },

        {
            path: '/register',
            name: 'Register',
            component: RegisterView,
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardView
        },
        {
            path: '/add-spot',
            name: 'AddSpot',
            component: AddSpotView
        }
    ]

})

export default router;