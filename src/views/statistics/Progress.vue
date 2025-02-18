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
        name: '除了資料統一，規則統一，還要有應用程式市集',
        instructor: '王大明',
        category: '醫療資訊系統',
        completionRate: 88,
        averageScore: 85,
        students_count: 180
      },
      {
        id: 2,
        name: '統一台灣電子病歷的策略思考',
        instructor: '李小華',
        category: '電子病歷',
        completionRate: 92,
        averageScore: 88,
        students_count: 165
      },
      {
        id: 3,
        name: '開發FHIR工具，FHIR資料中臺實現互通',
        instructor: '張醫師',
        category: '醫療標準規範',
        completionRate: 95,
        averageScore: 92,
        students_count: 150
      },
      {
        id: 4,
        name: '臺灣醫中電子病歷資料統一的架構',
        instructor: '陳工程師',
        category: '醫療資料交換',
        completionRate: 87,
        averageScore: 85,
        students_count: 142
      },
      {
        id: 5,
        name: 'FHIR 統一資料，但是沒有統一規則',
        instructor: '林教授',
        category: '醫療標準規範',
        completionRate: 90,
        averageScore: 89,
        students_count: 98
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

    // 排序相關狀態
    const sortField = ref('')
    const sortOrder = ref('asc')

    // 排序方法
    const sortCourses = (a, b) => {
      if (!sortField.value) return 0
      
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]
      
      if (sortOrder.value === 'asc') {
        return aValue - bValue
      } else {
        return bValue - aValue
      }
    }

    // 切換排序
    const toggleSort = (field) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortOrder.value = 'asc'
      }
    }

    // 篩選後的課程列表
    const filteredCourses = computed(() => {
      const filtered = courses.value.filter(course => {
        const matchQuery = 
          course.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCategory = !selectedCategory.value || course.category === selectedCategory.value
        return matchQuery && matchCategory
      })
      
      // 應用排序
      if (sortField.value) {
        filtered.sort(sortCourses)
      }
      
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
      goToPage,
      toggleSort,
      sortField,
      sortOrder
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
                        <th @click="toggleSort('completionRate')" style="cursor: pointer">
                          完課率
                          <i v-if="sortField === 'completionRate'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th @click="toggleSort('averageScore')" style="cursor: pointer">
                          平均分數
                          <i v-if="sortField === 'averageScore'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th @click="toggleSort('students_count')" style="cursor: pointer">
                          上課人數
                          <i v-if="sortField === 'students_count'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.name }}</td>
                        <td>{{ course.instructor }}</td>
                        <td>{{ course.category }}</td>
                        <td>{{ course.completionRate }}%</td>
                        <td>{{ course.averageScore }}分</td>
                        <td>{{ course.students_count }}人</td>
                        <td>
                          <button
                            class="btn btn-primary btn-sm"
                            @click="viewDetails(course.id)"
                          >
                            檢視詳細
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