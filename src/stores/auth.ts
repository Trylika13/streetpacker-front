import { defineStore} from "pinia";
import {ref, computed} from "vue";

export const useAuth = defineStore("auth", () => {
   const user = ref(null);
   const token = ref(localStorage.getItem('token') || null );

   const isAuthenticated = computed(() => !!token.value);

   const authenticate = (userData: any, userToken: string) =>
   {
      user.value = userData;
      token.value = userToken;

      localStorage.setItem('token', userToken);
   };

   const logout = () => {
      user.value = null;
      token.value = null;
      localStorage.removeItem('token');
   };

   return {
      user,
      token,
      isAuthenticated,
      authenticate,
      logout
   };
});