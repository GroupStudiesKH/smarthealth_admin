<script>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const password = ref('');
    const password_confirmation = ref('');
    const showSuccessModal = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref('');
    const showErrorModal = ref(false);

    const submitForm = async (e) => {
      e.preventDefault();
      if (password.value !== password_confirmation.value) {
        errorMessage.value = '兩次輸入的密碼不一致';
        showErrorModal.value = true;
        return;
      }

      isLoading.value = true;
      
      try {
        // TODO: 整合 API 重設密碼
        // const response = await axios.post('/api/reset-password', {
        //   token: route.query.token,
        //   password: password.value,
        //   password_confirmation: password_confirmation.value
        // });
        showSuccessModal.value = true;
      } catch (error) {
        errorMessage.value = error.response?.data?.message || '重設密碼失敗';
        showErrorModal.value = true;
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
      password,
      password_confirmation,
      submitForm,
      showSuccessModal,
      closeSuccessModal,
      isLoading,
      errorMessage,
      showErrorModal,
      closeErrorModal
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
                    <h5 class="text-secondary fw-normal mb-4">重設密碼</h5>
                    <p class="mb-4">請輸入您的新密碼。</p>
                    <form class="forms-sample" @submit="submitForm">
                      <div class="mb-3">
                        <label for="password" class="form-label">新密碼</label>
                        <input
                          type="password"
                          class="form-control"
                          id="password"
                          v-model="password"
                          placeholder="請輸入新密碼"
                          required
                        />
                      </div>
                      <div class="mb-3">
                        <label for="password_confirmation" class="form-label">確認密碼</label>
                        <input
                          type="password"
                          class="form-control"
                          id="password_confirmation"
                          v-model="password_confirmation"
                          placeholder="請再次輸入新密碼"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        class="btn btn-primary me-2 mb-2 mb-md-0"
                        :disabled="isLoading"
                      >
                        {{ isLoading ? '處理中...' : '確認重設密碼' }}
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
            <h5 class="modal-title">重設成功</h5>
            <button type="button" class="btn-close" @click="closeSuccessModal"></button>
          </div>
          <div class="modal-body">
            <p>密碼已重設成功，請使用新密碼登入。</p>
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
</template>