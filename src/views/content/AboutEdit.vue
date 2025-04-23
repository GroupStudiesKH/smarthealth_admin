<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import UploadAdapter from "@/utils/UploadAdapter";
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
    const postList = ref([]);
    const currentpost = ref({
      id: null,
      title: "",
      content: "",
      sort: 0,
      status: "active",
      type: "post",
    });
    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref("");
    const editor = ref(null);
    const loading = ref(false);

    const editpost = async () => {
      try {
        loading.value = true;
        const response = await apiService.getPost({ type: 'about' });
        currentpost.value = { ...response };
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("Error fetching post:", error);
        alert("獲取文章資料失敗，請稍後再試");
      }
    };

    const savepost = async () => {
      try {
        loading.value = true;
        const response = await apiService.updatePost(
            currentpost.value.id,
            currentpost.value
          );
      
          modalMessage.value = "儲存成功";
          showModal.value = true;
          loading.value = false;
          
      } catch (error) {
        loading.value = false;
        console.error("Failed to save member:", error);

        // 處理後端回傳的驗證錯誤
        if (error.response?.data?.status === "error") {
          // 處理後端回傳的驗證錯誤
          if (error.response.data.content) {
            // 移除錯誤訊息中的括號和引號
            const cleanedErrors = {};
            for (const [key, value] of Object.entries(
              error.response.data.content
            )) {
              cleanedErrors[key] = Array.isArray(value)
                ? value[0].replace(/[\[\]"]/g, "")
                : value;
            }
            errors.value = cleanedErrors;

            // 組合所有錯誤訊息
            const errorMessages = Object.values(cleanedErrors).join("<br/>");

            modalMessage.value = errorMessages;
            showModal.value = true;
          } else {
            // 如果有錯誤訊息但沒有詳細內容
            modalMessage.value = error.response.data.message || "儲存失敗";
            showModal.value = true;
          }
        } else {
          // 如果不是預期的錯誤格式，顯示一般錯誤訊息
          modalMessage.value = "儲存失敗";
          showModal.value = true;
        }
      }
    };



    onMounted(async () => {
      await editpost();

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
            currentpost.value.content = editorInstance.getData();
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
      postList,
      currentpost,
      editor,
      editpost,
      savepost,
      showModal,
      modalMessage,
      errors,
      loading,
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
                  <div class="col-12">
                    <label class="form-label">標題</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      v-model="currentpost.title"
                    />
                  </div>
                  <div class="col-12 my-3">
                    <label class="form-label">內容編輯</label>
                    <div id="editor" v-html="currentpost.content"></div>
                  </div>
                  <div class="col-6">
                    <label class="form-label">狀態</label>
                    <select class="form-select" v-model="currentpost.status">
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
                    </select>
                  </div>
                  <div class="col-6 d-flex align-items-end">
                    <button class="btn btn-primary w-100" @click="savepost">
                      儲存變更
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>

    <!-- Error Modal -->
    <div
      class="modal fade"
      :class="{ show: showModal }"
      tabindex="-1"
      :style="{ display: showModal ? 'block' : 'none' }"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">錯誤提示</h5>
            <button
              type="button"
              class="btn-close"
              @click="showModal = false"
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
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
  <Loading v-if="loading" />
</template>

<style scoped>
.cursor-move {
  cursor: move;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}
.modal {
  z-index: 1050;
}
:deep .ck-editor__editable {
  min-height: 500px;
}
</style>