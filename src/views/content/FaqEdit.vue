<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const route = useRoute();
    const faqList = ref([]);
    const currentFaq = ref({
      id: null,
      title: "",
      content: "",
      sort: 0,
      status: "active",
      type: "faq",
    });

    const editor = ref(null);
    const content = ref("");

    const editFaq = async () => {
      try {
        const response = await apiService.getPost({ id: route.params.id });
        currentFaq.value = { ...response };

        editor.value = await ClassicEditor.create(
          document.querySelector("#editor")
        ).then((editor) => {
          editor.setData(response.content);
          editor.model.document.on("change:data", () => {
            content.value = editor.getData();
          });
          return editor;
        });

      } catch (error) {
        console.error("Error fetching FAQ:", error);
        alert("獲取FAQ資料失敗，請稍後再試");
      }
    };

    const saveFaq = async (faq) => {
      if (!faq.title || !faq.content) {
        alert("標題和內容為必填欄位");
        return;
      }
      if (editor.value) {
        currentFaq.value.content = editor.value.getData();
      }
      try {
        if (!currentFaq.value.id) {
          const response = await apiService.createPost(currentFaq.value);
          faqList.value.push(response);
        } else {
          const response = await apiService.updatePost(
            currentFaq.value.id,
            currentFaq.value
          );
          const index = faqList.value.findIndex(
            (f) => f.id === currentFaq.value.id
          );
          if (index !== -1) {
            faqList.value[index] = response;
          }
        }
        currentFaq.value = {
          id: null,
          title: "",
          content: "",
          sort: 0,
          status: "active",
          type: "faq",
        };
      } catch (error) {
        console.error("Error saving FAQ:", error);
        alert("保存失敗，請稍後再試");
      }
    };

    const deleteFaq = async (id) => {
      if (confirm("確定要刪除這個 FAQ 項目嗎？")) {
        try {
          await apiService.deletePost(id);
          const index = faqList.value.findIndex((f) => f.id === id);
          if (index !== -1) {
            faqList.value.splice(index, 1);
          }
        } catch (error) {
          console.error("Error deleting FAQ:", error);
          alert("刪除失敗，請稍後再試");
        }
      }
    };


    onMounted(() => {
      editFaq();
    });

    return {
      faqList,
      currentFaq,
      editor,
      editFaq,
      saveFaq,
      deleteFaq,
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
                <h6 class="card-title">FAQ 管理</h6>
                <div class="row mb-4">
                  <div class="col-12">
                    <label class="form-label">標題</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="currentFaq.title"
                    />
                  </div>
                  <div class="col-12 my-3">
                    <label class="form-label">內容編輯</label>

                    <div id="editor"></div>
                  </div>
                  <div class="col-6">
                    <label class="form-label">狀態</label>
                    <select class="form-select" v-model="currentFaq.status">
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
                    </select>
                  </div>
                  <div class="col-6">
                    <label class="form-label">排序</label>
                    <input
                      type="number"
                      class="form-control"
                      v-model.number="currentFaq.sort"
                    />
                  </div>
                  <div class="col-12 d-flex align-items-end my-3">
                    <button class="btn btn-primary w-100" @click="saveFaq">
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
  </div>
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