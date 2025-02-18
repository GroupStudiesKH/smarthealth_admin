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
      tags: [
        { id: 1, name: 'FHIR', courseCount: 15, createdAt: '2024-01-15' },
        { id: 2, name: '標準規範', courseCount: 12, createdAt: '2024-01-16' },
        { id: 3, name: '資料交換', courseCount: 8, createdAt: '2024-01-17' },
        { id: 4, name: '系統整合', courseCount: 20, createdAt: '2024-01-18' },
        { id: 5, name: '實務應用', courseCount: 6, createdAt: '2024-01-19' },
        { id: 6, name: '醫療資訊', courseCount: 14, createdAt: '2024-01-20' },
        { id: 7, name: '電子病歷', courseCount: 9, createdAt: '2024-01-21' },
        { id: 8, name: '醫療標準', courseCount: 11, createdAt: '2024-01-22' },
        { id: 9, name: '互通性', courseCount: 7, createdAt: '2024-01-23' },
        { id: 10, name: '醫療數據', courseCount: 13, createdAt: '2024-01-24' }
      ],
      searchQuery: '',
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    filteredTags() {
      return this.tags.filter(tag =>
        tag.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedTags() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredTags.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredTags.length / this.pageSize);
    }
  },
  methods: {
    handleEdit(id) {
      this.$router.push(`/course/tag/edit/${id}`);
    },
    handleDelete(id) {
      console.log('刪除標籤:', id);
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
                  <h6 class="card-title mb-0">課程標籤管理</h6>
                  <button class="btn btn-primary" @click="$router.push('/course/tag/add')">新增標籤</button>
                </div>

                <!-- 搜尋欄位 -->
                <div class="mb-3">
                  <input
                    type="text"
                    class="form-control"
                    v-model="searchQuery"
                    placeholder="搜尋標籤名稱"
                  />
                </div>

                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>標籤名稱</th>
                        <th>課程數量</th>
                        <th>建立日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tag in paginatedTags" :key="tag.id">
                        <td>{{ tag.name }}</td>
                        <td>{{ tag.courseCount }}</td>
                        <td>{{ tag.createdAt }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary me-2" @click="handleEdit(tag.id)">
                            編輯
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="handleDelete(tag.id)">
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