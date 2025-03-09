<script>
import { ref, computed, onMounted } from "vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const instructors = ref([]);
    const pagination = ref({
      current_page: 1,
      total: 0,
      per_page: 10
    });

    const searchQuery = ref("");
    const currentPage = ref(1);
    const totalPages = ref(0)
    const deleteID = ref('')

    const handleSearch = () => {
      currentPage.value = 1;
      fetchInstructors();
    };

    const deleteInstructor = (id) => {
      deleteID.value = id
    };

    const delInstructor = () => {
      apiService.delInstructor(deleteID.value).then(response => {
        fetchInstructors();
        $('#delConfirmModal').modal('hide');
      }).catch(error => {
        console.error('刪除講師失敗:', error);
      });
    }

    const changePage = (page) => {
      currentPage.value = page;
      fetchInstructors();
    };

    const fetchInstructors = async () => {
      try {
        const response = await apiService.getInstructors({
          page: currentPage.value,
          per_page: pagination.value.per_page,
          search: searchQuery.value
        });
        
        instructors.value = response.data.map(item => ({
          id: item.id,
          name: item.name,
          note: item.note,
          created_at: item.created_at
        }));

    
        pagination.value.total = response.pagination.total;
        pagination.value.per_page = response.pagination.per_page;
        totalPages.value = response.pagination.last_page
        currentPage.value = response.pagination.current_page;
      } catch (error) {
        console.error('獲取講師列表失敗:', error);
      }
    };

    onMounted(() => {
      fetchInstructors();
    });

    return {
      instructors,
      searchQuery,
      handleSearch,
      currentPage,
      totalPages,
      deleteInstructor,
      changePage,
      pagination,
      delInstructor
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
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title mb-0">講師列表</h6>
                  <router-link to="/course/instructor/add" class="btn btn-primary">
                    新增講師
                  </router-link>
                </div>

                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        v-model="searchQuery"
                        placeholder="搜尋講師名稱"
                      />
                      <button
                        class="btn btn-primary"
                        type="button"
                        @click="handleSearch"
                      >
                        搜尋
                      </button>
                    </div>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>講師名稱</th>
                        <th>備註</th>
                        <th>新增日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="instructor in instructors" :key="instructor.id">
                        <td>{{ instructor.name }}</td>
                        <td>{{ instructor.note }}</td>
                        <td>{{ instructor.created_at }}</td>
                        <td>
                          <router-link
                            :to="`/course/instructor/edit/${instructor.id}`"
                            class="btn btn-sm btn-outline-primary me-2"
                          >
                            編輯
                          </router-link>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteInstructor(instructor.id)" data-bs-toggle="modal" data-bs-target="#delConfirmModal"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-4 d-flex justify-content-center">
                  <ul class="pagination">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage)"
                      >
                        上一頁
                      </a>
                    </li>
                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                      v-show="Math.abs(page - pagination.current_page) <= 2 || page === 1 || page === totalPages"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(page)"
                      >
                        {{ page }}
                      </a>
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage + 1)"
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

      <!-- Modal -->
      <div class="modal fade" id="delConfirmModal" tabindex="-1" aria-labelledby="delConfirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="delConfirmModalLabel">確認刪除？</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="btn-close"></button>
            </div>
            <div class="modal-body">
              請確認是否刪除
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">關閉</button>
              <button type="button" class="btn btn-primary" @click="delInstructor()">確認</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>