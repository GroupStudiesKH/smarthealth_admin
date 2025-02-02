import { createRouter, createWebHistory } from "vue-router";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/settings/brand",
      name: "brandSettings",
      component: () => import("../views/BrandSettingsView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/settings/social",
      name: "socialSettings",
      component: () => import("../views/SocialSettingsView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
      meta: { requiresAuth: true } 
    },
    {
      path: "/user/edit",
      name: "userEdit",
      component: () => import("../views/UserEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/permission/add",
      name: "permissionAdd",
      component: () => import("../views/PermissionAdd.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/permission/edit/:id",
      name: "permissionEdit",
      component: () => import("../views/PermissionEdit.vue"),
      meta: { requiresAuth: true } 
    },
    {
      path: "/permission",
      name: "permission",
      component: () => import("../views/PermissionView.vue"),
      meta: { requiresAuth: true } 
    },
    {
      path: "/admins",
      name: "adminList",
      component: () => import("../views/AdminsView.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/layout/banner",
      name: "bannerLists",
      component: () => import("../views/BannerView.vue"),
      meta: { requiresAuth: true } 
    },
    {
      path: "/layout/banner/edit/:id",
      name: "bannerEdit",
      component: () => import("../views/BannerEdit.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/layout/banner/add",
      name: "bannerAdd",
      component: () => import("../views/BannerAdd.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue")
    },
    {
      path: "/layout/cms",
      name: "cms",
      component: () => import("../views/CmsView.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/layout/cms/add",
      name: "cmsAdd",
      component: () => import("../views/CmsAdd.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/layout/cms/edit/:id",
      name: "cmsEdit",
      component: () => import("../views/CmsEdit.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/admins/:id/edit",
      name: "adminEdit",
      component: () => import("../views/AdminEdit.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/admins/add",
      name: "adminRegister",
      component: () => import("../views/AdminAdd.vue"),
      meta: { requiresAuth: false }
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!(localStorage.getItem('access_token') || sessionStorage.getItem('access_token')); // 檢查 access_token 是否存在於 localStorage 或 sessionStorage

  if (to.matched.some(record => record.meta.requiresAuth)) {

    if (!isAuthenticated) {
      next({ name: 'login' }); // 沒有 token，跳轉到登錄頁面
    } else {
      next(); // 有 token，繼續導航
    }
  } else {
    next(); // 如果不需要身份驗證，繼續導航
  }
});

export default router;
