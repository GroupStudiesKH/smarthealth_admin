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
      <a href="/" class="sidebar-brand"> Smart<span>Health</span> </a>
      <div class="sidebar-toggler">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <div class="sidebar-body">
      <ul class="nav" id="sidebarNav">

        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/layout') }"
          v-if="
            hasPermission('layout-banner-management', 'list') ||
            hasPermission('layout-cms', 'list') ||
            hasPermission('layout-homepage-popup', 'list') ||
            hasPermission('layout-vip-list-management', 'list')
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
            <span class="link-title">版面設定</span>
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
                  >Banner管理</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('layout-cms', 'list')">
                <a
                  href="/layout/cms"
                  class="nav-link"
                  :class="{ active: $route.path === '/layout/cms' }"
                  >CMS</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('layout-homepage-popup', 'list')">
                <a
                  href="/layout/homepage-popup"
                  class="nav-link"
                  :class="{ active: $route.path === '/layout/homepage-popup' }"
                  >首頁彈窗</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('layout-vip-list-management', 'list')">
                <a
                  href="/layout/vip-list-management"
                  class="nav-link"
                  :class="{
                    active: $route.path === '/layout/vip-list-management',
                  }"
                  >VIP列表管理</a
                >
              </li>
            </ul>
          </div>
        </li>



        <li
          class="nav-item"
          :class="{ active: $route.path.startsWith('/permission') }"
          v-if="hasPermission('permissions_group', 'list') || true"
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
              <li class="nav-item" v-if="hasPermission('permissions_group', 'list') || true">
                <a
                  href="/permission"
                  class="nav-link"
                  :class="{ active: $route.path === '/permission' }"
                  >角色</a
                >
              </li>
              <li class="nav-item" v-if="hasPermission('permissions_group', 'list') || true">
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