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
    const tableData = ref([]);

    const tableColumns = reactive([
      { key: "id", label: "編號" },
      { key: "lang", label: "語系" },
      { key: "title", label: "主要標題" },
      { key: "status", label: "狀態" },
      { key: "img_url", label: "圖片" },
      { key: "actions", label: "操作" },
    ]);

    const fetchTableData = async () => {
      try {
        const response = await apiService.listBanners();
        tableData.value = response;
      } catch (error) {
        console.error("Failed to fetch banner data:", error);
      }
    };

    const deleteBanner = async (bannerId) => {
      if (confirm("確定要刪除這個 Banner 嗎？")) {
        try {
          await apiService.deleteBanner(bannerId);
          fetchTableData(); // 重新獲取數據以更新列表
        } catch (error) {
          console.error("Failed to delete banner:", error);
        }
      }
    };

    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      tableColumns,
      deleteBanner,
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
                            <img :src="row.img_url" alt="Banner Image" class="img-fluid rounded-0">
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
                          <template v-else-if="column.key === 'lang'">
                            {{ row.lang === 'en' ? '英文' : '日文' }}
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
</template>
