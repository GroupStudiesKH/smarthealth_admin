import { createRouter, createWebHistory } from "vue-router";



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/exam/edit/:id",
      name: "examEdit",
      component: () => import("../views/exam/ExamEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/exam/result/:id",
      name: "examResult",
      component: () => import("../views/exam/ExamResult.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/member/edit/:id",
      name: "memberEdit",
      component: () => import("../views/MemberEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/member/add",
      name: "memberAdd",
      component: () => import("../views/MemberEdit.vue"),
      meta: { requiresAuth: true }
    },
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
      path: "/content/faq",
      name: "faqEdit",
      component: () => import("../views/content/FaqEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/content/about",
      name: "aboutEdit",
      component: () => import("../views/content/AboutEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/content/privacy",
      name: "privacyEdit",
      component: () => import("../views/content/PrivacyEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/content/security",
      name: "securityEdit",
      component: () => import("../views/content/SecurityEdit.vue"),
      meta: { requiresAuth: true }
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
    {
      path: "/course",
      name: "courseList",
      component: () => import("../views/course/CourseList.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/:courseId/chapters",
      name: "chapterList",
      component: () => import("../views/course/ChapterList.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/:courseId/chapter/:chapterId/edit",
      name: "chapterEdit",
      component: () => import("../views/course/ChapterEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/:courseId/chapter/add",
      name: "chapterAdd",
      component: () => import("../views/course/ChapterEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/add',
      name: 'CourseAdd',
      component: () => import('../views/course/CourseAdd.vue'),
      meta: {
        title: '新增課程',
        requiresAuth: true
      }
    },
    {
      path: '/course/edit/:id',
      name: 'CourseEdit',
      component: () => import('../views/course/CourseEdit.vue'),
      meta: {
        title: '編輯課程',
        requiresAuth: true
      }
    },
    {
      path: "/member/grades/:id",
      name: "memberGrades",
      component: () => import("../views/MemberGrades.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/member",
      name: "member",
      component: () => import("../views/MemberView.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/statistics/progress",
      name: "statisticsProgress",
      component: () => import("../views/statistics/progress.vue"),
      meta: { requiresAuth: true }
    },

    {
      path: '/course/category/add',
      name: 'course-category-add',
      component: () => import('../views/course/CategoryAdd.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/course/category/edit/:id',
      name: 'course-category-edit',
      component: () => import('../views/course/CategoryEdit.vue'),
      meta: { requiresAuth: true }
    },

    // /statistics/course-report

    {
      path: "/statistics/course-report/:id",
      name: "statisticsCourseReport",
      component: () => import("../views/statistics/CourseReport.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/exam/statistics",
      name: "examStatistics",
      component: () => import("../views/exam/Statistics.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/category",
      name: "category-list",
      component: () => import("../views/course/CategoryList.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/tag",
      name: "tagList",
      component: () => import("../views/course/TagList.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/tag/add",
      name: "tagAdd",
      component: () => import("../views/course/TagAdd.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/tag/edit/:id",
      name: "tagEdit",
      component: () => import("../views/course/TagEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/instructor",
      name: "instructorList",
      component: () => import("../views/course/InstructorList.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/instructor/add",
      name: "instructorAdd",
      component: () => import("../views/course/InstructorAdd.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/course/instructor/edit/:id",
      name: "instructorEdit",
      component: () => import("../views/course/InstructorEdit.vue"),
      meta: { requiresAuth: true }
    },
    {
      path: "/forgot-password",
      name: "forgotPassword",
      component: () => import("../views/ForgotPasswordView.vue"),
      meta: { requiresAuth: false }
    },
    {
      path: "/reset-password",
      name: "resetPassword",
      component: () => import("../views/ResetPasswordView.vue"),
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
