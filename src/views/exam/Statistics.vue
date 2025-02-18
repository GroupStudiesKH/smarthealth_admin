<script>
import { ref, computed } from 'vue'
import { useRouter } from "vue-router";
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

    // 跳轉到題目編輯頁面
    const goToExamEdit = (examId) => {
      router.push(`/exam/edit/${examId}`);
    };

    // 排序相關狀態
    const sortField = ref('')
    const sortOrder = ref('asc')

    // 排序方法
    const sortExams = (a, b) => {
      if (!sortField.value) return 0
      
      const aValue = a[sortField.value]
      const bValue = b[sortField.value]
      
      if (sortField.value === 'createdAt') {
        if (sortOrder.value === 'asc') {
          return new Date(aValue) - new Date(bValue)
        } else {
          return new Date(bValue) - new Date(aValue)
        }
      }
      
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

    // 模擬測驗統計數據
    const examData = ref([
      { id: 1, courseName: '除了資料統一，規則統一，還要有應用程式市集', instructor: '王大明', category: '醫療資訊系統', averageScore: 88, participantsCount: 180, createdAt: '2024-01-15' },
      { id: 2, courseName: '統一台灣電子病歷的策略思考', instructor: '李小華', category: '電子病歷', averageScore: 85, participantsCount: 165, createdAt: '2024-01-16' },
      { id: 3, courseName: '開發FHIR工具，FHIR資料中臺實現互通', instructor: '張醫師', category: '醫療標準規範', averageScore: 92, participantsCount: 150, createdAt: '2024-01-17' },
      { id: 4, courseName: '臺灣醫中電子病歷資料統一的架構', instructor: '陳工程師', category: '醫療資料交換', averageScore: 87, participantsCount: 142, createdAt: '2024-01-18' },
      { id: 5, courseName: 'FHIR 統一資料，但是沒有統一規則', instructor: '林教授', category: '醫療標準規範', averageScore: 90, participantsCount: 138, createdAt: '2024-01-19' }
    ])

    // 分類選項
    const categories = ref([
      '全部',
      '醫療保健',
      '護理照護',
      '急救訓練',
      '長照服務',
      '心理健康',
      '營養學',
      '復健醫學',
      '中醫保健',
      '運動醫學'
    ])

    // 分類篩選
    const selectedCategory = ref('全部')

    // 分頁相關
    const currentPage = ref(1)
    const pageSize = ref(10)

    // 計算總頁數
    const totalPages = computed(() => Math.ceil(filteredExams.value.length / pageSize.value))

    // 篩選相關狀態
    const searchQuery = ref('')

    // 篩選後的測驗列表
    const filteredExams = computed(() => {
      let filtered = examData.value.filter(exam => {
        const matchQuery = 
          exam.courseName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          exam.instructor.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchCategory = selectedCategory.value === '全部' || exam.category === selectedCategory.value
        return matchQuery && matchCategory
      })

      // 應用排序
      if (sortField.value) {
        filtered.sort(sortExams)
      }

      return filtered
    })

    // 當前頁面的測驗列表
    const currentPageExams = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return filteredExams.value.slice(start, end)
    })

    // 頁面導航方法
    const goToPage = (page) => {
      currentPage.value = page
    }

    // 編輯題目方法
    const editExam = (examId) => {
      router.push(`/exam/edit/${examId}`)
    }

    // 檢視測驗結果方法
    const viewResult = (examId) => {
      router.push(`/exam/result/${examId}`)
    }

    return {
      examData: examData,
      currentPageExams,
      searchQuery,
      selectedCategory,
      categories,
      currentPage,
      totalPages,
      editExam,
      viewResult,
      goToPage,
      goToExamEdit,
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
                <h6 class="card-title">課程測驗列表</h6>
                <!-- 篩選區域 -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control mb-2"
                      v-model="searchQuery"
                      placeholder="搜尋課程名稱或講師..."
                    />
                  </div>
                  <div class="col-md-6">
                    <select
                      class="form-select"
                      v-model="selectedCategory"
                    >
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
                        <th @click="toggleSort('averageScore')" style="cursor: pointer">
                          平均分數
                          <i v-if="sortField === 'averageScore'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th @click="toggleSort('participantsCount')" style="cursor: pointer">
                          參加測驗人數
                          <i v-if="sortField === 'participantsCount'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th @click="toggleSort('createdAt')" style="cursor: pointer">
                          創建時間
                          <i v-if="sortField === 'createdAt'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="exam in currentPageExams" :key="exam.id">
                        <td>{{ exam.courseName }}</td>
                        <td>{{ exam.instructor }}</td>
                        <td>{{ exam.category }}</td>
                        <td>{{ exam.averageScore }}</td>
                        <td>{{ exam.participantsCount }}</td>
                        <td>{{ exam.createdAt }}</td>
                        <td>
                          <button class="btn btn-primary btn-sm me-2" @click="goToExamEdit(exam.id)">
                            編輯題目
                          </button>
                          <button class="btn btn-info btn-sm" @click="viewResult(exam.id)">
                            檢視結果
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!-- 分頁導航 -->
                <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
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