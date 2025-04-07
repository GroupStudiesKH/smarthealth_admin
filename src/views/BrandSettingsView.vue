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
    const brandSettings = ref({
      siteName: '',
      metaTitle: '',
      metaDescription: '',
      metaImage: '',
      logo: '',
      trackingCode: '',
    });

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref('');
    const modalTitle = ref('');
    const uploadedFiles = ref({
      metaImage: null,
      logo: null
    });

    const handleFileUpload = (event, type) => {
      const file = event.target.files[0];
      if (file) {
        uploadedFiles.value[type] = file;
        // 創建預覽URL
        brandSettings.value[type] = URL.createObjectURL(file);
      }
    };

    const saveBrandSettings = async () => {
      try {
        const settings = [
          { meta_key: 'site_name', meta_value: brandSettings.value.siteName },
          { meta_key: 'meta_title', meta_value: brandSettings.value.metaTitle },
          { meta_key: 'meta_description', meta_value: brandSettings.value.metaDescription },
          { meta_key: 'tracking_code', meta_value: brandSettings.value.trackingCode }
        ];
    
        // 添加圖片文件（如果有上傳）
        if (uploadedFiles.value.metaImage) {
          settings.push({
            meta_key: 'meta_img',
            meta_value: uploadedFiles.value.metaImage
          });
        }
        if (uploadedFiles.value.logo) {
          settings.push({
            meta_key: 'logo_img',
            meta_value: uploadedFiles.value.logo
          });
        }
    
        // 直接傳遞 settings 陣列，不需要額外包裝
        await apiService.updateSiteMetaBatch(settings);
        
        modalTitle.value = '成功';
        modalMessage.value = '品牌設定已更新';
        showModal.value = true;
      } catch (error) {
        console.error('Error saving brand settings:', error);
        modalTitle.value = '錯誤';
        modalMessage.value = '更新設定失敗，請稍後再試';
        showModal.value = true;
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const getBrandSettings = async () => {
      try {
        const response = await apiService.getBrandSetting();
        brandSettings.value = {
          siteName: response.site_name,
          metaTitle: response.meta_title,
          metaDescription: response.meta_description,
          metaImage: response.meta_img,
          logo: response.logo_img,
          trackingCode: response.tracking_code,
        };
      } catch (error) {
        console.error('獲取品牌設定失敗:', error);
        modalTitle.value = '錯誤';
        modalMessage.value = '獲取設定失敗，請重新整理頁面';
        showModal.value = true;
      }
    };

    onMounted(() => {
      getBrandSettings();
    });

    return {
      brandSettings,
      errors,
      showModal,
      modalMessage,
      modalTitle,
      handleFileUpload,
      saveBrandSettings,
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
                <h6 class="card-title">品牌設定</h6>
                <form @submit.prevent="saveBrandSettings">
                  <!-- 網站名稱 -->
                  <div class="mb-3">
                    <label for="siteName" class="form-label">網站名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="siteName"
                      v-model="brandSettings.siteName"
                      required
                    >
                  </div>

                  <!-- Meta 設定 -->
                  <div class="mb-3">
                    <label for="metaTitle" class="form-label">Meta 標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="metaTitle"
                      v-model="brandSettings.metaTitle"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="metaDescription" class="form-label">Meta 描述</label>
                    <textarea
                      class="form-control"
                      id="metaDescription"
                      v-model="brandSettings.metaDescription"
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  <!-- Meta 圖片上傳 -->
                  <div class="row mb-3">
                    <div class="col-md-6">
                      <label for="metaImage" class="form-label">Meta 圖片</label>
                      <input
                        type="file"
                        class="form-control"
                        id="metaImage"
                        accept="image/*"
                        @change="handleFileUpload($event, 'metaImage')"
                      >
                      <img v-if="brandSettings.metaImage" :src="brandSettings.metaImage" class="mt-2" style="max-width: 200px;" />
                    </div>

                    <div class="col-md-6">
                      <label for="logo" class="form-label">Logo</label>
                      <input
                        type="file"
                        class="form-control"
                        id="logo"
                        accept="image/*"
                        @change="handleFileUpload($event, 'logo')"
                      >
                      <img v-if="brandSettings.logo" :src="brandSettings.logo" class="mt-2" style="max-width: 200px;" />
                    </div>
                  </div>
                  <!-- 追蹤碼 -->
                  <div class="mb-3">
                    <label for="trackingCode" class="form-label">追蹤碼</label>
                    <textarea
                      class="form-control"
                      id="trackingCode"
                      v-model="brandSettings.trackingCode"
                      rows="5"
                      placeholder="請輸入 Google Analytics 或其他追蹤碼"
                    ></textarea>
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
