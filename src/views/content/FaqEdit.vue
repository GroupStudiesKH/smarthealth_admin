<script>
import { ref, onMounted, nextTick } from "vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const faqList = ref([]);
    const currentFaq = ref({
      id: null,
      title: "",
      content: "",
      sort: 0,
      status: "active",
      type: "faq"
    });
    const showModal = ref(false);
    const editor = ref(null);

    const addFaq = () => {
      currentFaq.value = {
        id: null,
        title: "",
        content: "",
        sort: faqList.value.length + 1,
        status: "active",
        type: "faq"
      };
      showModal.value = true;
    };

    const editFaq = async (faq) => {
      try {
        const response = await apiService.getPost({ id: faq.id });
        currentFaq.value = { ...response };

        editor.value = await ClassicEditor
          .create(document.querySelector('#editor'))
          .then(editor => {
            editor.setData(response.content);
            editor.model.document.on('change:data', () => {
              content.value = editor.getData();
            });
            return editor;
          })

        showModal.value = true;
      } catch (error) {
        console.error('Error fetching FAQ:', error);
        alert('獲取FAQ資料失敗，請稍後再試');
      }
    };

    const saveFaq = async () => {
      if (editor.value) {
        currentFaq.value.content = editor.value.getData();
      }
      try {
        if (!currentFaq.value.id) {
          const response = await apiService.createPost(currentFaq.value);
          faqList.value.push(response);
        } else {
          const response = await apiService.updatePost(currentFaq.value.id, currentFaq.value);
          const index = faqList.value.findIndex(f => f.id === currentFaq.value.id);
          if (index !== -1) {
            faqList.value[index] = response;
          }
        }
        showModal.value = false;
        currentFaq.value = { id: null, title: "", content: "", sort: 0, status: "active", type: "faq" };
      } catch (error) {
        console.error('Error saving FAQ:', error);
        alert('保存失敗，請稍後再試');
      }
    };

    const deleteFaq = async (id) => {
      if (confirm("確定要刪除這個 FAQ 項目嗎？")) {
        try {
          await apiService.deletePost(id);
          const index = faqList.value.findIndex(f => f.id === id);
          if (index !== -1) {
            faqList.value.splice(index, 1);
          }
        } catch (error) {
          console.error('Error deleting FAQ:', error);
          alert('刪除失敗，請稍後再試');
        }
      }
    };

    const fetchFaqList = async () => {
      try {
        const response = await apiService.getPosts({type: 'faq'});
        faqList.value = response;
      } catch (error) {
        console.error('Error fetching FAQ list:', error);
      }
    }

    onMounted(() => {
      fetchFaqList()
    });

    return {
      faqList,
      currentFaq,
      showModal,
      editor,
      addFaq,
      editFaq,
      saveFaq,
      deleteFaq
    };
  }
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
                <div class="d-flex justify-content-end mb-3">
                  <button class="btn btn-primary" @click="addFaq">新增 FAQ</button>
                </div>

                <!-- FAQ 列表 -->
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>標題</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody class="sortable-list">
                      <tr v-for="(faq, index) in faqList" :key="faq.id">
                        <td>{{ faq.title }}</td>
                        <td>
                          <button class="btn btn-sm btn-primary me-2" @click="editFaq(faq)">編輯</button>
                          <button class="btn btn-sm btn-danger" @click="deleteFaq(faq.id)">刪除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- FAQ 編輯模態框 -->
                <div class="modal fade" :class="{ 'show': showModal }" tabindex="-1" :style="{ display: showModal ? 'block' : 'none' }">
                  <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">{{ currentFaq.id ? '編輯' : '新增' }} FAQ</h5>
                        <button type="button" class="btn-close" @click="showModal = false"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-3">
                          <label class="form-label">標題</label>
                          <input type="text" class="form-control" v-model="currentFaq.title" />
                        </div>
                        <div class="mb-3">
                          <label class="form-label">內容</label>
                          <textarea
                            id="editor"
                            v-model="currentFaq.content"
                          ></textarea>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showModal = false">取消</button>
                        <button type="button" class="btn btn-primary" @click="saveFaq">儲存</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-backdrop fade show" v-if="showModal"></div>
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