<script>
import { ref, computed } from "vue";
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
    const courses = ref([
      {
        id: 1,
        title: "除了資料統一，規則統一，還要有應用程式市集",
        publishDate: "2023-12-01",
        instructor: "王大明",
        category: "醫療資訊系統",
        tags: ["FHIR", "系統整合", "實務應用"],
        status: "已上架",
      },
      {
        id: 2,
        title: "統一台灣電子病歷的策略思考",
        publishDate: "2023-12-05",
        instructor: "李小華",
        category: "電子病歷",
        tags: ["標準規範", "資料交換"],
        status: "已上架",
      },
      {
        id: 3,
        title: "開發FHIR工具，FHIR資料中臺實現互通",
        publishDate: "2023-12-10",
        instructor: "張醫師",
        category: "醫療資料交換",
        tags: ["FHIR", "資料交換", "系統整合"],
        status: "已上架",
      },
      {
        id: 4,
        title: "臺灣醫中電子病歷資料統一的架構",
        publishDate: "2023-12-15",
        instructor: "陳工程師",
        category: "電子病歷",
        tags: ["標準規範", "系統整合"],
        status: "已上架",
      },
      {
        id: 5,
        title: "FHIR 統一資料，但是沒有統一規則",
        publishDate: "2023-12-20",
        instructor: "王大明",
        category: "醫療標準規範",
        tags: ["FHIR", "標準規範"],
        status: "已上架",
      },
      {
        id: 6,
        title: "FHIR 統一資料",
        publishDate: "2023-12-25",
        instructor: "李小華",
        category: "醫療資料交換",
        tags: ["FHIR", "資料交換"],
        status: "已上架",
      },
      {
        id: 7,
        title: "LOINC標準碼",
        publishDate: "2023-12-30",
        instructor: "張醫師",
        category: "醫療標準規範",
        tags: ["標準規範", "實務應用"],
        status: "已上架",
      },
      {
        id: 8,
        title: "RxNorm",
        publishDate: "2024-01-05",
        instructor: "陳工程師",
        category: "醫療標準規範",
        tags: ["標準規範", "實務應用"],
        status: "已上架",
      },
      {
        id: 9,
        title: "SNOMED CT",
        publishDate: "2024-01-10",
        instructor: "王大明",
        category: "醫療標準規範",
        tags: ["標準規範", "實務應用"],
        status: "已上架",
      },
      {
        id: 10,
        title: "TW CDI",
        publishDate: "2024-01-15",
        instructor: "李小華",
        category: "醫療標準規範",
        tags: ["標準規範", "實務應用"],
        status: "已上架",
      },
    ]);
    const router = useRouter();
    const route = useRoute();
    const searchQuery = ref("");
    const selectedCategory = ref("");
    const selectedStatus = ref("");

    const categories = ["醫療資訊系統", "電子病歷", "醫療標準規範", "醫療資料交換"];
    const statuses = ["已上架", "未上架", "審核中"];

    const filteredCourses = computed(() => {
      return courses.value.filter((course) => {
        const matchQuery =
          course.title
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase()) ||
          course.instructor
            .toLowerCase()
            .includes(searchQuery.value.toLowerCase());
        const matchCategory =
          !selectedCategory.value || course.category === selectedCategory.value;
        const matchStatus =
          !selectedStatus.value || course.status === selectedStatus.value;
        return matchQuery && matchCategory && matchStatus;
      });
    });

    const handleEdit = (courseId) => {
      router.push(`/course/edit/${courseId}`);
    };

    const handleDelete = (courseId) => {
      if (confirm("確定要刪除此課程嗎？")) {
        courses.value = courses.value.filter(
          (course) => course.id !== courseId
        );
      }
    };
    return {
      courses,
      router,
      searchQuery,
      selectedCategory,
      selectedStatus,
      categories,
      statuses,
      filteredCourses,
      handleEdit,
      handleDelete
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
                            >
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="selectedCategory">
                            <option value="">所有分類</option>
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="selectedStatus">
                            <option value="">所有狀態</option>
                            <option v-for="status in statuses" :key="status" :value="status">
                                {{ status }}
                            </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <router-link to="/course/add" class="btn btn-primary">
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
                            <tr v-for="course in filteredCourses" :key="course.id">
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
                                    'bg-secondary': course.status === '未上架'
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
                                    @click="router.push(`/course/${course.id}/chapters`)"
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
</template>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}
</style>