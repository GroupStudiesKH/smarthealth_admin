<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/service/api-service';
import Loading from "@/components/loading.vue";


export default {
  components: {
    Loading
  },
  setup() {
    const router = useRouter();
    const email = ref('');
    const showSuccessModal = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const showErrorModal = ref(false);

    const submitForm = async (e) => {
      e.preventDefault();
      isLoading.value = true;
      
      try {
        isLoading.value = true;
        await apiService.forgetPassword({ email: email.value});
        isLoading.value = false;
        showSuccessModal.value = true;
      } catch (error) {
        errorMessage.value = error.response?.data?.message || '發送重設密碼信件失敗';
        showErrorModal.value = true;
        isLoading.value = false;
      } finally {
        isLoading.value = false;
      }
    };

    const closeSuccessModal = () => {
      showSuccessModal.value = false;
      router.push('/login');
    };

    const closeErrorModal = () => {
      showErrorModal.value = false;
    };

    return {
      email,
      submitForm,
      showSuccessModal,
      closeSuccessModal,
      isLoading,
      errorMessage,
      showErrorModal,
      closeErrorModal,
      isLoading
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <div class="page-wrapper full-page">
      <div class="page-content d-flex align-items-center justify-content-center">
        <div class="row w-100 mx-0 auth-page">
          <div class="col-md-10 col-lg-8 col-xl-6 mx-auto">
            <div class="card">
              <div class="row">
                <div class="col-md-4 pe-md-0">
                  <div class="auth-side-wrapper" style="background-image: url('assets/images/login.webp')"></div>
                </div>
                <div class="col-md-8 ps-md-0">
                  <div class="auth-form-wrapper px-4 py-5">
                    <a href="#" class="nobleui-logo d-block mb-2">Smart<span>Health</span></a>
                    <h5 class="text-secondary fw-normal mb-4">忘記密碼？</h5>
                    <p class="mb-4">請輸入您的電子郵件地址，我們將發送重設密碼的連結給您。</p>
                    <form class="forms-sample" @submit="submitForm">
                      <div class="mb-3">
                        <label for="userEmail" class="form-label">Email</label>
                        <input
                          type="email"
                          class="form-control"
                          id="userEmail"
                          v-model="email"
                          placeholder="請輸入您的 Email"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary me-2 mb-2 mb-md-0"
                        :disabled="isLoading"
                      >
                        {{ isLoading ? '處理中...' : '發送重設密碼連結' }}
                      </button>
                      <router-link to="/login" class="btn btn-secondary">
                        返回登入
                      </router-link>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功訊息 Modal -->
    <div class="modal fade" :class="{ 'show': showSuccessModal }" tabindex="-1" style="display: block;" v-if="showSuccessModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">發送成功</h5>
            <button type="button" class="btn-close" @click="closeSuccessModal"></button>
          </div>
          <div class="modal-body">
            <p>重設密碼連結已發送至您的信箱，請查收並點擊連結重設密碼。</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeSuccessModal">確定</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 錯誤訊息 Modal -->
    <div class="modal fade" :class="{ 'show': showErrorModal }" tabindex="-1" style="display: block;" v-if="showErrorModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">錯誤</h5>
            <button type="button" class="btn-close" @click="closeErrorModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ errorMessage }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="closeErrorModal">確定</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Loading v-if="isLoading" />
</template>