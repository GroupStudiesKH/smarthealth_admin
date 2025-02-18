<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from "@/components/Footer.vue"
import Navbar from "@/components/Navbar.vue"
import Sidebar from "@/components/Sidebar.vue"
import QuestionModal from "@/components/QuestionModal.vue"

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    QuestionModal
  },
  setup() {
    const route = useRoute()
    const examId = route.params.id

    // 搜尋和篩選相關的狀態
    const searchQuery = ref('')
    const selectedChapter = ref('全部')

    // 模擬題目數據
    const questions = ref([
      {
        id: 1,
        type: '是非題',
        content: 'FHIR是一種醫療資訊交換標準',
        chapter: '第一章：FHIR基礎概念',
        answer: true,
        explanation: 'FHIR是一種現代化的醫療資訊交換標準，用於促進醫療系統間的數據互通'
      },
      {
        id: 2,
        type: '單選題',
        content: '下列哪個不是FHIR的主要目標？',
        chapter: '第二章：FHIR應用',
        options: [
          '資料互通性',
          '系統整合',
          '資料加密',
          '標準化'
        ],
        answer: 2,
        explanation: 'FHIR的主要目標是實現醫療資訊的互通性、系統整合和標準化，而不是專注於資料加密'
      },
      {
        id: 3,
        type: '多選題',
        content: '以下哪些是電子病歷系統的優點？',
        chapter: '第三章：電子病歷系統',
        options: [
          '資料標準化',
          '跨院所互通',
          '即時更新',
          '降低錯誤'
        ],
        answer: [0, 1, 2, 3],
        explanation: '電子病歷系統具有資料標準化、跨院所互通、即時更新和降低錯誤等多項優點'
      }
    ])

    // 獲取所有章節選項
    const chapterOptions = computed(() => {
      const chapters = new Set(questions.value.map(q => q.chapter))
      return ['全部', ...Array.from(chapters)]
    })

    // 篩選後的題目列表
    const filteredQuestions = computed(() => {
      return questions.value.filter(question => {
        const matchQuery = searchQuery.value.toLowerCase().trim() === '' ||
          question.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          (question.explanation && question.explanation.toLowerCase().includes(searchQuery.value.toLowerCase()))
        const matchChapter = selectedChapter.value === '全部' || question.chapter === selectedChapter.value
        return matchQuery && matchChapter
      })
    })

    // 格式化答案顯示
    const formatAnswer = (question) => {
      if (question.type === '是非題') {
        return question.answer ? '是' : '否'
      } else if (question.type === '單選題') {
        return question.options[question.answer]
      } else if (question.type === '多選題') {
        return question.answer.map(index => question.options[index]).join('、')
      }
      return ''
    }

    // 刪除題目
    const deleteQuestion = (questionId) => {
      const index = questions.value.findIndex(q => q.id === questionId)
      if (index !== -1) {
        questions.value.splice(index, 1)
      }
    }


    // 控制 Modal 顯示
    const showQuestionModal = ref(false)
    const currentQuestion = ref(null)
    const isEditMode = ref(false)

    // 新增題目
    const addQuestion = () => {
      currentQuestion.value = null
      isEditMode.value = false
      showQuestionModal.value = true
    }

    // 編輯題目
    const editQuestion = (questionId) => {
      const question = questions.value.find(q => q.id === questionId)
      if (question) {
        currentQuestion.value = { ...question }
        isEditMode.value = true
        showQuestionModal.value = true
      }
    }

    // 保存題目
    const saveQuestion = (questionData) => {
      if (isEditMode.value) {
        // 更新現有題目
        const index = questions.value.findIndex(q => q.id === questionData.id)
        if (index !== -1) {
          questions.value[index] = questionData
        }
      } else {
        // 新增題目
        const newId = Math.max(...questions.value.map(q => q.id), 0) + 1
        questions.value.push({
          ...questionData,
          id: newId
        })
      }
    }

    return {
      questions: filteredQuestions,
      searchQuery,
      selectedChapter,
      chapterOptions,
      formatAnswer,
      deleteQuestion,
      editQuestion,
      addQuestion,
      showQuestionModal,
      currentQuestion,
      isEditMode,
      saveQuestion
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
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title mb-0">題目管理</h6>
                  <button class="btn btn-primary" @click="addQuestion">
                    <i class="material-icons align-middle me-1">add</i>
                    新增題目
                  </button>
                </div>

                <!-- 搜尋和篩選區域 -->
                <div class="row mb-3">
                  <div class="col-md-6">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQuery"
                      placeholder="搜尋題目內容或答案說明..."
                    />
                  </div>
                  <div class="col-md-6">
                    <select
                      class="form-select"
                      v-model="selectedChapter"
                    >
                      <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
                        {{ chapter }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>題型</th>
                        <th>題目內容</th>
                        <th>答案</th>
                        <th>答案說明</th>
                        <th>所屬章節/考試</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="question in questions" :key="question.id">
                        <td>
                          <span class="badge" :class="{
                            'bg-primary': question.type === '單選題',
                            'bg-success': question.type === '多選題',
                            'bg-info': question.type === '是非題'
                          }">
                            {{ question.type }}
                          </span>
                        </td>
                        <td>{{ question.content }}</td>
                        <td>{{ formatAnswer(question) }}</td>
                        <td>{{ question.explanation }}</td>
                        <td>{{ question.chapter }}</td>
                        <td>
                          <button class="btn btn-primary btn-sm me-2" @click="editQuestion(question.id)">
                            <i class="material-icons align-middle">edit</i>
                            編輯
                          </button>
                          <button class="btn btn-danger btn-sm" @click="deleteQuestion(question.id)">
                            <i class="material-icons align-middle">delete</i>
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
        :questionData="currentQuestion"
        :isEdit="isEditMode"
        @save="saveQuestion"
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