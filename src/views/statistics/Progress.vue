<script>
import { ref, computed } from 'vue'
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
    const router = useRouter();
    const route = useRoute();
    // 模擬課程統計數據
    const courses = ref([
      {
        id: 1,
        name: '基礎醫療保健課程',
        instructor: '王大明',
        category: '醫療保健',
        completionRate: 85,
        averageScore: 78
      },
      {
        id: 2,
        name: '進階護理實務',
        instructor: '李美玲',
        category: '護理照護',
        completionRate: 92,
        averageScore: 88
      },
      {
        id: 3,
        name: '緊急醫療救護訓練',
        instructor: '張志豪',
        category: '急救訓練',
        completionRate: 75,
        averageScore: 82
      },
      {
        id: 4,
        name: '長期照護實務',
        instructor: '陳雅琪',
        category: '長照服務',
        completionRate: 88,
        averageScore: 85
      }
    ])

    // 篩選相關狀態
    const searchQuery = ref('')
    const selectedCategory = ref('')

    // 取得所有課程分類
    const categories = computed(() => {
      return [...new Set(courses.value.map(course => course.category))]
    })

    // 篩選後的課程列表
    const filteredCourses = computed(() => {
      return courses.value.filter(course => {
        const matchQuery = 
          course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCategory = !selectedCategory.value || course.category === selectedCategory.value
        return matchQuery && matchCategory
      })
    })

    // 檢視詳細資料方法
    const viewDetails = (courseId) => {
      router.push(`/statistics/course-report/${courseId}`)
    }

    return {
      courses: filteredCourses,
      categories,
      searchQuery,
      selectedCategory,
      viewDetails
    }
  }
}
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
                <h6 class="card-title">學習進度統計</h6>
                <!-- 篩選區域 -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQuery"
                      placeholder="搜尋課程名稱或講師..."
                    />
                  </div>
                  <div class="col-md-3">
                    <select class="form-select" v-model="selectedCategory">
                      <option value="">所有分類</option>
                      <option v-for="category in categories" :key="category" :value="category">
                        {{ category }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>課程名稱</th>
                        <th>課程講師</th>
                        <th>分類</th>
                        <th>完課率</th>
                        <th>平均分數</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.name }}</td>
                        <td>{{ course.instructor }}</td>
                        <td>{{ course.category }}</td>
                        <td>
                          <div class="progress">
                            <div
                              class="progress-bar bg-success"
                              role="progressbar"
                              :style="{ width: course.completionRate + '%' }"
                            >
                              {{ course.completionRate }}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="progress">
                            <div
                              class="progress-bar bg-info"
                              role="progressbar"
                              :style="{ width: course.averageScore + '%' }"
                            >
                              {{ course.averageScore }}分
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            class="btn btn-primary btn-sm"
                            @click="viewDetails(course.id)"
                          >
                            檢視
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
.progress {
  height: 20px;
  margin-bottom: 0;
}
.table td {
  vertical-align: middle;
}
</style>