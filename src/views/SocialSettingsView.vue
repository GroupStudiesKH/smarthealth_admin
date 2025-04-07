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

    // 解析API錯誤訊息
    const parseApiErrors = (error) => {
      const errorData = error.response?.data?.errors || {};
      const parsedErrors = {};
      
      Object.entries(errorData).forEach(([key, messages]) => {
        // 將 meta_value.fb_acc 轉換為 facebook 等
        const field = key.replace('meta_value.', '');
        
        // 根據後端驗證規則解析錯誤訊息
        if (field.includes('_acc')) {
          const socialField = field.replace('_acc', '');
          const fieldMap = {
            'fb': 'facebook',
            'line': 'line',
            'twitter': 'twitter',
            'youtube': 'youtube'
          };
          parsedErrors[fieldMap[socialField] || socialField] = messages[0];
        } else {
          // 處理一般欄位錯誤
          parsedErrors[field] = messages[0];
        }
      });
      
      return parsedErrors;
    };

    const fetchSocialSettings = async () => {
      try {
        const response = await apiService.getSocialSetting();
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
        errors.value = {}; // 重置錯誤訊息
        const settings = [
          { meta_key: 'address', meta_value: { address: socialSettings.value.address } },
          { meta_key: 'phone', meta_value: { phone: socialSettings.value.phone } },
          { meta_key: 'email', meta_value: { email: socialSettings.value.email } },
          { meta_key: 'fb_acc', meta_value: { fb_acc: socialSettings.value.facebook } },
          { meta_key: 'line_acc', meta_value: { line_acc: socialSettings.value.line } },
          { meta_key: 'twitter_acc', meta_value: { twitter_acc: socialSettings.value.twitter } },
          { meta_key: 'youtube_acc', meta_value: { youtube_acc: socialSettings.value.youtube } }
        ];

        await apiService.updateSiteMetaBatch({ settings });
        
        modalTitle.value = '成功';
        modalMessage.value = '社群設定已更新';
        showModal.value = true;
      } catch (error) {
        console.error('Error saving social settings:', error);
        errors.value = parseApiErrors(error);
        modalTitle.value = '錯誤';
        modalMessage.value = '更新設定失敗，請檢查輸入內容';
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
                      :class="{ 'is-invalid': errors.address }"
                      id="address"
                      v-model="socialSettings.address"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.address">
                      {{ errors.address }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="phone" class="form-label">電話</label>
                    <input
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': errors.phone }"
                      id="phone"
                      v-model="socialSettings.phone"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.phone">
                      {{ errors.phone }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">電子郵件</label>
                    <input
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': errors.email }"
                      id="email"
                      v-model="socialSettings.email"
                      required
                    >
                    <div class="invalid-feedback" v-if="errors.email">
                      {{ errors.email }}
                    </div>
                  </div>

                  <!-- 社群媒體連結 -->
                  <div class="mb-3">
                    <label for="facebook" class="form-label">Facebook 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      :class="{ 'is-invalid': errors.fb_acc }"
                      id="facebook"
                      v-model="socialSettings.facebook"
                      placeholder="https://facebook.com/your-page"
                    >
                    <div class="invalid-feedback" v-if="errors.facebook">
                      {{ errors.facebook }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="twitter" class="form-label">Twitter(X) 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      :class="{ 'is-invalid': errors.twitter_acc }"
                      id="twitter"
                      v-model="socialSettings.twitter"
                      placeholder="https://twitter.com/your-account"
                    >
                    <div class="invalid-feedback" v-if="errors.twitter">
                      {{ errors.twitter }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="youtube" class="form-label">YouTube 連結</label>
                    <input
                      type="url"
                      class="form-control"
                      :class="{ 'is-invalid': errors.youtube_acc }"
                      id="youtube"
                      v-model="socialSettings.youtube"
                      placeholder="https://youtube.com/@your-channel"
                    >
                    <div class="invalid-feedback" v-if="errors.youtube">
                      {{ errors.youtube }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="line" class="form-label">LINE ID</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.line_acc }"
                      id="line"
                      v-model="socialSettings.line"
                      placeholder="@your-line-id"
                    >
                    <div class="invalid-feedback" v-if="errors.line">
                      {{ errors.line }}
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary me-2">儲存設定</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal fade" :class="{ 'show': showModal }" tabindex="-1" style="display: block;" v-if="showModal">
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