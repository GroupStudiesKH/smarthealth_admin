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
      created_at: "",
      total_study_hours: 0,
      last_login: "",
    });

    const tableData = ref([]);
    const showModal = ref(false);
    const selectedCourse = ref({
      chapters: [],
    });
    const currentPage = ref(1);
    const pageSize = ref(10);
    const totalPages = ref(1);

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
        const response = await apiService.getStudentLearningRecord(memberId, {
          page: currentPage.value,
          pageSize: pageSize.value,
        });
        memberInfo.value = response.student;
        tableData.value = response.courses;
        totalPages.value = response.pagination.totalPages;
      } catch (error) {
        console.error("Failed to fetch member info:", error);
      }
    };

    const handleViewDetails = (course) => {
      console.log("Viewing details for course:", course);
      selectedCourse.value = {
        courseId: course.id,
        studentId: memberId,
        name: memberInfo.value.name,
        email: memberInfo.value.email,
        courseName: course.name,
        progress: course.completion_rate,
        totalTime: `${memberInfo.value.total_study_hours}小時`,
        lastAccess: memberInfo.value.last_login,
        // 轉換章節進度資料格式
        chapterProgress: course.chapter.map((chapter) => ({
          title: chapter.title,
          progress: chapter.progress,
        })),
        // 轉換測驗結果資料格式
        quizResults: course.quizResults.map((chapter) => ({
          is_pass: false,
          score: chapter.score,
          date: chapter.date || "-",
          time: chapter.time || "-",
        })),
      };

      showModal.value = true;
    };

    const handlePageChange = async (page) => {
      currentPage.value = page;
      await fetchMemberInfo();
    };

    onMounted(() => {
      fetchMemberInfo();
    });

    return {
      memberId,
      memberInfo,
      tableData,
      tableColumns,
      showModal,
      selectedCourse,
      handleViewDetails,
      currentPage,
      totalPages,
      handlePageChange,
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
                        {{
                          new Date(memberInfo.created_at).toLocaleDateString()
                        }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- 課程列表 -->
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">
                          {{ column.label }}
                        </th>
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
                          <button
                            class="btn btn-sm btn-info"
                            @click="handleViewDetails(item)"
                          >
                            <i class="material-icons">visibility</i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁 -->
                <nav class="mt-3" v-if="totalPages > 1">
                  <ul class="pagination justify-content-center">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(currentPage - 1)"
                        >上一頁</a
                      >
                    </li>
                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(page)"
                        >{{ page }}</a
                      >
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="handlePageChange(currentPage + 1)"
                        >下一頁</a
                      >
                    </li>
                  </ul>
                </nav>

                <!-- 詳細資訊 Modal -->
                <StudentDetailModal
                  v-model:show="showModal"
                  :studentId="memberId"
                  :courseId="selectedCourse.id"
                  :student="{
                    name: memberInfo.name,
                    email: memberInfo.email,
                    courseName: selectedCourse ? selectedCourse.name : '-',
                    totalTime: selectedCourse ? '計算中' : '-',
                    lastAccess: memberInfo.created_at,
                    progress: selectedCourse
                      ? parseInt(selectedCourse.completion_rate)
                      : 0,
                    chapterProgress: selectedCourse.chapter,
                    quizResults: selectedCourse.quizResults,
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