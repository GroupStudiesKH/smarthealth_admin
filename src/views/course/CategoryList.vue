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
        {
          id: 1,
          name: '心理健康',
          courseCount: 15,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: '營養保健',
          courseCount: 12,
          createdAt: '2024-01-16'
        },
        {
          id: 3,
          name: '運動健身',
          courseCount: 8,
          createdAt: '2024-01-17'
        }
      ]
    };
  },
  methods: {
    handleEdit(id) {
      this.$router.push(`/course/category/edit/${id}`);
    },
    handleDelete(id) {
      // 實作刪除功能
      console.log('刪除分類:', id);
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

                <div class="table-responsive">
                  <table class="table table-hover">
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
                          <button
                            class="btn btn-sm btn-outline-primary me-2"
                            @click="handleEdit(category.id)"
                          >
                            編輯
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="handleDelete(category.id)"
                          >
                            刪除
                          </button>
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