<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading,
  },
  setup() {
    const router = useRouter();
    const tableData = ref([]);
    const totalRecords = ref(0);
    const loading = ref(false);

    const handleSearch = () => {
      fetchTableData();
    };

    const resetSearch = () => {
      // Reset searchForm
      Object.keys(searchForm).forEach((key) => {
        searchForm[key] = "";
      });
      // Fetch original data
      fetchTableData();
    };
    const tableColumns = reactive([
      { key: "id", label: "編號" },
      { key: "name", label: "名稱" },
      { key: "actions", label: "操作" },
    ]);

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Fetch data from API with pagination parameters
        loading.value = true;
        const response = await apiService.getPermissions({
          page,
          pageSize,
          search,
        });
        loading.value = false;

        tableData.value = response.data;
        totalRecords.value = response.recordsTotal;
      } catch (error) {
        loading.value = false;
        console.error("Failed to fetch permission data:", error);
        // Handle error (e.g., show error message to user)
      }
    };

    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      tableColumns,
      handleSearch,
      resetSearch,
      loading
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
            <router-link to="/permission/add" class="btn btn-primary"
              >新增權限</router-link
            >
          </div>
        </div>
        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">權限列表</h6>
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
                          <template v-if="column.key === 'actions'">
                            <a
                              :href="`/permission/edit/${row.id}`"
                              class="btn btn-link p-0"
                            >
                              <i class="material-icons">edit</i>
                            </a>
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
        <!-- row -->
      </div>
      <Footer />
    </div>
  </div>
  <Loading v-if="loading" />
</template>
