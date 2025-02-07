<script>
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  data() {
    return {
      categories: [
        { id: 1, name: '心理健康', courseCount: 15, createdAt: '2024-01-15' },
        { id: 2, name: '營養保健', courseCount: 12, createdAt: '2024-01-16' },
        { id: 3, name: '運動健身', courseCount: 8, createdAt: '2024-01-17' },
        { id: 4, name: '瑜珈冥想', courseCount: 10, createdAt: '2024-01-18' },
        { id: 5, name: '體重管理', courseCount: 6, createdAt: '2024-01-19' },
        { id: 6, name: '睡眠改善', courseCount: 4, createdAt: '2024-01-20' },
        { id: 7, name: '壓力管理', courseCount: 9, createdAt: '2024-01-21' },
        { id: 8, name: '飲食營養', courseCount: 11, createdAt: '2024-01-22' },
        { id: 9, name: '運動訓練', courseCount: 7, createdAt: '2024-01-23' },
        { id: 10, name: '健康生活', courseCount: 13, createdAt: '2024-01-24' },
        { id: 11, name: '心靈成長', courseCount: 5, createdAt: '2024-01-25' },
        { id: 12, name: '體適能', courseCount: 14, createdAt: '2024-01-26' },
        { id: 13, name: '營養補充', courseCount: 3, createdAt: '2024-01-27' },
        { id: 14, name: '運動恢復', courseCount: 6, createdAt: '2024-01-28' },
        { id: 15, name: '健康檢測', courseCount: 8, createdAt: '2024-01-29' }
      ],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedCategories() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredCategories.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCategories.length / this.pageSize);
    }
  },
  methods: {
    handleEdit(id) {
      this.$router.push(`/course/category/edit/${id}`);
    },
    handleDelete(id) {
      console.log('刪除分類:', id);
    },
    changePage(page) {
      this.currentPage = page;
    }
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
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery"
                    placeholder="搜尋分類名稱"
                  />
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
                      <tr v-for="category in paginatedCategories" :key="category.id">
                        <td>{{ category.name }}</td>
                        <td>{{ category.courseCount }}</td>
                        <td>{{ category.createdAt }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary me-2" @click="handleEdit(category.id)">
                            編輯
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="handleDelete(category.id)">
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-4" v-if="totalPages > 1">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
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
                      <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
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