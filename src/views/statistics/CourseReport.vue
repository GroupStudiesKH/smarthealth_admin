<script>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import StudentDetailModal from "@/components/StudentDetailModal.vue";
import ExamReviewModal from "@/components/ExamReviewModal.vue";
import apiService from "@/service/api-service";
import Loading from "@/components/loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    StudentDetailModal,
    ExamReviewModal,
    Loading
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const courseId = route.params.id;
    const loading = ref(false);

    // 學生詳細資料模態框狀態
    const showStudentModal = ref(false);
    const selectedStudent = ref(null);

    // 閱卷模態框狀態
    const showExamModal = ref(false);
    const selectedExamData = ref(null);

    // 課程詳細資料
    const courseDetail = ref({
      name: "",
      instructor: "",
      category: "",
      completionRate: 0,
      averageScore: 0,
      chapters: [],
      students: [],
    });

    // 學生列表資料
    const students = ref([]);
    const totalStudents = ref(0);
    const totalStudentPages = ref(0);

    // 載入課程報表資料
    const loadCourseReport = async () => {
      try {
        loading.value = true;
        const data = await apiService.getCourseReport(courseId);
        courseDetail.value = {
          name: data.title,
          instructor: data.instructors.join(", "),
          category: data.categories.join(", "),
          completionRate: data.completion_rate,
          averageScore: data.average_score,
          chapters: data.chapters.map((chapter) => ({
            name: chapter.title,
            completionRate: chapter.completion_rate,
          })),
        };
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("Error loading course report:", error);
      }
    };

    // 載入學生列表資料
    const loadStudents = async () => {
      try {
        loading.value = true;
        const data = await apiService.getCourseStudents(courseId, {
          page: currentPage.value,
        });
        students.value = data.students;
        totalStudents.value = data.total;
        totalStudentPages.value = data.totalPages;
        loading.value = false;
      } catch (error) {
        loading.value = false;
        console.error("Error loading students:", error);
      }
    };

    const exportReport = async () => {
      loading.value = true;
      await apiService.getCourseReportExcel(courseId);
      loading.value = false;
    };

    // 初始化資料
    onMounted(() => {
      loadCourseReport();
      loadStudents();
    });

    // 分頁相關狀態
    const currentPage = ref(1);

    // 頁碼變更處理
    const handlePageChange = async (page) => {
      currentPage.value = page;
      await loadStudents();
    };

    const viewExam = async (studentId) => {
      try {
        loading.value = true;
        const results = await apiService.getStudentExamDetail({
          course_id: courseId,
          user_id: studentId,
        });

        selectedExamData.value = results;
        showExamModal.value = true;
        loading.value = false;
      } catch (error) {
        console.error("Error fetching student details:", error);
        // 如果是404錯誤，顯示尚未進行考試的提示
        if (error.response && error.response.status === 404) {
          alert("此學生尚未進行考試");
        }
      }
    };

    const viewStudent = async (studentId) => {
      try {
        loading.value = true;
        // 呼叫API取得學生資料
        const response = await apiService.getCourseStudent(courseId, studentId);

        // 整理API回傳的資料
        selectedStudent.value = {
          id: studentId,
          name: response.student_info.name,
          email: response.student_info.email,
          courseName: response.course_info.title,
          progress: response.course_info.progress,
          totalTime: `${response.student_info.total_study_hours}小時`,
          lastAccess: response.student_info.last_login,
          // 轉換章節進度資料格式
          chapterProgress: response.chapters.map((chapter) => ({
            title: chapter.title,
            progress: chapter.progress
          })),
          // 轉換測驗結果資料格式
          quizResults: response.quizResults
        };

        showStudentModal.value = true;
        loading.value = false;
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    };

    return {
      courseDetail,
      currentPage,
      students,
      totalStudentPages,
      handlePageChange,
      viewStudent,
      showStudentModal,
      selectedStudent,
      showExamModal,
      selectedExamData,
      viewExam,
      exportReport,
      courseId,
      loading
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
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <h6 class="card-title mb-0">課程詳細報表</h6>
                  <button class="btn btn-primary" @click="exportReport">
                    <i class="material-icons align-middle me-1"
                      >file_download</i
                    >
                    匯出報表
                  </button>
                </div>
                <hr />

                <!-- 課程基本資訊 -->
                <div class="course-info mt-3">
                  <div class="row">
                    <div class="col-md-6">
                      <p><strong>課程名稱：</strong>{{ courseDetail.name }}</p>
                      <p>
                        <strong>講師：</strong>{{ courseDetail.instructor }}
                      </p>
                      <p>
                        <strong>課程分類：</strong>{{ courseDetail.category }}
                      </p>
                    </div>
                    <div class="col-md-6">
                      <strong>平均完課率：</strong>
                      <div class="progress">
                        <div
                          class="progress-bar bg-success"
                          role="progressbar"
                          :style="{ width: courseDetail.completionRate + '%' }"
                        >
                          {{ courseDetail.completionRate }}%
                        </div>
                      </div>

                      <strong>平均成績：</strong>
                      <div class="progress">
                        <div
                          class="progress-bar bg-info"
                          role="progressbar"
                          :style="{ width: courseDetail.averageScore + '%' }"
                        >
                          {{ courseDetail.averageScore }}分
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 章節完成率 -->
                <h6 class="card-subtitle mt-3">章節完成率</h6>
                <hr />
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>章節名稱</th>
                        <th>完成率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="chapter in courseDetail.chapters"
                        :key="chapter.name"
                      >
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
                <hr />
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
                      <tr v-for="student in students" :key="student.id">
                        <td>{{ student.name }}</td>
                        <td>{{ student.email }}</td>
                        <td>
                          <div class="btn-group">
                            <button
                              class="btn btn-primary btn-sm"
                              @click="viewStudent(student.id)"
                            >
                              檢視
                            </button>
                            <button
                              class="btn btn-info btn-sm"
                              @click="viewExam(student.id)"
                            >
                              測驗閱卷詳情
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-3" v-if="totalStudentPages > 1">
                  <ul class="pagination justify-content-center">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(currentPage - 1)"
                      >
                        上一頁
                      </a>
                    </li>
                    <li
                      v-for="page in totalStudentPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(page)"
                      >
                        {{ page }}
                      </a>
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalStudentPages }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(currentPage + 1)"
                      >
                        下一頁
                      </a>
                    </li>
                  </ul>
                </nav>

                <!-- 學生詳細資料模態框 -->
                <StudentDetailModal
                  v-model:show="showStudentModal"
                  :student="selectedStudent"
                  :course-id="courseId"
                  :student-id="selectedStudent?.id"
                />

                <!-- 閱卷詳情模態框 -->
                <ExamReviewModal
                  v-model:show="showExamModal"
                  :examData="selectedExamData"
                />
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