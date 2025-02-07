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
        {
          id: 1,
          name: '基礎',
          useCount: 15,
          createdAt: '2024-01-15'
        },
        {
          id: 2,
          name: '進階',
          useCount: 12,
          createdAt: '2024-01-16'
        },
        {
          id: 3,
          name: '專業',
          useCount: 8,
          createdAt: '2024-01-17'
        }
      ]
    };
  },
  methods: {
    handleEdit(id) {
      this.$router.push(`/course/tag/edit/${id}`);
    },
    handleDelete(id) {
      // 實作刪除功能
      console.log('刪除標籤:', id);
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
                  <h6 class="card-title mb-0">標籤管理</h6>
                  <button class="btn btn-primary" @click="$router.push('/course/tag/add')">新增標籤</button>
                </div>

                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>標籤名稱</th>
                        <th>使用次數</th>
                        <th>建立日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tag in tags" :key="tag.id">
                        <td>{{ tag.name }}</td>
                        <td>{{ tag.useCount }}</td>
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
</style>