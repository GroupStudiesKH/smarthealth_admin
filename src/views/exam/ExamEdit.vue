<script>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import QuestionModal from "@/components/QuestionModal.vue";
import apiService from "@/service/api-service";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    QuestionModal,
  },
  setup() {
    const route = useRoute();
    const examId = route.params.id;

    // 搜尋和篩選相關的狀態
    const searchQuery = ref("");
    const selectedChapter = ref("");
    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(0);
    const totalPages = ref(10);
    const chapterOptions = ref([]);
    const chapterModalOptions = ref([]);

    // 題目數據
    const questions = ref([]);

    // 獲取題目列表
    const fetchQuestions = async () => {
      try {
        const params = {
          course_id: examId,
          chapter_id: selectedChapter.value,
          status: "",
          search: searchQuery.value,
          page: currentPage.value,
          pageSize: pageSize.value,
        };
        const response = await apiService.getQuestionLists(params);
        chapterOptions.value = [{
          id: '',
          title: `全部`,
        }, ...response.chapterLists];
        chapterModalOptions.value = response.chapterLists;
        questions.value = response.questions;
        total.value = response.total;
        totalPages.value = response.totalPages;
      } catch (error) {
        console.error("獲取題目列表失敗：", error);
      }
    };

    // 監聽搜尋和分頁變化
    watch([currentPage], () => {
      fetchQuestions();
    });

    onMounted(() => {
      fetchQuestions();
    });

    // 格式化答案顯示
    const formatAnswer = (question) => {
      if (question.type === "true_false") {
        return question.correctOptions[0].option_text;
      }
      return "";
    };

    // 刪除題目
    const deleteQuestion = async (questionId) => {
      try {
        // 使用 confirm 確認是否要刪除
        if (confirm('確定要刪除此題目嗎？')) {
          const index = questions.value.findIndex((q) => q.id === questionId);
          if (index !== -1) {
            questions.value.splice(index, 1);
          }
          
          await apiService.delQuestion(questionId);
        }
      } catch (error) {
        console.error("刪除題目失敗：", error);
      }
    };

    // 控制 Modal 顯示
    const showQuestionModal = ref(false);
    const questionID = ref(null);
    const isEditMode = ref(false);

    // 新增題目
    const addQuestion = () => {
      currentQuestion.value = null;
      isEditMode.value = false;
      showQuestionModal.value = true;
    };

    // 編輯題目
    const editQuestion = async (qID) => {
      const question = questions.value.find((q) => q.id === qID);
      if (question) {
        isEditMode.value = true;
        showQuestionModal.value = true;
        questionID.value = qID;
      }
    };

    // 保存題目
    const saveQuestion = (questionData) => {
      if (isEditMode.value) {
        // 更新現有題目
        const index = questions.value.findIndex(
          (q) => q.id === questionData.id
        );
        if (index !== -1) {
          questions.value[index] = questionData;
        }
      } else {
        // 新增題目
        const newId = Math.max(...questions.value.map((q) => q.id), 0) + 1;
        questions.value.push({
          ...questionData,
          id: newId,
        });
      }
    };

    return {
      questions,
      searchQuery,
      selectedChapter,
      currentPage,
      pageSize,
      total,
      totalPages,
      formatAnswer,
      deleteQuestion,
      editQuestion,
      addQuestion,
      showQuestionModal,
      questionID,
      isEditMode,
      saveQuestion,
      chapterOptions,
      chapterModalOptions,
      fetchQuestions
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
                  class="d-flex justify-content-between align-items-center mb-4"
                >
                  <h6 class="card-title mb-0">題目管理</h6>
                  <button class="btn btn-primary" @click="addQuestion">
                    <i class="material-icons align-middle me-1">add</i>
                    新增題目
                  </button>
                </div>

                <!-- 搜尋和篩選區域 -->
                <div class="row mb-3">
                  <div class="col-md-5">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQuery"
                      placeholder="搜尋題目內容或答案..."
                    />
                  </div>
                  <div class="col-md-5">
                    <select class="form-select" v-model="selectedChapter">
                      <option
                        v-for="chapter in chapterOptions"
                        :key="chapter.id"
                        :value="chapter.id"
                      >
                        {{ chapter.title }}
                      </option>
                    </select>
                  </div>
                  <div class="col-md-2">
                    <button class="btn btn-primary" @click="fetchQuestions">
                      搜尋
                    </button>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>題型</th>
                        <th>題目內容</th>
                        <th>答案</th>
                        <th>註解</th>
                        <th>所屬章節/考試</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="question in questions" :key="question.id">
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'bg-primary': question.type === 'single_choice',
                              'bg-success': question.type === 'multiple_choice',
                              'bg-info': question.type === 'true_false',
                            }"
                          >
                            {{
                              question.type === "true_false"
                                ? "是非題"
                                : question.type === "single_choice"
                                ? "單選題"
                                : question.type === "multiple_choice"
                                ? "多選題"
                                : question.type
                            }}
                          </span>
                        </td>
                        <td>{{ question.question }}</td>
                        <td>{{ formatAnswer(question) }}</td>
                        <td>{{ question.note }}</td>
                        <td>{{ question.chapterName }}</td>
                        <td>
                          <button
                            class="btn btn-primary btn-sm me-2"
                            @click="editQuestion(question.id)"
                          >
                            <i class="material-icons align-middle">edit</i>
                            編輯
                          </button>
                          <button
                            class="btn btn-danger btn-sm"
                            @click="deleteQuestion(question.id)"
                          >
                            <i class="material-icons align-middle">delete</i>
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁器 -->
                <div
                  class="d-flex justify-content-between align-items-center mt-4"
                >
                  <div class="text-muted">
                    顯示 {{ (currentPage - 1) * pageSize + 1 }} 到
                    {{ Math.min(currentPage * pageSize, total) }} 筆，共
                    {{ total }} 筆
                  </div>
                  <nav>
                    <ul class="pagination mb-0">
                      <li
                        class="page-item"
                        :class="{ disabled: currentPage === 1 }"
                      >
                        <a
                          class="page-link"
                          href="#"
                          @click.prevent="currentPage--"
                          aria-label="Previous"
                        >
                          <span aria-hidden="true">&laquo;</span>
                        </a>
                      </li>
                      <li
                        v-for="page in totalPages"
                        :key="page"
                        class="page-item"
                        :class="{ active: page === currentPage }"
                      >
                        <a
                          class="page-link"
                          href="#"
                          @click.prevent="currentPage = page"
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
                          @click.prevent="currentPage++"
                          aria-label="Next"
                        >
                          <span aria-hidden="true">&raquo;</span>
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

      <!-- 題目編輯 Modal -->
      <QuestionModal
        v-model:show="showQuestionModal"
        :questionID="questionID"
        :chapterOptions="chapterModalOptions"
        :isEdit="isEditMode"
        @save="saveQuestion"
        v-if="chapterModalOptions.length > 0"
      />
    </div>
  </div>
</template>

<style scoped>
.material-icons {
  font-size: 16px;
  line-height: 1;
  vertical-align: middle;
}

.badge {
  font-size: 12px;
  padding: 5px 10px;
}
</style>