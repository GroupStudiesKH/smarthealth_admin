<script>
import { ref, onMounted } from "vue";
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
    const faqList = ref([]);
    const currentFaq = ref({
      id: null,
      title: "",
      content: "",
      order: 0
    });
    const isEditing = ref(false);
    const editor = ref(null);

    const addFaq = () => {
      currentFaq.value = {
        id: Date.now(),
        title: "",
        content: "",
        order: faqList.value.length + 1
      };
      isEditing.value = true;
    };

    const editFaq = (faq) => {
      currentFaq.value = { ...faq };
      isEditing.value = true;
    };

    const saveFaq = () => {
      if (!currentFaq.value.id) {
        faqList.value.push({ ...currentFaq.value });
      } else {
        const index = faqList.value.findIndex(f => f.id === currentFaq.value.id);
        if (index !== -1) {
          faqList.value[index] = { ...currentFaq.value };
        }
      }
      isEditing.value = false;
      currentFaq.value = { id: null, title: "", content: "", order: 0 };
    };

    const deleteFaq = (id) => {
      if (confirm("確定要刪除這個 FAQ 項目嗎？")) {
        const index = faqList.value.findIndex(f => f.id === id);
        if (index !== -1) {
          faqList.value.splice(index, 1);
          // 重新排序
          faqList.value.forEach((faq, idx) => {
            faq.order = idx + 1;
          });
        }
      }
    };

    const moveUp = (index) => {
      if (index > 0) {
        const temp = faqList.value[index];
        faqList.value[index] = faqList.value[index - 1];
        faqList.value[index - 1] = temp;
        // 更新排序
        faqList.value.forEach((faq, idx) => {
          faq.order = idx + 1;
        });
      }
    };

    const moveDown = (index) => {
      if (index < faqList.value.length - 1) {
        const temp = faqList.value[index];
        faqList.value[index] = faqList.value[index + 1];
        faqList.value[index + 1] = temp;
        // 更新排序
        faqList.value.forEach((faq, idx) => {
          faq.order = idx + 1;
        });
      }
    };

    return {
      faqList,
      currentFaq,
      isEditing,
      editor,
      addFaq,
      editFaq,
      saveFaq,
      deleteFaq,
      moveUp,
      moveDown
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
                <div class="table-responsive" v-if="!isEditing">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>排序</th>
                        <th>標題</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(faq, index) in faqList" :key="faq.id">
                        <td>
                          <button class="btn btn-sm btn-outline-secondary me-1" @click="moveUp(index)" :disabled="index === 0">
                            ↑
                          </button>
                          <button class="btn btn-sm btn-outline-secondary" @click="moveDown(index)" :disabled="index === faqList.length - 1">
                            ↓
                          </button>
                        </td>
                        <td>{{ faq.title }}</td>
                        <td>
                          <button class="btn btn-sm btn-primary me-2" @click="editFaq(faq)">編輯</button>
                          <button class="btn btn-sm btn-danger" @click="deleteFaq(faq.id)">刪除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- FAQ 編輯表單 -->
                <div v-if="isEditing" class="mt-3">
                  <div class="mb-3">
                    <label class="form-label">標題</label>
                    <input type="text" class="form-control" v-model="currentFaq.title" />
                  </div>
                  <div class="mb-3">
                    <label class="form-label">內容</label>
                    <ckeditor
                      :editor="editor"
                      v-model="currentFaq.content"
                      :config="{ toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote'] }"
                    ></ckeditor>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-secondary me-2" @click="isEditing = false">取消</button>
                    <button class="btn btn-primary" @click="saveFaq">儲存</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>