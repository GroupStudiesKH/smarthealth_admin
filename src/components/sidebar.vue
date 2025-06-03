<script setup>
import { ref, onMounted } from "vue";

const hasPermission = (module, action) => {
  // Get user data from localStorage or sessionStorage
  const userData = JSON.parse(
    localStorage.getItem("userData") ||
      sessionStorage.getItem("userData") ||
      "{}"
  );

  return (
    userData.permissions &&
    userData.permissions[module] &&
    userData.permissions[module].includes(action)
  );
};

// Make hasPermission available to the template
defineExpose({ hasPermission });
</script>
  
<template>
  <!-- partial:partials/_sidebar.html -->
  <nav class="sidebar">
    <div class="sidebar-header">
      <a href="/" class="sidebar-brand"> <img src="/assets/images/logo.png" alt="logo" width="150px;" /> </a>
      <div class="sidebar-toggler">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="sidebar-body">
      <ul class="nav" id="sidebarNav">
        <!-- 課程管理 -->
        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/course') }"
          v-if="hasPermission('course-management', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#courseManagement"
            role="button"
            aria-expanded="false"
            aria-controls="courseManagement"
          >
            <i class="link-icon material-icons">school</i>
            <span class="link-title">課程管理</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div class="collapse" data-bs-parent="#sidebarNav" id="courseManagement">
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('course-list', 'list')">
                <a href="/course" class="nav-link" :class="{ active: $route.path === '/course/list' }">課程列表</a>
              </li>
              <li class="nav-item" v-if="hasPermission('course-category', 'list')">
                <a href="/course/category" class="nav-link" :class="{ active: $route.path === '/course/category' }">分類管理</a>
              </li>
              <li class="nav-item" v-if="hasPermission('course-tag', 'list')">
                <a href="/course/tag" class="nav-link" :class="{ active: $route.path === '/course/tag' }">標籤管理</a>
              </li>
              <li class="nav-item" v-if="hasPermission('course-instructor', 'list')">
                <a href="/course/instructor" class="nav-link" :class="{ active: $route.path === '/course/instructor' }">講師列表</a>
              </li>
            </ul>
          </div>
        </li>

        <!-- 會員管理 -->
        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/member') }"
          v-if="hasPermission('member-management', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#memberManagement"
            role="button"
            aria-expanded="false"
            aria-controls="memberManagement"
          >
            <i class="link-icon material-icons">people</i>
            <span class="link-title">會員管理</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div class="collapse" data-bs-parent="#sidebarNav" id="memberManagement">
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('member-list', 'list')">
                <a href="/member" class="nav-link" :class="{ active: $route.path === '/member' }">會員列表</a>
              </li>
            </ul>
          </div>
        </li>

        <!-- 課程統計 -->
        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/statistics') }"
          v-if="hasPermission('course-statistics', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#statisticsManagement"
            role="button"
            aria-expanded="false"
            aria-controls="statisticsManagement"
          >
            <i class="link-icon material-icons">analytics</i>
            <span class="link-title">課程統計</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div class="collapse" data-bs-parent="#sidebarNav" id="statisticsManagement">
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('course-progress', 'list')">
                <a href="/statistics/progress" class="nav-link" :class="{ active: $route.path === '/statistics/progress' }">學習進度統計</a>
              </li>
            </ul>
          </div>
        </li>

        <!-- 測驗管理 -->
        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/exam') }"
          v-if="hasPermission('exam-statistics', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#examManagement"
            role="button"
            aria-expanded="false"
            aria-controls="examManagement"
          >
            <i class="link-icon material-icons">quiz</i>
            <span class="link-title">測驗管理</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div class="collapse" data-bs-parent="#sidebarNav" id="examManagement">
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('exam-statistics', 'list')">
                <a href="/exam/statistics" class="nav-link" :class="{ active: $route.path === '/exam/statistics' }">課程測驗列表</a>
              </li>
            </ul>
          </div>
        </li>

        <!-- 網站基本設定 -->
        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/settings') }"
          v-if="hasPermission('site-brand', 'list') || hasPermission('site-social', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#siteSettings"
            role="button"
            aria-expanded="false"
            aria-controls="siteSettings"
          >
            <i class="link-icon material-icons">settings</i>
            <span class="link-title">網站基本設定</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div class="collapse" data-bs-parent="#sidebarNav" id="siteSettings">
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('site-brand', 'list')">
                <a href="/settings/brand" class="nav-link" :class="{ active: $route.path === '/settings/brand' }">品牌設定</a>
              </li>
              <li class="nav-item" v-if="hasPermission('site-social', 'list')">
                <a href="/settings/social" class="nav-link" :class="{ active: $route.path === '/settings/social' }">社群設定</a>
              </li>
            </ul>
          </div>
        </li>

        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/layout') }"
          v-if="
            hasPermission('layout-banner-management', 'list') ||
            hasPermission('content-faq', 'edit') ||
            hasPermission('content-about', 'edit') ||
            hasPermission('content-terms', 'edit') ||
            hasPermission('content-privacy', 'edit') ||
            hasPermission('content-security', 'edit')
          "
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#layoutSettings"
            role="button"
            aria-expanded="false"
            aria-controls="layoutSettings"
          >
            <i class="link-icon material-icons">dashboard</i>
            <span class="link-title">介紹頁面管理</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div
            class="collapse"
            data-bs-parent="#sidebarNav"
            id="layoutSettings"
          >
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('layout-banner-management', 'list')">
                <a
                  href="/layout/banner"
                  class="nav-link"
                  :class="{
                    active: $route.path === '/layout/banner',
                  }"
                  >首頁Banner管理</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('content-faq', 'edit')">
                <a href="/content/faq" class="nav-link" :class="{ active: $route.path === '/content/faq' }">FAQ</a>
              </li>
              <li class="nav-item" v-if="hasPermission('content-about', 'edit')">
                <a href="/content/about" class="nav-link" :class="{ active: $route.path === '/content/about' }">計劃緣起</a>
              </li>
              <li class="nav-item" v-if="hasPermission('content-terms', 'edit')">
                <a href="/content/terms" class="nav-link" :class="{ active: $route.path === '/content/terms' }">使用者條款</a>
              </li>
              <li class="nav-item" v-if="hasPermission('content-privacy', 'edit')">
                <a href="/content/privacy" class="nav-link" :class="{ active: $route.path === '/content/privacy' }">隱私權政策</a>
              </li>
              <li class="nav-item" v-if="hasPermission('content-security', 'edit')">
                <a href="/content/security" class="nav-link" :class="{ active: $route.path === '/content/security' }">資安政策</a>
              </li>
            </ul>
          </div>
        </li>



        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/permission') }"
          v-if="hasPermission('permissions_group', 'list')"
        >
          <a
            class="nav-link"
            data-bs-toggle="collapse"
            href="#permissionManagement"
            role="button"
            aria-expanded="false"
            aria-controls="permissionManagement"
          >
            <i class="link-icon material-icons">security</i>
            <span class="link-title">權限管理</span>
            <i class="link-arrow material-icons">keyboard_arrow_down</i>
          </a>
          <div
            class="collapse"
            data-bs-parent="#sidebarNav"
            id="permissionManagement"
          >
            <ul class="nav sub-menu">
              <li class="nav-item" v-if="hasPermission('permissions_group', 'list')">
                <a
                  href="/permission"
                  class="nav-link"
                  :class="{ active: $route.path === '/permission' }"
                  >角色</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('permissions_group', 'list')">
                <a
                  href="/admins"
                  class="nav-link"
                  :class="{ active: $route.path === '/admins' }"
                  >管理員列表</a
                >
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </nav>
  <!-- partial -->
</template>