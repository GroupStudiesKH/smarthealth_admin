<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Footer from '@/components/Footer.vue'
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const examId = route.params.id

    // 模擬測驗結果數據
    const examResult = ref({
      courseName: '基礎醫療保健課程',
      averageScore: 85,
      totalParticipants: 156,
      questions: [
        {
          id: 1,
          type: '是非題',
          question: '人體正常體溫是37度',
          correctAnswer: true,
          correctCount: 142,
          incorrectCount: 14
        },
        {
          id: 2,
          type: '單選題',
          question: '下列哪個是正確的CPR壓胸位置？',
          options: ['胸骨上端', '胸骨中下段', '左胸', '右胸'],
          correctAnswer: 1,
          correctCount: 138,
          incorrectCount: 18
        },
        {
          id: 3,
          type: '多選題',
          question: '以下哪些是中暑的症狀？',
          options: ['頭暈', '噁心', '體溫升高', '皮膚發紅'],
          correctAnswer: [0, 1, 2, 3],
          correctCount: 125,
          incorrectCount: 31
        }
      ]
    })

    const goToCourseReport = () => {
      router.push(`/statistics/course-report/${examId}`)
    }

    return {
      examResult,
      goToCourseReport
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
                <h6 class="card-title">{{ examResult.courseName }} - 測驗結果分析</h6>
                
                <!-- 平均分數區塊 -->
                <div class="alert alert-info mb-4">
                  <div class="d-flex align-items-center">
                    <div class="me-3">
                      <h3 class="mb-0">{{ examResult.averageScore }}</h3>
                      <small>平均分數</small>
                    </div>
                    <div class="ms-auto">
                      <h3 class="mb-0">{{ examResult.totalParticipants }}</h3>
                      <small>參與人數</small>
                    </div>
                  </div>
                </div>

                <!-- 題目分析列表 -->
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>題型</th>
                        <th>題目</th>
                        <th>正確答案</th>
                        <th>答對人數</th>
                        <th>答錯人數</th>
                        <th>正確率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="question in examResult.questions" :key="question.id">
                        <td>{{ question.type }}</td>
                        <td>{{ question.question }}</td>
                        <td>
                          <!-- 是非題答案 -->
                          <template v-if="question.type === '是非題'">
                            {{ question.correctAnswer ? '是' : '否' }}
                          </template>
                          <!-- 單選題答案 -->
                          <template v-else-if="question.type === '單選題'">
                            {{ question.options[question.correctAnswer] }}
                          </template>
                          <!-- 多選題答案 -->
                          <template v-else>
                            <div v-for="index in question.correctAnswer" :key="index">
                              {{ question.options[index] }}
                            </div>
                          </template>
                        </td>
                        <td>{{ question.correctCount }}</td>
                        <td>{{ question.incorrectCount }}</td>
                        <td>
                          {{ Math.round((question.correctCount / (question.correctCount + question.incorrectCount)) * 100) }}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 課程報表連結 -->
                <div class="text-end mt-4">
                  <button class="btn btn-primary" @click="goToCourseReport">
                    查看課程詳細報表
                  </button>
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