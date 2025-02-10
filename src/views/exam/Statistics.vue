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
      { id: 1, courseName: '基礎醫療保健課程', instructor: '王大明', category: '醫療保健', averageScore: 85, participantsCount: 156 },
      { id: 2, courseName: '進階護理實務', instructor: '李美玲', category: '護理照護', averageScore: 88, participantsCount: 142 },
      { id: 3, courseName: '緊急醫療救護訓練', instructor: '張志豪', category: '急救訓練', averageScore: 82, participantsCount: 128 },
      { id: 4, courseName: '長期照護實務', instructor: '陳雅琪', category: '長照服務', averageScore: 85, participantsCount: 115 },
      { id: 5, courseName: '心理健康諮詢', instructor: '林心理', category: '心理健康', averageScore: 90, participantsCount: 98 },
      { id: 6, courseName: '營養學基礎', instructor: '黃營養師', category: '營養學', averageScore: 87, participantsCount: 165 },
      { id: 7, courseName: '復健治療入門', instructor: '吳物理治療師', category: '復健醫學', averageScore: 84, participantsCount: 112 },
      { id: 8, courseName: '中醫養生保健', instructor: '張中醫師', category: '中醫保健', averageScore: 89, participantsCount: 145 },
      { id: 9, courseName: '運動傷害防護', instructor: '劉教練', category: '運動醫學', averageScore: 86, participantsCount: 134 },
      { id: 10, courseName: '老年照護實務', instructor: '謝護理師', category: '長照服務', averageScore: 83, participantsCount: 108 },
      { id: 11, courseName: '兒童保健指南', instructor: '李兒科醫師', category: '醫療保健', averageScore: 91, participantsCount: 176 },
      { id: 12, courseName: '精神衛生護理', instructor: '陳心理師', category: '心理健康', averageScore: 88, participantsCount: 122 },
      { id: 13, courseName: '急診醫學概論', instructor: '王急診醫師', category: '急救訓練', averageScore: 85, participantsCount: 148 },
      { id: 14, courseName: '居家照護技巧', instructor: '林護理師', category: '護理照護', averageScore: 87, participantsCount: 132 },
      { id: 15, courseName: '運動營養學', instructor: '陳營養師', category: '營養學', averageScore: 89, participantsCount: 155 }
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