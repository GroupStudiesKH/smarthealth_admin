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
        averageScore: 78,
        students_count: 156
      },
      {
        id: 2,
        name: '進階護理實務',
        instructor: '李美玲',
        category: '護理照護',
        completionRate: 92,
        averageScore: 88,
        students_count: 142
      },
      {
        id: 3,
        name: '緊急醫療救護訓練',
        instructor: '張志豪',
        category: '急救訓練',
        completionRate: 75,
        averageScore: 82,
        students_count: 128
      },
      {
        id: 4,
        name: '長期照護實務',
        instructor: '陳雅琪',
        category: '長照服務',
        completionRate: 88,
        averageScore: 85,
        students_count: 115
      },
      {
        id: 5,
        name: '心理健康諮詢基礎',
        instructor: '林心理',
        category: '心理健康',
        completionRate: 90,
        averageScore: 92,
        students_count: 98
      },
      {
        id: 6,
        name: '老年照護專業課程',
        instructor: '黃醫師',
        category: '長照服務',
        completionRate: 82,
        averageScore: 85,
        students_count: 10
      },
      {
        id: 7,
        name: '兒童醫療照護',
        instructor: '周醫師',
        category: '醫療保健',
        completionRate: 88,
        averageScore: 90,
        students_count: 10
      },
      {
        id: 8,
        name: '急診室緊急救護',
        instructor: '劉醫師',
        category: '急救訓練',
        completionRate: 95,
        averageScore: 89,
        students_count: 10
      },
      {
        id: 9,
        name: '居家護理實務',
        instructor: '吳護理師',
        category: '護理照護',
        completionRate: 87,
        averageScore: 84,
        students_count: 10
      },
      {
        id: 10,
        name: '壓力管理與調適',
        instructor: '謝心理師',
        category: '心理健康',
        completionRate: 91,
        averageScore: 88,
        students_count: 10
      },
      {
        id: 11,
        name: '高齡者營養照護',
        instructor: '楊營養師',
        category: '長照服務',
        completionRate: 89,
        averageScore: 86,
        students_count: 10
      },
      {
        id: 12,
        name: '社區醫療服務',
        instructor: '鄭醫師',
        category: '醫療保健',
        completionRate: 84,
        averageScore: 83,
        students_count: 10
      },
      {
        id: 13,
        name: '災難醫療應變',
        instructor: '蔡醫師',
        category: '急救訓練',
        completionRate: 93,
        averageScore: 91,
        students_count: 10
      },
      {
        id: 14,
        name: '精神科護理實務',
        instructor: '趙護理師',
        category: '護理照護',
        completionRate: 86,
        averageScore: 87,
        students_count: 10
      },
      {
        id: 15,
        name: '情緒管理與輔導',
        instructor: '孫心理師',
        category: '心理健康',
        completionRate: 88,
        averageScore: 89,
        students_count: 10
      }
    ])

    // 分頁相關狀態
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 篩選相關狀態
    const searchQuery = ref('')
    const selectedCategory = ref('')

    // 取得所有課程分類
    const categories = computed(() => {
      return [...new Set(courses.value.map(course => course.category))]
    })

    // 篩選後的課程列表
    const filteredCourses = computed(() => {
      const filtered = courses.value.filter(course => {
        const matchQuery = 
          course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCategory = !selectedCategory.value || course.category === selectedCategory.value
        return matchQuery && matchCategory
      })
      
      // 計算總頁數
      totalPages.value = Math.ceil(filtered.length / pageSize.value)
      
      // 根據當前頁碼進行分頁
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filtered.slice(start, end)
    })

    // 總頁數
    const totalPages = ref(1)

    // 分頁導航方法
    const goToPage = (page) => {
      currentPage.value = page
    }

    // 檢視詳細資料方法
    const viewDetails = (courseId) => {
      router.push(`/statistics/course-report/${courseId}`)
    }

    return {
      courses: filteredCourses,
      categories,
      searchQuery,
      selectedCategory,
      viewDetails,
      currentPage,
      totalPages,
      goToPage
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
                  <div class="col-md-3 text-end">
                    <button class="btn btn-primary" @click="exportReport">
                      <i class="material-icons align-middle me-1">file_download</i>
                      匯出報表
                    </button>
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
                        <th>上課人數</th>
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
                        <td>{{ course.students_count }}人</td>
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
                <!-- 分頁導航 -->
                <div class="d-flex justify-content-center mt-4">
                  <nav>
                    <ul class="pagination">
                      <li class="page-item" :class="{ disabled: currentPage === 1 }">
                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
                          上一頁
                        </a>
                      </li>
                      <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                        <a class="page-link" href="#" @click.prevent="goToPage(page)">
                          {{ page }}
                        </a>
                      </li>
                      <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                        <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
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