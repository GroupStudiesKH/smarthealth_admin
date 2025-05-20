<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const aboutData = ref({
      key_person_title: "",
      key_person_chinese_name: "",
      key_person_english_name: "",
      key_person_pic: "",
      section_1: "",
      section_2_title: "",
      section_2_content: "",
      section_3_title: "",
      section_3_content: "",
      section_4_title: "",
      section_4_content: ""
    });
    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref("");
    const loading = ref(false);

    const getAboutData = async () => {
      try {
        loading.value = true;
        const response = await apiService.getAbout();
        aboutData.value = { ...aboutData.value, ...response };
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("Error fetching about data:", error);
        alert("獲取關於我們資料失敗，請稍後再試");
      }
    };

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        // 創建預覽URL
        const previewUrl = URL.createObjectURL(file);
        aboutData.value = {
          ...aboutData.value,
          key_person_pic: file,
          preview_url: previewUrl // 添加預覽URL
        };
      }
    };

    const saveAboutData = async () => {
      try {
        loading.value = true;
        const formData = new FormData();
        
        // 遍歷所有欄位並加入 FormData
        Object.entries(aboutData.value).forEach(([key, value]) => {
          // 跳過預覽URL
          if (key === 'preview_url') return;
          
          // 處理圖片欄位
          if (key === 'key_person_pic') {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });

        const response = await apiService.updateAbout(formData);
        modalMessage.value = "儲存成功";
        showModal.value = true;
        loading.value = false;

        // 更新成功後重新獲取資料
        await getAboutData();
      } catch (error) {
        loading.value = false;
        console.error("Failed to save about data:", error);
    
        if (error.response?.data?.status === "error") {
          if (error.response.data.content) {
            const cleanedErrors = {};
            for (const [key, value] of Object.entries(
              error.response.data.content
            )) {
              cleanedErrors[key] = Array.isArray(value)
                ? value[0].replace(/[\[\]"]/g, "")
                : value;
            }
            errors.value = cleanedErrors;
    
            const errorMessages = Object.values(cleanedErrors).join("<br/>");
            modalMessage.value = errorMessages;
            showModal.value = true;
          } else {
            modalMessage.value = error.response.data.message || "儲存失敗";
            showModal.value = true;
          }
        } else {
          modalMessage.value = "儲存失敗";
          showModal.value = true;
        }
      }
    };

    onMounted(() => {
      getAboutData();
    })

    // 在 setup 中的 return 添加 preview_url
    return {
      aboutData,
      errors,
      showModal,
      modalMessage,
      loading,
      getAboutData,
      saveAboutData,
      handleFileChange
    };
  },
};
</script>

<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />
    <div class="page-wrapper">
      <div class="page-content">
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">關於我們編輯</h6>
                <div class="row mb-4">
                  <div class="col-12 mb-3">
                    <label class="form-label">關鍵人物職稱</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.key_person_title"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">關鍵人物中文姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.key_person_chinese_name"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">關鍵人物英文姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.key_person_english_name"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">關鍵人物照片</label>
                    <input
                      type="file"
                      class="form-control"
                      @change="handleFileChange"
                      accept="image/*"
                    />
                    <!-- 圖片預覽區域 -->
                    <div class="image-preview mt-2" v-if="aboutData.preview_url || aboutData.key_person_pic">
                      <img
                        :src="aboutData.preview_url || aboutData.key_person_pic"
                        alt="Key Person Picture Preview"
                        style="max-width: 200px"
                      />
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第一段內容</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="aboutData.section_1"
                      style="white-space: pre-wrap;"
                    ></textarea>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第二段標題</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.section_2_title"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第二段內容</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="aboutData.section_2_content"
                      style="white-space: pre-wrap;"
                    ></textarea>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第三段標題</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.section_3_title"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第三段內容</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="aboutData.section_3_content"
                      style="white-space: pre-wrap;"
                    ></textarea>
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第四段標題</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="aboutData.section_4_title"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label class="form-label">第四段內容</label>
                    <textarea
                      class="form-control"
                      rows="5"
                      v-model="aboutData.section_4_content"
                      style="white-space: pre-wrap;"
                    ></textarea>
                  </div>
                </div>
                <button
                  type="button"
                  class="btn btn-primary me-2"
                  @click="saveAboutData"
                  :disabled="loading"
                >
                  {{ loading ? '儲存中...' : '儲存' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      :class="{ show: showModal }"
      :style="{ display: showModal ? 'block' : 'none' }"
      aria-modal="true"
      role="dialog"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">系統訊息</h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
              aria-label="btn-close"
            ></button>
          </div>
          <div class="modal-body" v-html="modalMessage"></div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="showModal = false"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal-backdrop fade show"
      v-if="showModal"
      @click="showModal = false"
    ></div>
    <Loading v-if="loading" />
  </div>
</template>