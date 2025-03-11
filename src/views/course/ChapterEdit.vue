<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "@/utils/UploadAdapter";

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
    const courseId = route.params.courseId;
    const chapterId = route.params.chapterId;

    const chapter = ref({
      title: "",
      description: "",
      status: "",
      pdf_file_url: null,
      video_url: null,
      videoPath: "",
      videoPreview: null,
      notes: [{ time: "", content: "" }],
    });

    const addNote = () => {
      chapter.value.notes.push({
        time: "",
        content: "",
      });
    };

    const removeNote = (index) => {
      chapter.value.notes.splice(index, 1);
    };

    const handleVideoUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        chapter.value.video_url = file;
        chapter.value.videoPath = URL.createObjectURL(file);
        chapter.value.videoPreview = URL.createObjectURL(file);
      }
    };

    const removeVideo = () => {
      chapter.value.video_url = null;
      chapter.value.videoPath = "";
      chapter.value.videoPreview = null;
    };

    const fetchChapter = async () => {
      try {
        // 模擬 API 回傳數據
        const results = await apiService.getChapter(courseId, chapterId);
        chapter.value = results;
      } catch (error) {
        console.error("獲取章節數據失敗:", error);
        modalMessage.value = "獲取章節數據失敗，請稍後再試";
        showModal.value = true;
      }
    };

    const saveChapter = async () => {
      isLoading.value = true;
      try {
        console.log("保存章節:", chapter.value);
        modalMessage.value = "保存成功";
        showModal.value = true;
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
      if (file && file.type === "application/pdf") {
        chapter.value.pdf_file_url = file;
      } else {
        modalMessage.value = "請上傳PDF格式的檔案";
        showModal.value = true;
        event.target.value = "";
      }
    };

    const removePdf = () => {
      chapter.value.pdf_file_url = null;
    };

    onMounted(async () => {
      await fetchChapter();

      editor.value = await ClassicEditor.create(
        document.querySelector("#editor"),
        {
          removePlugins: ["Markdown"],
          extraPlugins: [MyCustomUploadAdapterPlugin],
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "imageUpload",
          ],
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h2",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h3",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
            ],
          },
        }
      )
        .then((editorInstance) => {
          editorInstance.model.document.on("change:data", () => {
            chapter.value.description = editorInstance.getData();
          });
          return editorInstance;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    function MyCustomUploadAdapterPlugin(editor){
      editor.plugins.get("FileRepository").createUploadAdapter = (
        loader
      ) => {
        return new UploadAdapter(loader);
      };
    };

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
      addNote,
      removeNote,
      route,
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
                <h6 class="card-title">
                  {{ route.params.chapterId ? "編輯章節" : "新增章節" }}
                </h6>

                <form @submit.prevent="saveChapter">
                  <div class="mb-3">
                    <label for="title" class="form-label">章節標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      v-model="chapter.title"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="editor" class="form-label">章節內容</label>
                    <div id="editor">{{ chapter.description }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">PDF檔案</label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".pdf"
                      @change="handlePdfUpload"
                    />
                    <div v-if="chapter.pdf_file_url" class="mt-2">
                      <a :href="chapter.pdf_file_url" target="_blank">上傳檔案：{{ typeof chapter.pdf_file_url === 'string' ? chapter.pdf_file_url.split('/').pop() : chapter.pdf_file_url.name }}</a>
                      <button
                        type="button"
                        class="btn btn-danger btn-sm ms-2"
                        @click="removePdf"
                      >
                        移除
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">影片檔案</label>
                    <div v-if="chapter.video_url" class="video-preview mb-3">
                      <div class="video-player">
                        <video
                          ref="videoPlayer"
                          class="w-100"
                          controls
                          style="max-height: 300px; background-color: #000"
                          :src="
                            typeof chapter.video_url === 'string'
                              ? chapter.video_url
                              : URL.createObjectURL(chapter.video_url)
                          "
                        ></video>
                        <div class="video-title mt-2">
                          {{
                            typeof chapter.video_url === "string"
                              ? chapter.video_url.split("/").pop()
                              : chapter.video_url.name
                          }}
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      class="form-control"
                      accept=".mp4,.mov"
                      @change="handleVideoUpload"
                    />
                    <div v-if="chapter.video_url" class="mt-2">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="removeVideo"
                      >
                        移除
                      </button>

                      <button class="m-2 btn btn-info btn-sm">
                        <i class="material-icons align-middle me-1">edit</i>
                        Vimeo編輯
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">影片筆記</label>
                    <div
                      v-for="(note, index) in chapter.notes"
                      :key="index"
                      class="row mb-2"
                    >
                      <div class="col-2">
                        <input
                          type="text"
                          class="form-control"
                          v-model="note.time"
                          placeholder="mm:ss"
                          pattern="\d{2}:\d{2}"
                          title="請輸入正確的時間格式（分:秒）"
                        />
                      </div>
                      <div class="col-9">
                        <input
                          type="text"
                          class="form-control"
                          v-model="note.content"
                          placeholder="筆記內容"
                        />
                      </div>
                      <div class="col-1">
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="removeNote(index)"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary mt-2"
                      @click="addNote"
                    >
                      新增筆記
                    </button>
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

                  <button
                    type="submit"
                    class="btn btn-primary me-2"
                    :disabled="isLoading"
                  >
                    {{ isLoading ? "儲存中..." : "儲存" }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="router.back()"
                  >
                    取消
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>

  <!-- 提示訊息 Modal -->
  <div
    class="modal fade"
    id="messageModal"
    tabindex="-1"
    :class="{ show: showModal }"
    v-if="showModal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">系統提示</h5>
          <button
            type="button"
            class="btn-close"
            @click="showModal = false"
          ></button>
        </div>
        <div class="modal-body">{{ modalMessage }}</div>
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
</template>

<style scoped>
.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.video-preview {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f8f9fa;
}

.video-player {
  width: 100%;
}

.video-title {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.video-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.volume-control {
  cursor: pointer;
}

/* CKEditor 高度设置 */
::v-deep #editor {
  min-height: 400px;
}

::v-deep .ck-editor__main {
  height: calc(100% - 40px);
}

::v-deep .ck-editor__editable {
  min-height: 360px !important;
  height: auto !important;
  overflow-y: auto;
}

.editor-container {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>