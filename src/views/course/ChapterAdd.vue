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
    const courseId = route.params.courseId;
    const chapterId = route.params.chapterId;
    const isLoading = ref(false)

    const chapter = ref({
      title: "",
      description: "",
      status: "",
      pdf_file_url: null,
    });


    const saveChapter = async () => {
      isLoading.value = true;
      try {
        await apiService.createChapter(courseId, chapter.value)
        router.push(`/course/${route.params.courseId}/chapters`);
      } catch (error) {
        console.error("保存章節失敗:", error);
        alert(`保存章節失敗`)
      } finally {
        isLoading.value = false;
      }
    };

    const isUploading = ref(false);
    const uploadStatusText = ref('');

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

    const backToChapterList = () => {
      router.push(`/course/${courseId}/chapters`);
    };

    onMounted(async () => {

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
      removePdf,
      route,
      uploadStatusText,
      backToChapterList
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
                    <div v-if="chapter.pdf_file_url && !uploadStatusText" class="mt-2">
                      <a :href="chapter.pdf_file_url" target="_blank"
                        >上傳檔案：{{
                          typeof chapter.pdf_file_url === "string"
                            ? chapter.pdf_file_url.split("/").pop()
                            : chapter.pdf_file_url.name
                        }}</a
                      >
                      <button
                        type="button"
                        class="btn btn-danger btn-sm ms-2"
                        @click="removePdf"
                      >
                        移除
                      </button>
                    </div>
                    <div v-else class="text-muted mt-2">
                      {{ uploadStatusText }}
                    </div>

                  </div>



                  <div class="mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="chapter.status"
                    >
                      <option value="publish">顯示</option>
                      <option value="unpublish">隱藏</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-primary me-2"
                    :disabled="isLoading || isUploading"
                  >
                    {{ isLoading ? '儲存中...' : '儲存' }}
                  </button>

                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="backToChapterList()"
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