<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const modalMessage = ref('');
    const showModal = ref(false);
    const tableData = ref([]);

    const tableColumns = reactive([
      { key: "id", label: "編號" },
      { key: "title", label: "主要標題" },
      { key: "status", label: "狀態" },
      { key: "img_url", label: "圖片" },
      { key: "actions", label: "操作" },
    ]);

    const fetchTableData = async () => {
      try {
        // 呼叫 API 取得 Banner 列表
        const response = await apiService.listBanners();
        
        tableData.value = response;
      } catch (error) {
        console.error('獲取 Banner 列表時發生錯誤:', error);
      }
    };

    const deleteBanner = async (bannerId) => {
      try {
        // 呼叫 API 刪除 Banner
        await apiService.deleteBanner(bannerId);

        // 重新獲取 Banner 列表
        await fetchTableData();
      }catch (error) {
        showErrorModal('刪除 Banner 時發生錯誤');
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

    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      tableColumns,
      deleteBanner,
      showErrorModal,
      showSuccessModal,
      closeModal,
      modalMessage,
      showModal,
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
        <div class="row mb-3">
          <div class="col-12 text-end">
            <router-link to="/layout/banner/add" class="btn btn-primary">新增Banner</router-link>
          </div>
        </div>
        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">Banner列表</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in tableData" :key="index">
                        <td v-for="column in tableColumns" :key="column.key">
                          <template v-if="column.key === 'img_url'">
                            <img :src="row.img_url" alt="Banner Image" class="img-fluid rounded-0" style="max-width: 100px;">
                          </template>
                          <template v-else-if="column.key === 'actions'">
                            <a :href="`/layout/banner/edit/${row.id}`" class="btn btn-link p-0 me-2">
                              <i class="material-icons">edit</i>
                            </a>
                            <button @click="deleteBanner(row.id)" class="btn btn-link p-0">
                              <i class="material-icons">delete</i>
                            </button>
                          </template>
                          <template v-else-if="column.key === 'status'">
                            {{ row.status === 'active' ? '啟用' : '未啟用' }}
                          </template>
                          <template v-else>
                            {{ row[column.key] }}
                          </template>
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

.modal {
  z-index: 1050;
}
</style>