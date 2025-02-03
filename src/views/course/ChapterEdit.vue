<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const editor = ref(null);
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalMessage = ref("");

    const chapter = ref({
      title: "",
      content: "",
      status: "草稿",
      pdfFile: null,
      videoFile: null
    });

    const fetchChapter = async (chapterId) => {
      try {
        // 這裡實作獲取章節數據的 API 呼叫
        console.log("獲取章節數據:", chapterId);
        // 模擬 API 回傳數據
        chapter.value = {
          title: "第一章：健康管理概論",
          content: "章節內容...",
          status: "草稿",
          files: [],
        };
      } catch (error) {
        console.error("獲取章節數據失敗:", error);
        modalMessage.value = "獲取章節數據失敗，請稍後再試";
        showModal.value = true;
      }
    };

    const saveChapter = async () => {
      isLoading.value = true;
      try {
        // 這裡實作保存章節的 API 呼叫
        console.log("保存章節:", chapter.value);
        modalMessage.value = "保存成功";
        showModal.value = true;
        // 返回章節列表頁
        router.push(`/course/${route.params.courseId}/chapters`);
      } catch (error) {
        console.error("保存章節失敗:", error);
        modalMessage.value = "保存失敗，請稍後再試";
        showModal.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    const handlePdfUpload = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        chapter.value.pdfFile = file;
      } else {
        modalMessage.value = "請上傳PDF格式的檔案";
        showModal.value = true;
        event.target.value = '';
      }
    };

    const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      if (file && (file.type === 'video/mp4' || file.type === 'video/quicktime')) {
        chapter.value.videoFile = file;
      } else {
        modalMessage.value = "請上傳MP4或MOV格式的影片";
        showModal.value = true;
        event.target.value = '';
      }
    };

    const removePdf = () => {
      chapter.value.pdfFile = null;
    };

    const removeVideo = () => {
      chapter.value.videoFile = null;
    };

    onMounted(async () => {
      editor.value = await ClassicEditor
        .create(document.querySelector('#editor'))
        .catch(error => {
          console.error(error);
        });

      const chapterId = route.params.chapterId;
      if (chapterId && chapterId !== 'add') {
        await fetchChapter(chapterId);
      }
    });

    return {
      chapter,
      isLoading,
      showModal,
      modalMessage,
      saveChapter,
      handlePdfUpload,
      handleVideoUpload,
      removePdf,
      removeVideo,
      route
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
                <h6 class="card-title">{{ route.params.chapterId === 'add' ? '新增章節' : '編輯章節' }}</h6>

                <form @submit.prevent="saveChapter">
                  <div class="mb-3">
                    <label for="title" class="form-label">章節標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      v-model="chapter.title"
                      required
                    >
                  </div>

                  <div class="mb-3">
                    <label for="editor" class="form-label">章節內容</label>
                    <textarea
                      id="editor"
                      v-model="chapter.content"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="chapter.status"
                    >
                      <option value="草稿">草稿</option>
                      <option value="已發布">已發布</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">PDF檔案</label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".pdf"
                      @change="handlePdfUpload"
                    >
                    <div class="mt-2" v-if="chapter.pdfFile">
                      <div class="d-flex align-items-center mb-2">
                        <span class="me-2">{{ chapter.pdfFile.name }}</span>
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger"
                          @click="removePdf"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">影片檔案</label>
                    <input
                      type="file"
                      class="form-control"
                      accept="video/mp4,video/quicktime"
                      @change="handleVideoUpload"
                    >
                    <div class="mt-2" v-if="chapter.videoFile">
                      <div class="d-flex align-items-center mb-2">
                        <span class="me-2">{{ chapter.videoFile.name }}</span>
                        <button
                          type="button"
                          class="btn btn-sm btn-outline-danger"
                          @click="removeVideo"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      @click="router.push(`/course/${route.params.courseId}/chapters`)"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :disabled="isLoading"
                    >
                      {{ isLoading ? '儲存中...' : '儲存' }}
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

    <!-- 提示彈窗 -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      tabindex="-1"
      :style="{ display: showModal ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">提示</h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
            ></button>
          </div>
          <div class="modal-body">
            {{ modalMessage }}
          </div>
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
  </div>
</template>

<style>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>