<script>
import { ref, onMounted, nextTick } from "vue";
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
    const showModal = ref(false);
    const editor = ref(null);

    const addFaq = () => {
      currentFaq.value = {
        id: Date.now(),
        title: "",
        content: "",
        order: faqList.value.length + 1
      };
      showModal.value = true;
    };

    const editFaq = (faq) => {
      currentFaq.value = { ...faq };
      showModal.value = true;
      // 使用 nextTick 確保 DOM 更新後再設定編輯器內容
      nextTick(() => {
        if (editor.value) {
          editor.value.setData(faq.content);
        }
      });
    };

    const saveFaq = () => {
      if (editor.value) {
        currentFaq.value.content = editor.value.getData();
      }
      if (!currentFaq.value.id) {
        faqList.value.push({ ...currentFaq.value });
      } else {
        const index = faqList.value.findIndex(f => f.id === currentFaq.value.id);
        if (index !== -1) {
          faqList.value[index] = { ...currentFaq.value };
        }
      }
      showModal.value = false;
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

    onMounted(async () => {
      editor.value = await ClassicEditor
        .create(document.querySelector('#editor'), {
          minHeight: '500px',
          height: '500px'
        })
        .catch(error => {
          console.error(error);
        });
      faqList.value = [
        {
          id: 1,
          title: "如何開始使用智慧健康管理平台？",
          content: "註冊帳號後，您可以立即開始使用我們的健康管理功能。首先，請完善您的個人健康檔案，接著您就可以使用各項功能，包括健康數據追蹤、營養建議等服務。",
          order: 1
        },
        {
          id: 2,
          title: "平台提供哪些主要功能？",
          content: "我們的平台提供以下主要功能：<br>1. 個人健康數據追蹤<br>2. 即時健康分析報告<br>3. 專業醫療諮詢服務<br>4. 營養管理建議<br>5. 運動計劃制定",
          order: 2
        },
        {
          id: 3,
          title: "如何確保我的健康數據安全？",
          content: "我們採用最先進的加密技術保護您的健康數據。所有資料都經過加密存儲，並且只有經過授權的醫療人員才能查看您的健康記錄。",
          order: 3
        },
        {
          id: 4,
          title: "是否提供緊急醫療協助？",
          content: "是的，我們提供24小時緊急醫療諮詢服務。如果您遇到緊急情況，可以通過平台快速聯繫醫療人員獲得協助。",
          order: 4
        },
        {
          id: 5,
          title: "如何更新個人健康資料？",
          content: "登入後，點擊「個人檔案」選項，您可以隨時更新您的健康資料，包括基本資料、病史、過敏史等重要信息。",
          order: 5
        }
      ];

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
</style>