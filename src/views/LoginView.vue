<script>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();

    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showErrorModal = ref(false);
    const errorMessage = ref("");
    const isLoading = ref(false);
    const showHint = ref(false);

    const loginForm = async () => {
      showHint.value = true;
      isLoading.value = true;
      try {
        const response = await apiService.adminLogin({
          email: email.value,
          password: password.value,
        });

        if (response && response.original.access_token) {
          const token = response.original.access_token;
          if (rememberMe.value) {
            localStorage.setItem("access_token", token);
          } else {
            sessionStorage.setItem("access_token", token);
          }

          const userData = await apiService.adminMe();
          // Store user data in sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(userData));

          // Redirect to dashboard
          router.push('/');
        } else {
          errorMessage.value = "登入失敗：無效的回應格式";
          showErrorModal.value = true;
          console.error("Invalid response format:", response);
        }
      } catch (error) {
        errorMessage.value =
          "登入失敗：" + (error.response?.data?.message || "未知錯誤");
        showErrorModal.value = true;
        console.error("Login error:", error);
      } finally {
        isLoading.value = false;
        showHint.value = ''

      }
    };

    const closeErrorModal = () => {
      showErrorModal.value = false;
    };

    return {
      email,
      password,
      rememberMe,
      loginForm,
      showErrorModal,
      errorMessage,
      closeErrorModal,
      isLoading,
      showHint,
    };
  },
};
</script>

<template>
  <div class="main-wrapper">
    <div class="page-wrapper full-page">
      <div
        class="page-content d-flex align-items-center justify-content-center"
      >
        <div class="row w-100 mx-0 auth-page">
          <div class="col-md-10 col-lg-8 col-xl-6 mx-auto">
            <div class="card">
              <div class="row">
                <div class="col-md-4 pe-md-0">
                  <div
                    class="auth-side-wrapper"
                    style="background-image: url('assets/images/login.webp')"
                  ></div>
                </div>
                <div class="col-md-8 ps-md-0">
                  <div class="auth-form-wrapper px-4 py-5">
                    <a href="#" class="nobleui-logo d-block mb-2"
                      >Smart<span>Health</span></a
                    >
                    <h5 class="text-secondary fw-normal mb-4">
                      請輸入您的帳號密碼
                    </h5>
                    <form class="forms-sample" @submit.prevent="loginForm">
                      <div class="mb-3">
                        <label for="userEmail" class="form-label">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          v-model="email"
                          id="userEmail"
                          placeholder="Email"
                          required
                        />
                      </div>
                      <div class="mb-3">
                        <label for="userPassword" class="form-label"
                          >密碼</label
                        >
                        <input
                          type="password"
                          class="form-control"
                          id="userPassword"
                          autocomplete="current-password"
                          v-model="password"
                          placeholder="密碼"
                          required
                        />
                      </div>
                      <div class="form-check mb-3">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          id="authCheck"
                          v-model="rememberMe"
                        />
                        <label class="form-check-label" for="authCheck">
                          記住我
                        </label>
                      </div>
                      <div class="mb-3">
                        <router-link to="/forgot-password" class="text-primary text-decoration-none">
                          忘記密碼？
                        </router-link>
                      </div>
                      <div>
                        <button
                          type="submit"
                          class="btn btn-primary me-2 mb-2 mb-md-0 text-white"
                          :disabled="isLoading"
                        >
                          <span
                            v-if="isLoading"
                            class="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {{ isLoading ? "登入中..." : "登入" }}
                        </button>
                      </div>
                    </form>
                    <div class="mt-3 text-info" style="min-height: 30px;">
                      <span v-if="showHint">
                        {{
                          isLoading
                            ? "正在處理您的登入請求..."
                            : "請稍候，我們正在驗證您的帳號..."
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  <div
    class="modal fade"
    tabindex="-1"
    :class="{ 'show d-block': showErrorModal }"
    :style="{ display: showErrorModal ? 'block' : 'none' }"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">登入錯誤</h5>
          <button
            type="button"
            class="btn-close"
            @click="closeErrorModal"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ errorMessage }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="closeErrorModal"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showErrorModal"></div>
</template>
