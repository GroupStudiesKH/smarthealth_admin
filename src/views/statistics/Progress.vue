<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";
import Loading from "@/components/loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const loading = ref(false)
    // 模擬課程統計數據
    const courses = ref([])

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
    const toggleSort = async (field) => {
      await handleSort(field)
    }

    // 排序方法
    const handleSort = async (field) => {
      if (sortField.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortField.value = field
        sortOrder.value = 'asc'
      }
      await fetchStats()
    }

    const exportReport = async () => {
      try {
        loading.value = true
        const params = {
          category_id: selectedCategory.value,
          status: '',
          search: searchQuery.value,
          sort_field: sortField.value,
          sort_order: sortOrder.value
        }
        // 直接呼叫API下載Excel檔案
        await apiService.downloadStatsExcel(params)
        loading.value = false
      } catch (error) {
        loading.value = false
        console.error('下載報表失敗:', error)
      }
    }

    // 總頁數
    const totalPages = ref(1)
    const total = ref(0)

    const fetchStats = async () => {
      loading.value = true
      try {
        const params = {
          category_id: selectedCategory.value,
          status: '',
          search: searchQuery.value,
          page: currentPage.value,
          pageSize: pageSize.value,
          sort_field: sortField.value,
          sort_order: sortOrder.value
        }
        const response = await apiService.getStats(params)
        
        courses.value = response.courses.map(course => ({
          id: course.id,
          name: course.title,
          instructor: course.instructors.join(', '),
          category: course.categories.join(', '),
          completionRate: course.completion_rate,
          averageScore: course.average_score,
          students_count: course.student_count
        }))
        
        total.value = response.total
        totalPages.value = response.totalPages
      } catch (error) {
        console.error('獲取統計數據失敗:', error)
      } finally {
        loading.value = false
      }
    }
    
    // 初始化數據
    onMounted(() => {
      fetchStats()
    })
    
    // 修改篩選邏輯
    watch([searchQuery, selectedCategory], () => {
      currentPage.value = 1
      fetchStats()
    })
    
    // 分頁導航方法
    const goToPage = (page) => {
      currentPage.value = page
      fetchStats()
    }

    // 檢視詳細資料方法
    const viewDetails = (courseId) => {
      router.push(`/statistics/course-report/${courseId}`)
    }

    return {
      courses,
      categories,
      searchQuery,
      selectedCategory,
      viewDetails,
      currentPage,
      totalPages,
      goToPage,
      toggleSort,
      loading,
      sortField,
      sortOrder,
      exportReport
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
  <loading v-if="loading" />
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