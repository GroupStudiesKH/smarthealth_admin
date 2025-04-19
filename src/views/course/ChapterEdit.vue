<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "@/utils/UploadAdapter";
import * as tus from "tus-js-client";

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
    const courseId = route.params.courseId;
    const chapterId = route.params.chapterId;
    const isLoading = ref(false);
    const uploadProgress = ref(0);
    const isVideoUploading = ref(false);
    const videoUploadStatusText = ref("");

    const chapter = ref({
      title: "",
      description: "",
      status: "",
      pdf_file_url: null,
      vimeo_id: null,
      player_embed_url: "",
      manage_link: "",
      vimeo_status: "",
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

    const removeVideo = () => {
      try {
        apiService.removeVimeo({ chapterId: chapterId });

        chapter.value.vimeo_id = null;
        chapter.value.player_embed_url = "";
        chapter.value.manage_link = "";
        chapter.value.vimeo_status = "";
      } catch (error) {
        console.log(error);
      }
    };

    const handleVideoUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        isVideoUploading.value = true;
        isUploading.value = true;
        videoUploadStatusText.value = "正在獲取上傳憑證...";

        // 获取Vimeo上传凭证
        const vimeoIDResult = await apiService.getVimeoID(chapterId, {
          size: file.size,
        });

        // 配置tus上传
        const upload = new tus.Upload(file, {
          uploadUrl: vimeoIDResult.upload_link,
          headers: {
            Accept: "application/vnd.vimeo.*+json;version=3.4",
          },
          method: "PUT", // 使用PUT方法上傳
          chunkSize: 5120000, // 5MB分片大小
          onError: (error) => {
            videoUploadStatusText.value = `上傳失敗: ${error.message}`;
            event.target.value = "";
          },
          onProgress: (bytesUploaded) => {
            uploadProgress.value = (bytesUploaded / file.size) * 100;
            videoUploadStatusText.value = `上傳中: ${uploadProgress.value.toFixed(
              1
            )}%`;
          },
          onSuccess: () => {
            chapter.value.vimeo_id = vimeoIDResult.vimeo_id;
            chapter.value.player_embed_url = vimeoIDResult.player_embed_url;
            chapter.value.manage_link = vimeoIDResult.manage_link;
            apiService.changeVimeoStatus({ vimeoID: chapter.value.vimeo_id });
            videoUploadStatusText.value = "上傳完成";
            event.target.value = "";
            isUploading.value = false;
          },
        });

        videoUploadStatusText.value = "開始上傳資料...";
        upload.start();
      } catch (error) {
        videoUploadStatusText.value = `上傳失敗: ${error.message}`;
        event.target.value = "";
      } finally {
        isVideoUploading.value = false;
        isUploading.value = false;
        setTimeout(() => {
          uploadProgress.value = 0;
        }, 3000);
      }
    };

    const fetchChapter = async () => {
      try {
        // 模擬 API 回傳數據
        const results = await apiService.getChapter(courseId, chapterId);
        chapter.value = results;
      } catch (error) {
        console.error("獲取章節數據失敗:", error);
        alert(`獲取章節數據失敗`);
      }
    };

    const setNoteTime = (index) => {
      // 取得 iframe
      const iframe = document.querySelector('iframe[src*="vimeo.com"]');
      if (!iframe) return;
      // 使用 postMessage 與 Vimeo Player API 互動
      iframe.contentWindow.postMessage({ method: "getCurrentTime" }, "*");
      // 監聽回傳
      const handler = (event) => {
        if (
          event.origin.includes("vimeo.com") &&
          event.data &&
          typeof event.data.value === "number"
        ) {
          // 轉換秒數為 HH:mm:ss
          const sec = Math.floor(event.data.value);
          const h = String(Math.floor(sec / 3600)).padStart(2, "0");
          const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
          const s = String(sec % 60).padStart(2, "0");
          chapter.value.notes[index].time = `${h}:${m}:${s}`;
          window.removeEventListener("message", handler);
        }
      };
      window.addEventListener("message", handler);
    };

    const saveChapter = async () => {
      isLoading.value = true;
      try {
        // 過濾內容為空的筆記
        const filteredNotes = chapter.value.notes.filter(
          (note) => note.content && note.content.trim() !== ""
        );
        const chapterToSave = { ...chapter.value, notes: filteredNotes };
        await apiService.updateChapter(courseId, chapterId, chapterToSave);
        router.push(`/course/${route.params.courseId}/chapters`);
      } catch (error) {
        console.error("保存章節失敗:", error);
        alert(`保存章節失敗`);
      } finally {
        isLoading.value = false;
      }
    };

    const isUploading = ref(false);
    const uploadStatusText = ref("");

    const backToChapterList = () => {
      router.push(`/course/${courseId}/chapters`);
    };

    const handlePdfUpload = async (event) => {
      const file = event.target.files[0];
      if (file && file.type === "application/pdf") {
        try {
          isUploading.value = true;
          uploadStatusText.value = "PDF上傳中...";

          const response = await apiService.chapterPDFUpload(file);

          if (response.status) {
            chapter.value.pdf_file_url = response.content;
            uploadStatusText.value = "";
          }
        } catch (error) {
          uploadStatusText.value = "PDF上傳失敗：" + error.message;
          event.target.value = "";
        } finally {
          isUploading.value = false;
          setTimeout(() => {
            uploadStatusText.value = "";
          }, 3000);
        }
      } else {
        uploadStatusText.value = "請上傳PDF格式的檔案";
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

    function MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new UploadAdapter(loader);
      };
    }

    return {
      chapter,
      isUploading,
      isLoading,
      saveChapter,
      handlePdfUpload,
      handleVideoUpload,
      removePdf,
      removeVideo,
      addNote,
      removeNote,
      route,
      uploadStatusText,
      backToChapterList,
      videoUploadStatusText,
      setNoteTime,
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
        <div class="row mb-4">
          <div class="col-12 mx-auto stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯章節</h6>
                <div class="row">
                  <div class="col-md-6">

                    <div v-if="chapter.vimeo_id" class="video-preview mb-3">
                      <iframe
                        :src="chapter.player_embed_url"
                        v-if="chapter.vimeo_status == 'vimeo_ready'"
                        width="100%"
                        height="600"
                        frameborder="0"
                        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                        title="Untitled"
                      >
                      </iframe>
                      <p v-else>已上傳Vimeo，Vimeo影片處理中，您可以繼續編輯</p>
                    </div>
                    <input
                      type="file"
                      class="form-control"
                      accept=".mp4,.mov"
                      @change="handleVideoUpload"
                    />
                    {{ videoUploadStatusText }}
                    <div v-if="chapter.vimeo_id" class="mt-2">
                      <button
                        type="button"
                        class="btn btn-danger btn-sm"
                        @click="removeVideo"
                      >
                        移除
                      </button>

                      <a
                        :href="`https://vimeo.com${chapter.manage_link}`"
                        target="_blank"
                        class="m-2 btn btn-info btn-sm"
                      >
                        <i class="material-icons align-middle me-1">edit</i>
                        Vimeo編輯
                      </a>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <!-- 影片筆記編輯區塊 -->
                    <div class="mb-3">
                      <label class="form-label">影片筆記</label>
                      <div
                        v-for="(note, index) in chapter.notes"
                        :key="index"
                        class="input-group mb-2"
                      >
                        <input
                          type="text"
                          class="form-control"
                          v-model="note.time"
                          placeholder="時間 (HH:mm:ss)"
                          style="max-width: 120px"
                        />
                        <input
                          type="text"
                          class="form-control"
                          v-model="note.content"
                          placeholder="筆記內容"
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="setNoteTime(index)"
                        >
                          設為目前時間
                        </button>
                        <button
                          class="btn btn-outline-danger"
                          type="button"
                          @click="removeNote(index)"
                        >
                          刪除
                        </button>
                      </div>
                      <button
                        class="btn btn-outline-primary btn-sm"
                        type="button"
                        @click="addNote"
                      >
                        新增筆記
                      </button>
                    </div>
                  </div>
                </div>
                <!-- 章節標題與內容等其他表單欄位 -->
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
                    <div id="editor" v-html="chapter.description"></div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">PDF檔案</label>
                    <input
                      type="file"
                      class="form-control"
                      accept=".pdf"
                      @change="handlePdfUpload"
                    />
                    <div
                      v-if="chapter.pdf_file_url && !uploadStatusText"
                      class="mt-2"
                    >
                      <!-- PDF 檔案顯示區塊 -->
                    </div>
                  </div>
                  <div class="d-flex justify-content-end">
                    <router-link
                      :to="`/course/${courseId}/chapters`"
                      class="btn btn-secondary me-2"
                      >取消</router-link
                    >
                    <button type="submit" class="btn btn-primary">儲存</button>
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
</template>

<style scoped>
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