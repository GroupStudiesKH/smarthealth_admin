<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();
    const tableData = ref([]);
    const totalRecords = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchForm = reactive({
      keyword: "",
    });
    const loading = ref(false);

    const handleSearch = () => {
      currentPage.value = 1;
      fetchTableData();
    };

    const resetSearch = () => {
      searchForm.keyword = "";
      currentPage.value = 1;
      fetchTableData();
    };

    const handlePageChange = (page) => {
      currentPage.value = page;
      fetchTableData();
    };

    const tableColumns = reactive([
      { key: "id", label: "編號" },
      { key: "name", label: "會員名稱" },
      { key: "birthdate", label: "生日" },
      { key: "email", label: "Email帳號" },
      { key: "created_at", label: "註冊日期" },
      { key: "status", label: "狀態" },
      { key: "actions", label: "操作" },
    ]);

    const fetchTableData = async () => {
      try {
        loading.value = true;
        const response = await apiService.getMembers({
          page: currentPage.value,
          per_page: pageSize.value,
          keyword: searchForm.keyword
        });
        loading.value = false;
        
        tableData.value = response.data.map(member => ({
          id: member.id,
          name: member.name,
          email: member.email,
          birthdate: member.birthdate,
          created_at: member.created_at,
          status: member.status === 'active' // 轉換狀態為布林值
        }));

        totalRecords.value = response.total;
        currentPage.value = response.current_page;
        pageSize.value = response.per_page;
      } catch (error) {
        console.error("Failed to fetch member data:", error);
      }
    };

    const handleEdit = (id) => {
      router.push(`/member/edit/${id}`);
    };

    const handleToggleStatus = async (id) => {
      try {
        loading.value = true;
        await apiService.memberStatus(id);
        fetchTableData();
        loading.value = false;
      } catch (error) {
        console.error("Failed to toggle member status:", error);
      }
    };

    const handleViewGrades = (id) => {
      router.push(`/member/grades/${id}`);
    };

    const handleAddMember = () => {
      router.push('/member/add');
    };

    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      tableColumns,
      totalRecords,
      currentPage,
      pageSize,
      loading,
      searchForm,
      handleSearch,
      resetSearch,
      handlePageChange,
      handleEdit,
      handleToggleStatus,
      handleViewGrades,
      handleAddMember,
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
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="card-title mb-0">會員列表</h6>
                  <button class="btn btn-primary" @click="handleAddMember">
                    <i class="material-icons">add</i> 新增會員
                  </button>
                </div>

                <div class="row mb-3">
                  <div class="col-md-6">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        v-model="searchForm.keyword"
                        placeholder="搜尋會員..."
                        @keyup.enter="handleSearch"
                      />
                      <button class="btn btn-outline-primary" type="button" @click="handleSearch">
                        <i class="material-icons">search</i>
                      </button>
                      <button class="btn btn-outline-secondary" type="button" @click="resetSearch">
                        <i class="material-icons">refresh</i>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in tableData" :key="item.id">
                        <td>{{ item.id }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.birthdate }}</td>
                        <td>{{ item.email }}</td>
                        <td>{{ new Date(item.created_at).toLocaleDateString() }}</td>
                        <td>
                          <span :class="['badge', item.status ? 'bg-success' : 'bg-danger']">
                            {{ item.status ? '啟用' : '停用' }}
                          </span>
                        </td>
                        <td>
                          <button class="btn btn-sm btn-info me-1" @click="handleEdit(item.id)">
                            <i class="material-icons">edit</i>
                          </button>
                          <button 
                            class="btn btn-sm me-1" 
                            :class="item.status ? 'btn-warning' : 'btn-success'"
                            @click="handleToggleStatus(item.id)"
                          >
                            <i class="material-icons">{{ item.status ? 'block' : 'check_circle' }}</i>
                          </button>
                          <button class="btn btn-sm btn-primary me-1" @click="handleViewGrades(item.id)">
                            <i class="material-icons">school</i>
                            學習紀錄
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <nav class="mt-3" v-if="totalRecords > pageSize">
                  <ul class="pagination justify-content-center">
                    <li 
                      class="page-item" 
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="handlePageChange(currentPage - 1)"
                      >
                        上一頁
                      </a>
                    </li>
                    <li 
                      v-for="page in Math.ceil(totalRecords / pageSize)" 
                      :key="page" 
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="handlePageChange(page)"
                      >
                        {{ page }}
                      </a>
                    </li>
                    <li 
                      class="page-item" 
                      :class="{ disabled: currentPage === Math.ceil(totalRecords / pageSize) }"
                    >
                      <a 
                        class="page-link" 
                        href="#" 
                        @click.prevent="handlePageChange(currentPage + 1)"
                      >
                        下一頁
                      </a>
                    </li>
                  </ul>
                </nav>
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