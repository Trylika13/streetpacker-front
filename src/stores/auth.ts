import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types/user";

export const useAuth = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token') || null);

  const isAuthenticated = computed(() => !!token.value);

  const authenticate = (userData: User, userToken: string) => {
    user.value = userData;
    token.value = userToken;
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return {
    user,
    token,
    isAuthenticated,
    authenticate,
    logout
  };
});