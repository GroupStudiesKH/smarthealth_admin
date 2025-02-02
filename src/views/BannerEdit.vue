<script>
import { onMounted, ref } from "vue";
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
    const route = useRoute();
    const bannerId = route.params.id;

    const bannerData = ref({
      title: "",
      subtitle_1: "",
      subtitle_2: "",
      content: "",
      action_link_href: "",
      action_link_text: "",
      action_link2_href: "",
      action_link2_text: "",
      status: "active",
      image: null,
      sort: null,
    });

    const errors = ref({});
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalMessage = ref("");
    const imagePreview = ref(null);

    const fetchBannerData = async () => {
      try {
        const response = await apiService.bannerShow(bannerId);
        bannerData.value = response;
        if (response.img_url) {
          imagePreview.value = response.img_url;
        }
      } catch (error) {
        console.error("Error fetching banner data:", error);
        showErrorModal("獲取橫幅數據失敗，請稍後再試。");
      }
    };

    const updateBanner = async () => {
      isLoading.value = true;
      try {
        errors.value = {};
        const formData = new FormData();
        Object.keys(bannerData.value).forEach(key => {
          if (bannerData.value[key] !== null) {
            formData.append(key, bannerData.value[key]);
          }
        });


        const response = await apiService.editBanner(bannerId, formData);
        if (response) {
          showSuccessModal("橫幅更新成功");
          router.push('/layout/banner');
        }
      } catch (error) {
        console.error("Error updating banner:", error);
        if (error.response && error.response.data) {
          if (error.response.data.content) {
            errors.value = error.response.data.content;
          } else {
            errors.value = error.response.data;
          }
          showErrorModal("請檢查表單錯誤並重試。");
        } else {
          showErrorModal("橫幅更新失敗：" + (error.message || "未知錯誤"));
        }
      } finally {
        isLoading.value = false;
      }
    };

    const showErrorModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const showSuccessModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const goBack = () => {
      router.push("/layout/banner");
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        bannerData.value.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const clearImage = () => {
      bannerData.value.image = null;
      imagePreview.value = null;
    };

    onMounted(() => {
      fetchBannerData();
    });

    return {
      bannerData,
      updateBanner,
      goBack,
      errors,
      isLoading,
      showModal,
      modalMessage,
      closeModal,
      handleImageChange,
      imagePreview,
      clearImage,
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
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title mb-4">編輯橫幅</h4>
                <form @submit.prevent="updateBanner" enctype="multipart/form-data" class="w-100">
                  <div class="row">
                    <div class="col-md-6">

                      <div class="mb-3">
                        <label for="lang" class="form-label">橫幅語系</label>
                        <select class="form-select" id="lang" v-model="bannerData.lang" :class="{ 'is-invalid': errors.lang }">
                          <option value="en">英文</option>
                          <option value="jpy">日文</option>
                        </select>
                        <div class="invalid-feedback" v-if="errors.lang">{{ errors.lang.join(', ') }}</div>
                      </div>

                        
                      <div class="mb-3">
                        <label for="title" class="form-label">標題</label>
                        <input type="text" class="form-control" id="title" v-model="bannerData.title" :class="{ 'is-invalid': errors.title }">
                        <div class="invalid-feedback" v-if="errors.title">{{ errors.title.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="subtitle_1" class="form-label">副標題1</label>
                        <input type="text" class="form-control" id="subtitle_1" v-model="bannerData.subtitle_1" :class="{ 'is-invalid': errors.subtitle_1 }">
                        <div class="invalid-feedback" v-if="errors.subtitle_1">{{ errors.subtitle_1.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="subtitle_2" class="form-label">副標題2</label>
                        <input type="text" class="form-control" id="subtitle_2" v-model="bannerData.subtitle_2" :class="{ 'is-invalid': errors.subtitle_2 }">
                        <div class="invalid-feedback" v-if="errors.subtitle_2">{{ errors.subtitle_2.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="content" class="form-label">內容</label>
                        <textarea class="form-control" id="content" v-model="bannerData.content" :class="{ 'is-invalid': errors.content }"></textarea>
                        <div class="invalid-feedback" v-if="errors.content">{{ errors.content.join(', ') }}</div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="action_link_href" class="form-label">行動連結網址</label>
                        <input type="text" class="form-control" id="action_link_href" v-model="bannerData.action_link_href" :class="{ 'is-invalid': errors.action_link_href }">
                        <div class="invalid-feedback" v-if="errors.action_link_href">{{ errors.action_link_href.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="action_link_text" class="form-label">行動連結文字</label>
                        <input type="text" class="form-control" id="action_link_text" v-model="bannerData.action_link_text" :class="{ 'is-invalid': errors.action_link_text }">
                        <div class="invalid-feedback" v-if="errors.action_link_text">{{ errors.action_link_text.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="action_link2_href" class="form-label">行動連結2網址</label>
                        <input type="text" class="form-control" id="action_link2_href" v-model="bannerData.action_link2_href" :class="{ 'is-invalid': errors.action_link2_href }">
                        <div class="invalid-feedback" v-if="errors.action_link2_href">{{ errors.action_link2_href.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="action_link2_text" class="form-label">行動連結2文字</label>
                        <input type="text" class="form-control" id="action_link2_text" v-model="bannerData.action_link2_text" :class="{ 'is-invalid': errors.action_link2_text }">
                        <div class="invalid-feedback" v-if="errors.action_link2_text">{{ errors.action_link2_text.join(', ') }}</div>
                      </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                        <label for="status" class="form-label">狀態</label>
                        <select class="form-select" id="status" v-model="bannerData.status" :class="{ 'is-invalid': errors.status }">
                          <option value="active">啟用</option>
                          <option value="inactive">未啟用</option>
                        </select>
                        <div class="invalid-feedback" v-if="errors.status">{{ errors.status.join(', ') }}</div>
                      </div>

                      <div class="mb-3">
                        <label for="image" class="form-label">圖片</label>
                        <input type="file" class="form-control" id="image" @change="handleImageChange" :class="{ 'is-invalid': errors.image }" accept=".jpg,.jpeg,.gif,.png,.webp">
                        <small class="form-text text-muted">只能上傳 jpg、jpeg、gif、png 或 webp 格式的圖片</small>
                        <div class="invalid-feedback" v-if="errors.image">{{ errors.image.join(', ') }}</div>
                        <div v-if="imagePreview" class="mt-2">
                          <img :src="imagePreview" alt="Banner Preview" class="img-fluid" style="max-width: 200px;">
                          <br>
                          <button type="button" class="btn btn-sm btn-danger mt-2" @click="clearImage">清除圖片</button>
                        </div>
                      </div>

                      <div class="mb-3">
                        <label for="sort" class="form-label">排序</label>
                        <input type="number" class="form-control" id="sort" v-model="bannerData.sort" :class="{ 'is-invalid': errors.sort }">
                        <div class="invalid-feedback" v-if="errors.sort">{{ errors.sort.join(', ') }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4">
                    <button type="submit" class="btn btn-primary me-2" :disabled="isLoading">
                      {{ isLoading ? '更新中...' : '更新橫幅' }}
                    </button>
                    <button type="button" class="btn btn-secondary" @click="goBack" :disabled="isLoading">
                      返回
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>

  <!-- Modal -->
  <div class="modal-backdrop" v-if="showModal" @click="closeModal"></div>
  <div class="modal" tabindex="-1" :class="{ 'd-block': showModal }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">提示</h5>
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
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
}
</style>
