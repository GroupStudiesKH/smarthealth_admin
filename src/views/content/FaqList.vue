<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();
    const faqList = ref([]);
    const loading = ref(false);

    const addFaq = () => {
      router.push({ name: 'faqAdd' });
    };

    const editFaq = (faq) => {
      router.push({ name: 'faqEdit', params: { id: faq.id } });
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
        loading.value = true;
        const response = await apiService.getPosts({type: 'faq'});
        faqList.value = response;
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error('Error fetching FAQ list:', error);
      }
    }

    onMounted(() => {
      fetchFaqList()
    });

    return {
      faqList,
      loading,
      addFaq,
      editFaq,
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
                        <th>排序</th>
                        <th>狀態</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody class="sortable-list">
                      <tr v-for="(faq, index) in faqList" :key="faq.id">
                        <td>{{ faq.title }}</td>
                        <td>
                          {{  faq.sort }}
                        </td>
                        <td>{{ faq.status == 'active' ? '啟用' : '停用' }}</td>
                        <td>
                          <button class="btn btn-sm btn-primary me-2" @click="editFaq(faq)">編輯</button>
                          <button class="btn btn-sm btn-danger" @click="deleteFaq(faq.id)">刪除</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
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