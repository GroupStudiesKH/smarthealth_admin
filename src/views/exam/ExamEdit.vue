<script>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Footer from "@/components/Footer.vue"
import Navbar from "@/components/Navbar.vue"
import Sidebar from "@/components/Sidebar.vue"

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
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
        content: '每天運動30分鐘有助於身體健康',
        chapter: '第一章：健康生活概論',
        answer: true,
        explanation: '規律運動確實有助於維持身體健康'
      },
      {
        id: 2,
        type: '單選題',
        content: '以下哪個不是健康飲食的原則？',
        chapter: '第二章：營養與健康',
        options: [
          '均衡飲食',
          '定時定量',
          '多吃高熱量食物',
          '注意營養成分'
        ],
        answer: 2,
        explanation: '健康飲食應該避免過度攝入高熱量食物'
      },
      {
        id: 3,
        type: '多選題',
        content: '以下哪些是良好的運動習慣？',
        chapter: '第三章：運動與保健',
        options: [
          '運動前熱身',
          '運動後伸展',
          '適度休息',
          '注意安全'
        ],
        answer: [0, 1, 2, 3],
        explanation: '這些都是正確的運動習慣'
      },
      {
        id: 4,
        type: '是非題',
        content: '吸菸對健康無害',
        chapter: '期中考試',
        answer: false,
        explanation: '吸菸會導致多種疾病'
      },
      {
        id: 5,
        type: '單選題',
        content: '以下哪個是最好的運動時間？',
        chapter: '期末考試',
        options: [
          '清晨',
          '中午',
          '傍晚',
          '睡前'
        ],
        answer: 0,
        explanation: '清晨運動可以提升一天的精神狀態'
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

    // 編輯題目
    const editQuestion = (questionId) => {
      // 導航到題目編輯頁面
      console.log('編輯題目:', questionId)
    }

    // 新增題目
    const addQuestion = () => {
      // 導航到新增題目頁面
      console.log('新增題目')
    }

    return {
      questions: filteredQuestions,
      searchQuery,
      selectedChapter,
      chapterOptions,
      formatAnswer,
      deleteQuestion,
      editQuestion,
      addQuestion
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