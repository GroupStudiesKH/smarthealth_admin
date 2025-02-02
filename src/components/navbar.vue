<script>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";

export default {
  setup() {
    const router = useRouter();

    const userData = ref({
      name: '',
      email: ''
    });

    const notifications = ref([]);
    const messages = ref([]);
    const notificationCount = ref(0);
    const messageCount = ref(0);

    const checkAdminStatus = async () => {
      try {
        const response = await apiService.adminMe();
        if (response) {
          // Store user data in sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(response));
          // Update the reactive userData ref
          userData.value = response;
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // If there's an error (e.g., unauthorized), redirect to login
        router.push("/login");
        // Remove access token from localStorage
        localStorage.removeItem("access_token");
      }
    };

    const logout = async () => {
      try {
        await apiService.adminLogout();
        // Clear user data
        userData.value = null;
        // Remove access token from localStorage
        localStorage.removeItem("access_token");

        sessionStorage.removeItem("userData");
        // Redirect to login page
        router.push("/login");
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    const initMobileMenu = () => {
      // Sidebar toggle to sidebar-folded
      const body = document.body;
      const sidebarTogglers = document.querySelectorAll(".sidebar-toggler");
      // there are two sidebar togglers.
      // 1: on sidebar - for min-width 992px (laptop, desktop)
      // 2: on navbar - for max-width 991px (mobile phone, tablet)
      if (sidebarTogglers.length) {
        sidebarTogglers.forEach((toggler) => {
          toggler.addEventListener("click", function (e) {
            e.preventDefault();
            document
              .querySelector(".sidebar .sidebar-toggler")
              .classList.toggle("active");
            if (window.matchMedia("(min-width: 992px)").matches) {
              body.classList.toggle("sidebar-folded");
            } else if (window.matchMedia("(max-width: 991px)").matches) {
              body.classList.toggle("sidebar-open");
            }
          });
        });

        // To avoid layout issues, remove body and toggler classes on window resize.
        window.addEventListener(
          "resize",
          function (event) {
            body.classList.remove("sidebar-folded", "sidebar-open");
            document
              .querySelector(".sidebar .sidebar-toggler")
              .classList.remove("active");
          },
          true
        );
      }
    };


    onMounted(() => {
      // checkAdminStatus();
      initMobileMenu();
    });

    return {
      userData,
      logout,
      notifications,
      messages,
      notificationCount,
      messageCount
    };
  },
};
</script>

<template>
  <!-- partial:partials/_navbar.html -->
  <nav class="navbar">
    <div class="navbar-content">
      <div class="logo-mini-wrapper">
        <img
          src="../assets/images/logo-mini-light.png"
          class="logo-mini logo-mini-light"
          alt="logo"
        />
        <img
          src="../assets/images/logo-mini-dark.png"
          class="logo-mini logo-mini-dark"
          alt="logo"
        />
      </div>


      <ul class="navbar-nav">

        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="profileDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
          <!-- {{ userData.name }} -->
          user@user.com
          </a>
          <div class="dropdown-menu p-0" aria-labelledby="profileDropdown">
            <div
              class="d-flex flex-column align-items-center border-bottom px-5 py-3"
            >
              <div class="text-center">
                <p class="fs-16px fw-bolder">{{ userData.name }}</p>
                <p class="fs-12px text-secondary">{{ userData.email }}</p>
              </div>
            </div>
            <ul class="list-unstyled p-1">
              <li class="dropdown-item py-2">
                <a href="/user/edit" class="text-body ms-0">
                  <i class="me-2 icon-md material-icons">edit</i>
                  <span>編輯資料</span>
                </a>
              </li>
              <li class="dropdown-item py-2">
                <div role="button" @click="logout()" class="text-body ms-0">
                  <i class="me-2 icon-md material-icons">logout</i>
                  <span>登出</span>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>

      <a href="#" class="sidebar-toggler">
        <i class="material-icons" style="font-size: 24px">menu</i>
      </a>
    </div>
  </nav>
  <!-- partial -->
</template>