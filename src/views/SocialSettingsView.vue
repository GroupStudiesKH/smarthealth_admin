<script>
import { ref, onMounted } from 'vue';
import apiService from '@/service/api-service.js';
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import Sidebar from '@/components/Sidebar.vue';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const socialSettings = ref({
      address: '',
      phone: '',
      email: '',
      facebook: '', // 對應 fb_acc
      line: '', // 對應 line_acc
      twitter: '', // 對應 twitter_acc
      youtube: '', // 對應 youtube_acc
    });

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref('');
    const modalTitle = ref('');

    const fetchSocialSettings = async () => {
      try {
        const response = await apiService.getSocialSetting();
        // 將API回傳的資料映射到本地狀態
        socialSettings.value = {
          address: response.address,
          phone: response.phone,
          email: response.email,
          facebook: response.fb_acc,
          line: response.line_acc,
          twitter: response.twitter_acc,
          youtube: response.youtube_acc,
        };
      } catch (error) {
        console.error('獲取社群設定失敗:', error);
        modalTitle.value = '錯誤';
        modalMessage.value = '獲取設定失敗，請重新整理頁面';
        showModal.value = true;
      }
    };

    const saveSocialSettings = async () => {
      try {
        // 在實際應用中，這裡應該調用API保存設定
        console.log('Saving social settings:', socialSettings.value);
        modalTitle.value = '成功';
        modalMessage.value = '社群設定已更新';
        showModal.value = true;
      } catch (error) {
        console.error('Error saving social settings:', error);
        modalTitle.value = '錯誤';
        modalMessage.value = '更新設定失敗，請稍後再試';
        showModal.value = true;
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      fetchSocialSettings();
    });

    return {
      socialSettings,
      errors,
      showModal,
      modalMessage,
      modalTitle,
      saveSocialSettings,
      closeModal,
    };
  },
};
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <div class="page-wrapper">
      <Navbar />

      <div class="page-content">
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">社群設定</h6>
                <form @submit.prevent="saveSocialSettings">
                  <!-- 聯絡資訊 -->
                  <div class="mb-3">
                    <label for="address" class="form-label">地址</label>
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      v-model="socialSettings.address"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="phone" class="form-label">電話</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      v-model="socialSettings.phone"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">電子郵件</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="socialSettings.email"
                      required
                    >
                  </div>

                  <!-- 社群媒體連結 -->
                  <div class="mb-3">
                    <label for="facebook" class="form-label">Facebook 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      id="facebook"
                      v-model="socialSettings.facebook"
                      placeholder="https://facebook.com/your-page"
                    >
                  </div>

                  <div class="mb-3">
                    <label for="twitter" class="form-label">Twitter(X) 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      id="twitter"
                      v-model="socialSettings.twitter"
                      placeholder="https://twitter.com/your-account"
                    >
                  </div>

                  <div class="mb-3">
                    <label for="youtube" class="form-label">YouTube 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      id="youtube"
                      v-model="socialSettings.youtube"
                      placeholder="https://youtube.com/@your-channel"
                    >
                  </div>

                  <div class="mb-3">
                    <label for="line" class="form-label">LINE ID</label>
                    <input
                      type="text"
                      class="form-control"
                      id="line"
                      v-model="socialSettings.line"
                      placeholder="@your-line-id"
                    >
                  </div>

                  <button type="submit" class="btn btn-primary me-2">儲存設定</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" :class="{ show: showModal }" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ modalTitle }}</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ modalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" v-if="showModal"></div>
    </div>
  </div>
</template>