<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import StudentDetailModal from "@/components/StudentDetailModal.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    StudentDetailModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const memberId = route.params.id;

    const memberInfo = ref({
      name: "",
      email: "",
      created_at: ""
    });

    const tableData = ref([]);
    const showModal = ref(false);
    const selectedCourse = ref(null);

    const tableColumns = reactive([
      { key: "name", label: "課程名稱" },
      { key: "instructor", label: "課程講師" },
      { key: "category", label: "分類" },
      { key: "completion_rate", label: "完課率" },
      { key: "average_score", label: "平均分數" },
      { key: "actions", label: "操作" },
    ]);

    const fetchMemberInfo = async () => {
      try {
        // 模擬 API 響應數據
        const mockData = {
          name: "測試會員",
          email: "test@example.com",
          created_at: "2023-01-01"
        };
        memberInfo.value = mockData;
      } catch (error) {
        console.error("Failed to fetch member info:", error);
      }
    };

    const fetchCourseData = async () => {
      try {
        // 模擬 API 響應數據
        const mockData = Array(5).fill(null).map((_, index) => ({
          id: index + 1,
          name: `測試課程${index + 1}`,
          instructor: `講師${index + 1}`,
          category: `分類${index % 3 + 1}`,
          completion_rate: Math.round(Math.random() * 100) + "%",
          average_score: Math.round(Math.random() * 100),
          chapters: Array(5).fill(null).map((_, chapterIndex) => ({
            name: `章節${chapterIndex + 1}`,
            completion: Math.random() > 0.5,
            score: Math.round(Math.random() * 100)
          }))
        }));
        tableData.value = mockData;
      } catch (error) {
        console.error("Failed to fetch course data:", error);
      }
    };

    const handleViewDetails = (course) => {
      selectedCourse.value = course;
      showModal.value = true;
    };

    onMounted(() => {
      fetchMemberInfo();
      fetchCourseData();
    });

    return {
      memberInfo,
      tableData,
      tableColumns,
      showModal,
      selectedCourse,
      handleViewDetails,
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
                <h6 class="card-title mb-4">學習紀錄統計</h6>

                <!-- 會員基本資訊 -->
                <div class="mb-4">
                  <div class="row">
                    <div class="col-md-4">
                      <p class="mb-2">
                        <strong>會員名稱：</strong>
                        {{ memberInfo.name }}
                      </p>
                    </div>
                    <div class="col-md-4">
                      <p class="mb-2">
                        <strong>Email：</strong>
                        {{ memberInfo.email }}
                      </p>
                    </div>
                    <div class="col-md-4">
                      <p class="mb-2">
                        <strong>註冊日期：</strong>
                        {{ new Date(memberInfo.created_at).toLocaleDateString() }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 課程列表 -->
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">{{ column.label }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in tableData" :key="item.id">
                        <td>{{ item.name }}</td>
                        <td>{{ item.instructor }}</td>
                        <td>{{ item.category }}</td>
                        <td>{{ item.completion_rate }}</td>
                        <td>{{ item.average_score }}</td>
                        <td>
                          <button class="btn btn-sm btn-info" @click="handleViewDetails(item)">
                            <i class="material-icons">visibility</i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 詳細資訊 Modal -->
                <StudentDetailModal
                  v-model:show="showModal"
                  :student="{
                    name: memberInfo.name,
                    email: memberInfo.email,
                    totalTime: selectedCourse ? '計算中' : '-',
                    lastAccess: memberInfo.created_at,
                    progress: selectedCourse ? parseInt(selectedCourse.completion_rate) : 0,
                    chapterProgress: selectedCourse ? selectedCourse.chapters.map(chapter => ({
                      name: chapter.name,
                      progress: chapter.completion ? 100 : 0,
                      score: chapter.score
                    })) : [],
                    quizResults: selectedCourse ? [
                      ...selectedCourse.chapters.filter(chapter => chapter.score).map(chapter => ({
                        name: `${chapter.name}測驗`,
                        score: chapter.score,
                        date: '-',
                        isExam: false
                      })),
                      { name: '期中考試', score: 85, date: '2023-12-01', isExam: true },
                      { name: '期末考試', score: 90, date: '2023-12-15', isExam: true }
                    ] : []
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>