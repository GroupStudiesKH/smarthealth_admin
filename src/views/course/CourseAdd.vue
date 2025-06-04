<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import apiService from "@/service/api-service.js";
import multiselect from "vue-multiselect";
import UploadAdapter from "@/utils/UploadAdapter";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    multiselect,
  },
  setup() {
    const router = useRouter();
    const editor = ref(null);
    const coverImagePreview = ref(null);
    const isUploading = ref(false);
    const uploadStatusText = ref("");

    const errors = ref({});
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalMessage = ref("");

    const course = ref({
      title: "",
      instructors: [],
      subtitle: "",
      has_certificate: false,
      language: "",
      description: "",
      category: null,
      tags: [],
      is_mandatory: false,
      credit: 0,
      level: 'beginner',
      status: "publish",
      coverImage: null,
    });

    const categories = ref([]);
    const availableTags = ref([]);
    const availableInstructors = ref([]);

    const nameWithPos = ({ name, position }) => {
      return `${name} (${position})`;
    };

    const getInstructor = async () => {
      try {
        const instructorRes = await apiService.getInstructorsOption();
        availableInstructors.value = instructorRes.map((item) => ({
          id: item.id,
          name: item.name,
          position: item.position || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };

    const getTags = async () => {
      try {
        const tagRes = await apiService.getTags({ type: "tag" });
        availableTags.value = tagRes.data;
      } catch (error) {
        console.log(error);
      }
    };

    const getCategory = async () => {
      try {
        const categoryRes = await apiService.getTags({ type: "category" });
        categories.value = categoryRes.data;
      } catch (error) {
        console.log(error);
      }
    };

    const saveCourse = async () => {
      try {
        const sendForm = {
          title: course.value.title,
          subtitle: course.value.subtitle,
          has_certificate: course.value.has_certificate,
          language: course.value.language,
          instructors: course.value.instructors.map(
            (instructor) => instructor.id
          ),
          description: course.value.description,
          tags: course.value.tags.map((item) => item.id),
          status: course.value.status,
          is_mandatory: course.value.is_mandatory,
          credit: course.value.credit,
          coverImage: course.value.coverImage,
          level: course.value.level,
          categories: course.value.category?.id
            ? [course.value.category.id]
            : [],
        };

        await apiService.createCourse(sendForm);
        router.push({ name: "courseList" });
      } catch (error) {
        // 處理後端回傳的驗證錯誤
        if (error.response?.data?.status === 'error') {
          // 處理後端回傳的驗證錯誤
          if (error.response.data.content) {
            // 移除錯誤訊息中的括號和引號
            const cleanedErrors = {};
            for (const [key, value] of Object.entries(error.response.data.content)) {
              cleanedErrors[key] = Array.isArray(value) ? value[0].replace(/[\[\]"]/g, '') : value;
            }
            errors.value = cleanedErrors;

            // 組合所有錯誤訊息
            const errorMessages = Object.values(cleanedErrors).join('<br/>');
            

            showErrorModal("新增失敗：" + (errorMessages|| "未知錯誤"));

          } else {
            // 如果有錯誤訊息但沒有詳細內容
            showErrorModal("新增失敗：" + (error.response.data.message || "儲存失敗"));
          }
        } else {
          // 如果不是預期的錯誤格式，顯示一般錯誤訊息
          showErrorModal("儲存失敗");
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

    const handleCoverImageUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          isUploading.value = true;
          uploadStatusText.value = "上傳中...";

          const response = await apiService.courseImgUpload(file);
          course.value.coverImage = response.url;
          coverImagePreview.value = response.url;
          uploadStatusText.value = "上傳完成";
        } catch (error) {
          uploadStatusText.value = "上傳失敗：" + error.message;
          course.value.coverImage = "";
          event.target.value = "";
        } finally {
          isUploading.value = false;
        }
      }
    };

    const removeCoverImage = () => {
      coverImagePreview.value = null;
      course.value.coverImage = null;
    };

    onMounted(async () => {
      try {
        getTags();
        getCategory();
        getInstructor();

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
        ).then((editorInstance) => {
          editorInstance.model.document.on("change:data", () => {
            course.value.description = editorInstance.getData();
          });
          return editorInstance;
        });
      } catch (error) {
        console.error("初始化失敗:", error);
      }
    });

    function MyCustomUploadAdapterPlugin(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new UploadAdapter(loader);
      };
    }

    return {
      course,
      categories,
      availableTags,
      saveCourse,
      handleCoverImageUpload,
      removeCoverImage,
      coverImagePreview,
      editor,
      availableInstructors,
      nameWithPos,
      errors,
      isLoading,
      showModal,
      modalMessage,
      showErrorModal,
      closeModal,
      showSuccessModal
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
                <h6 class="card-title">新增課程</h6>

                <form @submit.prevent="saveCourse">
                  <div class="mb-3">
                    <label class="form-label">課程標題 <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="course.title"
                      required
                    />
                    <div class="invalid-feedback" v-if="errors.title">{{ errors.title }}</div>

                  </div>

                  <div class="mb-3">
                    <label class="form-label">副標題</label>
                    <input
                      v-model="course.subtitle"
                      type="text"
                      class="form-control"
                      maxlength="100"
                    />
                    <div class="invalid-feedback" v-if="errors.subtitle">{{ errors.subtitle }}</div>

                  </div>

                  <div class="mb-3">
                    <label class="form-label">是否有證書 <span class="text-danger">*</span></label>
                    <select
                      v-model="course.has_certificate"
                      class="form-select"
                      required
                    >
                      <option value="0">否</option>
                      <option value="1">是</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.has_certificate">{{ errors.has_certificate }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程語言 <span class="text-danger">*</span></label>
                    <select v-model="course.language" class="form-select" required>
                      <option value="">請選擇語言</option>
                      <option value="中文">中文</option>
                      <option value="英文">英文</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.language">{{ errors.language }}</div>

                  </div>
                  
                  <div class="mb-3">
                    <label class="form-label">課程等級 <span class="text-danger">*</span></label>
                    <select
                      v-model="course.level"
                      class="form-select"
                      required
                    >
                      <option value="beginner">初級</option>
                      <option value="intermediate">中級</option>
                      <option value="advanced">高級</option>
                      <option value="all_levels">全等級</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.level">{{ errors.level }}</div>
                  </div>

                  <div class="row">
                    <div class="mb-3 col-6">
                      <label class="form-label">講師 <span class="text-danger">*</span></label>
                      <multiselect
                        v-model="course.instructors"
                        :options="availableInstructors"
                        :custom-label="nameWithPos"
                        placeholder="選擇講師"
                        label="name"
                        track-by="name"
                        :multiple="true"
                      >
                        <template v-slot:singleLabel="{ option }">
                          <strong>{{ option.name }}</strong> ({{
                            option.position
                          }})
                        </template>
                      </multiselect>
                      <div class="invalid-feedback" v-if="errors.language">{{ errors.language }}</div>
                    </div>
                    <div class="mb-3 col-6">
                      <label class="form-label">課程屬性 <span class="text-danger">*</span></label>
                      <select
                        class="form-control"
                        v-model="course.is_mandatory"
                      >
                        <option value="1">必修</option>
                        <option value="0">選修</option>
                      </select>
                      <div class="invalid-feedback" v-if="errors.is_mandatory">{{ errors.is_mandatory }}</div>
                    </div>
                    <div class="mb-3 col-6">
                      <label class="form-label">學分數 <span class="text-danger">*</span></label>
                      <input
                        type="number"
                        class="form-control"
                        v-model="course.credit"
                        min="0"
                        step="1"
                      />
                      <div class="invalid-feedback" v-if="errors.credit">{{ errors.credit }}</div>
                    </div>
                    <div class="mb-3 col-6">
                      <label class="form-label">課程分類 <span class="text-danger">*</span></label>
                      <multiselect
                        v-model="course.category"
                        :options="categories"
                        placeholder="選擇分類"
                        label="name"
                        track-by="id"
                      />
                      <div class="invalid-feedback" v-if="errors.category">{{ errors.category }}</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程標籤 <span class="text-danger">*</span></label>
                    <multiselect
                      v-model="course.tags"
                      :options="availableTags"
                      placeholder="選擇標籤"
                      label="name"
                      track-by="id"
                      :multiple="true"
                    />
                    <div class="invalid-feedback" v-if="errors.tags">{{ errors.tags }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程封面</label>
                    <div v-if="coverImagePreview" class="mb-2">
                      <img
                        :src="coverImagePreview"
                        alt="封面預覽"
                        class="img-thumbnail"
                        style="max-width: 200px"
                      />
                      <button
                        type="button"
                        class="btn btn-danger btn-sm ms-2"
                        @click="removeCoverImage"
                      >
                        移除封面
                      </button>
                    </div>
                    <div class="input-group">
                      <input
                        type="file"
                        class="form-control"
                        accept="image/*"
                        @change="handleCoverImageUpload"
                      />
                    </div>
                    <div v-if="isUploading" class="text-muted mt-2">
                      {{ uploadStatusText }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程描述 <span class="text-danger">*</span></label>
                    <div id="editor"></div>
                    <div class="invalid-feedback" v-if="errors.is_mandatory">{{ errors.is_mandatory }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程狀態 <span class="text-danger">*</span></label>
                    <select
                      class="form-select"
                      v-model="course.status"
                      required
                    >
                      <option value="publish">公開</option>
                      <option value="unpublish">非公開</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.status">{{ errors.status }}</div>
                  </div>

                  <button type="submit" class="btn btn-primary me-2">
                    建立課程
                  </button>
                  <button
                    type="button"
                    class="btn btn-light"
                    @click="$router.push({ name: 'courseList' })"
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

  <div class="modal" tabindex="-1" :class="{ 'd-block': showModal }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">提示</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body" v-html="modalMessage">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal-backdrop" v-if="showModal"></div>

</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
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

.cover-image-container {
  max-width: 400px;
}

.cover-preview {
  position: relative;
  margin-bottom: 1rem;
}

.cover-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.cover-preview button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.upload-placeholder {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}
.page-header {
  margin-bottom: 1.5rem;
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

