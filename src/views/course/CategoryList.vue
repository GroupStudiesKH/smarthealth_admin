<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const router = useRouter();
    const categories = ref([]);
    const searchQuery = ref('');
    const currentPage = ref(1);
    const pageSize = ref(10);
    const loading = ref(false);
    const totalPages = ref(0)
    const deleteId = ref('')


    
    const fetchCategories = async () => {
      loading.value = true;
      try {
        const response = await apiService.getTags({
          type: 'category',
          page: currentPage.value,
          per_page: pageSize.value,
          search: searchQuery.value
        });
        categories.value = response.data.map(item => ({
          id: item.id,
          name: item.name,
          courseCount: item.courses_count,
          createdAt: item.created_at
        }));

        // 從 API 回應取得分頁資訊
        pageSize.value = response.pagination.per_page;
        totalPages.value = response.pagination.last_page;
        currentPage.value = response.pagination.current_page;

      } catch (error) {
        console.error('獲取分類失敗:', error);
      } finally {
        loading.value = false;
      }
    };

    const handleEdit = (id) => {
      router.push(`/course/category/edit/${id}`);
    };

    const handleDelete = (id) => {
      deleteId.value = id
    };

    const delTag = async () => {
      try {
        await apiService.delTag(deleteId.value);
        fetchCategories();

        // 關閉 Modal
        $('#delConfirmModal').modal('hide');
      } catch (error) {
        console.error('刪除標籤失敗:', error);
      }
    };

    const changePage = async (page) => {
      currentPage.value = page;
      await fetchCategories()
    };

    const handleSearch = () => {
      currentPage.value = 1
      fetchCategories()
    };

    onMounted(() => {
      fetchCategories();
    });

    return {
      categories,
      searchQuery,
      currentPage,
      pageSize,
      loading,
      totalPages,
      handleEdit,
      handleDelete,
      changePage,
      handleSearch,
      delTag
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <div class="page-wrapper">
      <Navbar />

      <div class="page-content">
        <div class="row mb-4">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title mb-0">課程分類管理</h6>
                  <button class="btn btn-primary" @click="$router.push('/course/category/add')">新增分類</button>
                </div>

                <!-- 搜尋欄位 -->
                <div class="mb-3 d-flex row gap-2">
                  <div class="col-auto">
                    <input
                        type="text"
                        class="form-control"
                        v-model="searchQuery"
                        placeholder="搜尋分類名稱"
                      />
                    </div>
                    <div class="col-auto">
                      <button class="btn btn-primary" @click="handleSearch">
                      搜尋
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>分類名稱</th>
                        <th>課程數量</th>
                        <th>建立日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="category in categories" :key="category.id">
                        <td>{{ category.name }}</td>
                        <td>{{ category.courseCount }}</td>
                        <td>{{ category.createdAt }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary me-2" @click="handleEdit(category.id)">
                            編輯
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="handleDelete(category.id)" data-bs-toggle="modal" data-bs-target="#delConfirmModal">
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-4" v-if="totalPages > 0">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage > 1 ? currentPage - 1 : 1)">
                        上一頁
                      </a>
                    </li>
                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a class="page-link" href="#" @click.prevent="changePage(page)">
                        {{ page }}
                      </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage < totalPages ? currentPage + 1 : totalPages)">
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
              <button type="button" class="btn btn-primary" @click="delTag()">確認</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>
<style scoped>
.page-content {
  padding: 2rem;
}

.table th,
.table td {
  vertical-align: middle;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>
