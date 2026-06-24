import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "../types/user";

export const useAuth = defineStore("auth", () => {
  // Récupération initiale sécurisée depuis le localStorage
  const savedUser = localStorage.getItem('user');
  const user = ref<User | null>(savedUser ? JSON.parse(savedUser) : null);
  const token = ref<string | null>(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  // Décode le payload du JWT
  const decodeToken = (jwtToken: string): User => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      const dotNetRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload["role"];
      const name = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload["unique_name"];
      const nameIdentifier = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      return {
        id: nameIdentifier || '',
        username: name || 'Nomade',
        email: payload["email"] || '',
        roles: dotNetRole ? [dotNetRole] : ['User'] // On encapsule dans un tableau pour ton interface User
      };
    } catch (error) {
      console.error("Échec du décodage du token JWT :", error);
      return { id: '', email: '', roles: ['User'] };
    }
  };

  // Action principale d'authentification
  const authenticate = (userToken: string) => {
    token.value = userToken;
    localStorage.setItem('token', userToken);

    // Le store s'occupe de décoder le token reçu
    const userData = decodeToken(userToken);
    user.value = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  };

  return {
    user,
    token,
    isAuthenticated,
    authenticate,
    logout
  };
});