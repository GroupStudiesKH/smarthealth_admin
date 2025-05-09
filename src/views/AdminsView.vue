<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
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
    Loading,
  },
  setup() {
    const router = useRouter();
    const admins = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const pageSize = 10;
    const loading = ref(false);

    const fetchAdmins = async (page = 1) => {
      try {
        loading.value = true;
        const response = await apiService.getAdmins(page, pageSize);
        admins.value = response.data;
        totalPages.value = Math.ceil(response.total / pageSize);
        currentPage.value = page;
        loading.value = false;
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      }
    };

    const editAdmin = (adminId) => {
      router.push(`/admins/${adminId}/edit`);
    };

    const deleteAdmin = async (adminId) => {
      if (confirm("您確定要刪除這個管理員嗎？")) {
        try {
          loading.value = true;
          await apiService.deleteAdmin(adminId);
          await fetchAdmins(currentPage.value);
          loading.value = false;
        } catch (error) {
          console.error("Failed to delete admin:", error);
          alert(error.response?.data?.message || "刪除管理員時發生錯誤");
        }
      }
    };

    const changePage = (page) => {
      fetchAdmins(page);
    };

    const addAdmin = () => {
      router.push("/admins/add");
    };

    onMounted(() => {
      fetchAdmins();
    });

    return {
      admins,
      loading,
      currentPage,
      totalPages,
      editAdmin,
      deleteAdmin,
      changePage,
      addAdmin,
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
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h6 class="card-title">管理員列表</h6>
                  <button @click="addAdmin" class="btn btn-primary">
                    新增管理員
                  </button>
                </div>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>名稱</th>
                        <th>電子郵件</th>
                        <th>權限群組</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="admin in admins" :key="admin.id">
                        <td>{{ admin.id }}</td>
                        <td>{{ admin.name }}</td>
                        <td>{{ admin.email }}</td>
                        <td>{{ admin.permission_group.name }}</td>
                        <td>
                          <button
                            @click="editAdmin(admin.id)"
                            class="btn btn-primary btn-sm me-2"
                          >
                            編輯
                          </button>
                          <button
                            @click="deleteAdmin(admin.id)"
                            class="btn btn-danger btn-sm"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <nav class="mt-4">
                  <ul class="pagination justify-content-center">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage - 1)"
                        >上一頁</a
                      >
                    </li>
                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(page)"
                        >{{ page }}</a
                      >
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage + 1)"
                        >下一頁</a
                      >
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
  
  <!-- 載入中彈窗 -->
  <Loading v-if="loading" />
</template>
