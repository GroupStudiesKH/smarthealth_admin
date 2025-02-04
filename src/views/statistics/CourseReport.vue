<script>
import { ref, onMounted, computed } from 'vue'
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
    const courseId = route.params.id

    // 學生詳細資料模態框狀態
    const showStudentModal = ref(false)
    const selectedStudent = ref(null)

    // 模擬課程詳細資料
    const courseDetail = ref({
      name: '基礎醫療保健課程',
      instructor: '王大明',
      category: '醫療保健',
      completionRate: 85,
      averageScore: 78,
      chapters: [
        { name: '第一章：醫療保健概論', completionRate: 90 },
        { name: '第二章：基礎醫療知識', completionRate: 85 },
        { name: '第三章：健康評估方法', completionRate: 82 },
        { name: '第四章：常見疾病預防', completionRate: 78 }
      ],
      students: [
        { name: '張小明', email: 'zhang@example.com', id: 1 },
        { name: '李小華', email: 'li@example.com', id: 2 },
        { name: '王大文', email: 'wang@example.com', id: 3 },
        { name: '陳小芳', email: 'chen@example.com', id: 4 }
      ]
    })

    // 分頁相關狀態
    const currentPage = ref(1)
    const pageSize = ref(2)

    // 計算分頁後的學生列表
    const paginatedStudents = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value
      const end = start + pageSize.value
      return courseDetail.value.students.slice(start, end)
    })

    // 計算總頁數
    const totalPages = computed(() => {
      return Math.ceil(courseDetail.value.students.length / pageSize.value)
    })

    // 頁碼變更處理
    const handlePageChange = (page) => {
      currentPage.value = page
    }

    const viewStudent = (studentId) => {
      const student = courseDetail.value.students.find(s => s.id === studentId)
      if (student) {
        selectedStudent.value = {
          ...student,
          progress: 75,
          totalTime: '12小時30分鐘',
          lastAccess: '2023-12-20',
          chapterProgress: [
            { name: '第一章：醫療保健概論', progress: 100, score: 90 },
            { name: '第二章：基礎醫療知識', progress: 85, score: 88 },
            { name: '第三章：健康評估方法', progress: 65, score: 78 },
            { name: '第四章：常見疾病預防', progress: 50, score: null }
          ],
          quizResults: [
            { name: '第一章測驗', score: 90, date: '2023-12-01' },
            { name: '第二章測驗', score: 88, date: '2023-12-10' },
            { name: '第三章測驗', score: 78, date: '2023-12-15' }
          ]
        }
        showStudentModal.value = true
      }
    }

    return {
      courseDetail,
      currentPage,
      totalPages,
      paginatedStudents,
      handlePageChange,
      viewStudent,
      showStudentModal,
      selectedStudent
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
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="card-title mb-0">課程詳細報表</h6>
                  <button class="btn btn-primary" @click="exportReport">
                    <i class="material-icons align-middle me-1">file_download</i>
                    匯出報表
                  </button>
                </div>
                <hr>
                
                <!-- 課程基本資訊 -->
                <div class="course-info mt-3">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>課程名稱：</strong>{{ courseDetail.name }}</p>
                      <p><strong>講師：</strong>{{ courseDetail.instructor }}</p>
                      <p><strong>課程分類：</strong>{{ courseDetail.category }}</p>
                    </div>
                    <div class="col-md-6">
                      <p>
                        <strong>總完課率：</strong>
                        <div class="progress">
                          <div
                            class="progress-bar bg-success"
                            role="progressbar"
                            :style="{ width: courseDetail.completionRate + '%' }"
                          >
                            {{ courseDetail.completionRate }}%
                          </div>
                        </div>
                      </p>
                      <p>
                        <strong>平均分數：</strong>
                        <div class="progress">
                          <div
                            class="progress-bar bg-info"
                            role="progressbar"
                            :style="{ width: courseDetail.averageScore + '%' }"
                          >
                            {{ courseDetail.averageScore }}分
                          </div>
                        </div>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 章節完課率表格 -->
                <h6 class="card-subtitle mt-3">章節完課率</h6>
                <hr>
                <div class="table-responsive mb-4">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>章節名稱</th>
                        <th>完課率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="chapter in courseDetail.chapters" :key="chapter.name">
                        <td>{{ chapter.name }}</td>
                        <td>
                          <div class="progress">
                            <div
                              class="progress-bar bg-success"
                              role="progressbar"
                              :style="{ width: chapter.completionRate + '%' }"
                            >
                              {{ chapter.completionRate }}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 學生列表 -->
                <h6 class="card-subtitle mt-3">參加學生列表</h6>
                <hr>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>學生名稱</th>
                        <th>學生Email</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="student in paginatedStudents" :key="student.id">
                        <td>{{ student.name }}</td>
                        <td>{{ student.email }}</td>
                        <td>
                          <button
                            class="btn btn-primary btn-sm"
                            @click="viewStudent(student.id)"
                          >
                            檢視
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-3" v-if="totalPages > 1">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage - 1)">
                        上一頁
                      </a>
                    </li>
                    <li 
                      v-for="page in totalPages" 
                      :key="page" 
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a class="page-link" href="#" @click.prevent="handlePageChange(page)">
                        {{ page }}
                      </a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" href="#" @click.prevent="handlePageChange(currentPage + 1)">
                        下一頁
                      </a>
                    </li>
                  </ul>
                </nav>

                <!-- 學生詳細資料模態框 -->
                <div class="modal fade" :class="{ 'show d-block': showStudentModal }" tabindex="-1" role="dialog" aria-hidden="true">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">學生學習詳細資料</h5>
                        <button type="button" class="btn-close" @click="showStudentModal = false"></button>
                      </div>
                      <div class="modal-body" v-if="selectedStudent">
                        <!-- 基本資訊 -->
                        <div class="student-info mb-4">
                          <h6>基本資訊</h6>
                          <div class="row">
                            <div class="col-md-6">
                              <p><strong>學生姓名：</strong>{{ selectedStudent.name }}</p>
                              <p><strong>電子郵件：</strong>{{ selectedStudent.email }}</p>
                            </div>
                            <div class="col-md-6">
                              <p><strong>總學習時數：</strong>{{ selectedStudent.totalTime }}</p>
                              <p><strong>最後登入：</strong>{{ selectedStudent.lastAccess }}</p>
                            </div>
                          </div>
                          <div class="progress mb-3">
                            <div class="progress-bar bg-success" role="progressbar" :style="{ width: selectedStudent.progress + '%' }">
                              總進度：{{ selectedStudent.progress }}%
                            </div>
                          </div>
                        </div>

                        <!-- 章節進度 -->
                        <div class="chapter-progress mb-4">
                          <h6>章節進度</h6>
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>章節名稱</th>
                                  <th>完成進度</th>
                                  <th>測驗分數</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="chapter in selectedStudent.chapterProgress" :key="chapter.name">
                                  <td>{{ chapter.name }}</td>
                                  <td>
                                    <div class="progress">
                                      <div class="progress-bar bg-info" role="progressbar" :style="{ width: chapter.progress + '%' }">
                                        {{ chapter.progress }}%
                                      </div>
                                    </div>
                                  </td>
                                  <td>{{ chapter.score || '尚未完成' }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <!-- 測驗成績 -->
                        <div class="quiz-results">
                          <h6>測驗成績記錄</h6>
                          <div class="table-responsive">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>測驗名稱</th>
                                  <th>分數</th>
                                  <th>完成日期</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="quiz in selectedStudent.quizResults" :key="quiz.name">
                                  <td>{{ quiz.name }}</td>
                                  <td>{{ quiz.score }}</td>
                                  <td>{{ quiz.date }}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="showStudentModal = false">關閉</button>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 模態框背景遮罩 -->
                <div class="modal-backdrop fade show" v-if="showStudentModal"></div>
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
.course-info p {
  margin-bottom: 1rem;
}

/* 模態框樣式 */
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  max-width: 800px;
}
.progress {
  height: 20px;
  margin-bottom: 10px;
}
.student-info p {
  padding: 6px 0;
  margin-bottom: 0;
}
.student-info .progress {
  height: 25px;
}
.chapter-progress .progress {
  height: 15px;
  margin-bottom: 0;
}
</style>