<script>
import { ref, computed, onMounted } from "vue";
import apiService from "@/service/api-service";
import { useRouter, useRoute } from "vue-router";
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
    const courses = ref([]);
    const loading = ref(true);
    const categories = ref([]);

    const fetchCategories = async () => {
      try {
        const response = await apiService.getTagsOption("category");
        categories.value = response;
      } catch (error) {
        console.error("獲取分類失敗:", error);
      }
    };

    onMounted(() => {
      fetchCourses();
      fetchCategories();
    });

    // 修改过滤逻辑
    const handleFilter = async () => {
      loading.value = true;
      await fetchCourses();
      loading.value = false;
    };

    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedStatus = ref("");

    // 修改状态筛选参数映射
    const statuses = ref([
      { label: "已上架", value: "publish" },
      { label: "未上架", value: "draft" },
      { label: "審核中", value: "pending" },
    ]);

    // 修改API请求参数
    const fetchCourses = async () => {
      try {
        const params = {
          category_id: selectedCategory.value,
          status: selectedStatus.value,
          search: searchQuery.value,
          pageSize: 99,
        };
        const response = await apiService.getCourses(params);
        courses.value = response.courses.map((course) => ({
          id: course.id,
          title: course.title,
          tags: course.tags,
          category: course.categories[0] || "",
          instructor: course.instructors.join(","),
          status_raw: course.status, // 保留原始狀態值
          status:
            statuses.value.find((s) => s.value === course.status)?.label ||
            course.status,
          publishDate: new Date(course.created_at).toISOString().split("T")[0],
        }));
      } catch (error) {
        console.error("获取课程失败:", error);
      } finally {
        loading.value = false;
      }
    };

    const handleEdit = (courseId) => {
      router.push(`/course/edit/${courseId}`);
    };

    const handleDelete = async (courseId) => {
      if (confirm("確定要刪除此課程嗎？")) {
        loading.value = true;
        try {
          await apiService.delCourse(courseId);
          courses.value = courses.value.filter(
            (course) => course.id !== courseId
          );
        } catch (error) {
          alert(`刪除失敗: ${error.message}`);
        } finally {
          loading.value = false;
        }
      }
    };
    return {
      courses,
      router,
      searchQuery,
      selectedCategory,
      selectedStatus,
      statuses,
      handleFilter,
      handleEdit,
      handleDelete,
      loading,
      categories,
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
        <!-- 搜尋和篩選區 -->
        <div class="row mb-3">
          <div class="col-md-12">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-md-3">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQuery"
                      placeholder="搜尋課程名稱或講師"
                    />
                  </div>
                  <div class="col-md-3">
                    <select class="form-select" v-model="selectedCategory">
                      <option value="">所有分類</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <select class="form-select" v-model="selectedStatus">
                      <option value="">所有狀態</option>
                      <option
                        v-for="status in statuses"
                        :key="status.value"
                        :value="status.value"
                      >
                        {{ status.label }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <button
                      class="btn btn-primary mx-2"
                      @click="handleFilter"
                      :disabled="loading"
                    >
                      篩選
                    </button>
                    <router-link to="/course/add" class="btn btn-secondary">
                      新增課程
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 課程列表 -->
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>課程名稱</th>
                        <th>上架時間</th>
                        <th>講師</th>
                        <th>分類</th>
                        <th>標籤</th>
                        <th>狀態</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.title }}</td>
                        <td>{{ course.publishDate }}</td>
                        <td>{{ course.instructor }}</td>
                        <td>{{ course.category }}</td>
                        <td>
                          <span
                            v-for="tag in course.tags"
                            :key="tag"
                            class="badge bg-primary me-1"
                          >
                            {{ tag }}
                          </span>
                        </td>
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'bg-success': course.status === '已上架',
                              'bg-warning': course.status === '審核中',
                              'bg-secondary': course.status === '未上架',
                            }"
                          >
                            {{ course.status }}
                          </span>
                        </td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-2"
                            @click="handleEdit(course.id)"
                          >
                            編輯
                          </button>
                          <button
                            class="btn btn-sm btn-outline-info me-2"
                            @click="
                              router.push(`/course/${course.id}/chapters`)
                            "
                          >
                            章節管理
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="handleDelete(course.id)"
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
  
  <!-- Loading 彈窗 -->
  <div v-if="loading" class="loading-overlay">
    <div class="loading-spinner">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">載入中...</span>
      </div>
      <div class="mt-2">載入中...</div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>