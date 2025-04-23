<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter(); 
    const searchQuery = ref('');
    const loading = ref(false);

    // 獲取分類選項
    const fetchCategories = async () => {
      try {
        loading.value = true
        const response = await apiService.getTagsOption('category');
        categories.value = [{id: '', 'name': `全部`}, ...response];
        loading.value = false
      } catch (error) {
        loading.value = false
        console.error('獲取分類失敗:', error);
      }
    };

    // 跳轉到題目編輯頁面
    const goToExamEdit = (examId) => {
      router.push(`/exam/edit/${examId}`);
    };

    // 排序相關狀態
    const sortField = ref('')
    const sortOrder = ref('asc')


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
    const examData = ref([])

    // 分類選項
    const categories = ref([
    ])

    // 分類篩選
    const selectedCategory = ref('')

    // 分頁相關
    const currentPage = ref(1)
    const pageSize = ref(10)
    const totalPages = ref(1)

    // 獲取測驗列表
    const fetchExams = async () => {
      try {
        const params = {
          category_id: selectedCategory.value === '全部' ? '' : selectedCategory.value,
          search: searchQuery.value,
          page: currentPage.value,
          pageSize: pageSize.value
        }
        loading.value = true

        const response = await apiService.getExamLists(params)
        examData.value = response.courses.map(course => ({
          id: course.id,
          courseName: course.title,
          instructor: course.instructors.join(', '),
          category: course.categories.join(', '),
          averageScore: course.averageScore,
          participantsCount: course.participantsCount,
          createdAt: course.created_at
        }))
        totalPages.value = response.totalPages
        loading.value = false
      } catch (error) {
        console.error('獲取測驗列表失敗:', error)
        loading.value = false
      } finally {
        loading.value = false
      }
    }

    // 初始化數據
    onMounted(() => {
      fetchExams()
      fetchCategories()
    })

    // 當前頁面的測驗列表
    const currentPageExams = computed(() => examData.value)

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
      sortOrder,
      fetchExams,
      loading
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
                  <div class="col-md-5">
                    <input
                      type="text"
                      class="form-control mb-2"
                      v-model="searchQuery"
                      placeholder="搜尋課程名稱或講師..."
                    />
                  </div>
                  <div class="col-md-5">
                    <select
                      class="form-select"
                      v-model="selectedCategory"
                    >
                      <option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <button 
                      class="btn btn-primary w-100" 
                      @click="fetchExams"
                    >
                      搜尋
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
                        <th @click="toggleSort('averageScore')" style="cursor: pointer">
                          平均分數
                          <i v-if="sortField === 'averageScore'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th @click="toggleSort('participantsCount')" style="cursor: pointer">
                          參與人數
                          <i v-if="sortField === 'participantsCount'" class="material-icons align-middle" style="font-size: 16px">
                            {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
                          </i>
                        </th>
                        <th>建立時間</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="loading">
                        <td colspan="7" class="text-center">載入中...</td>
                      </tr>
                      <tr v-else-if="currentPageExams.length === 0">
                        <td colspan="7" class="text-center">無資料</td>
                      </tr>
                      <tr v-else v-for="exam in currentPageExams" :key="exam.id">
                        <td>{{ exam.courseName }}</td>
                        <td>{{ exam.instructor }}</td>
                        <td>{{ exam.category }}</td>
                        <td>{{ exam.averageScore }}</td>
                        <td>{{ exam.participantsCount }}</td>
                        <td>{{ exam.createdAt }}</td>
                        <td>
                          <button class="btn btn-primary btn-sm me-2" @click="editExam(exam.id)">
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
                <!-- 分頁控制 -->
                <nav class="mt-3" v-if="totalPages > 1">
                  <ul class="pagination justify-content-center">
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
      <Footer />
    </div>
  </div>
  <Loading v-if="loading" />
</template>