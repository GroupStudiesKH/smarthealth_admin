<script>
import { ref } from 'vue'

export default {
  name: 'StudentDetailModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    student: {
      type: Object,
      required: true
    }
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:show', false)
    }

    const downloadCertificate = () => {
      // 這裡可以實作下載證明的邏輯
      console.log('下載結訓證明', props.student)
      // TODO: 實作與後端 API 的串接
    }

    const downloadLearningRecord = () => {
      // 這裡可以實作下載學習紀錄的邏輯
      console.log('下載學習紀錄', props.student)
      // TODO: 實作與後端 API 的串接
    }

    return {
      closeModal,
      downloadCertificate,
      downloadLearningRecord
    }
  }
}
</script>

<template>
  <div v-if="show">
    <div class="modal fade show d-block" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"> {{ student.name }} 學習詳細資料</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body" v-if="student">
            <!-- 基本資訊 -->
            <div class="student-info mb-4">
              <h6>基本資訊</h6>
              <div class="row">
                <div class="col-md-6">
                  <p><strong>學生姓名：</strong>{{ student.name }}</p>
                  <p><strong>電子郵件：</strong>{{ student.email }}</p>
                  <p><strong>課程名稱：</strong>{{ student.courseName }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>總學習時數：</strong>{{ student.totalTime }}</p>
                  <p><strong>最後登入：</strong>{{ student.lastAccess }}</p>
                </div>
              </div>
              <div class="progress mb-3">
                <div class="progress-bar bg-success" role="progressbar" :style="{ width: student.progress + '%' }">
                  總進度：{{ student.progress }}%
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
                    <tr v-for="chapter in student.chapterProgress" :key="chapter.name">
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
                      <th>測驗類型</th>
                      <th>測驗名稱</th>
                      <th>分數</th>
                      <th>完成日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="student.quizResults">
                      <!-- 章節測驗 -->
                      <tr v-for="quiz in student.quizResults.filter(q => !q.isExam)" :key="quiz.name">
                        <td>章節測驗</td>
                        <td>{{ quiz.name }}</td>
                        <td>{{ quiz.score }}</td>
                        <td>{{ quiz.date }}</td>
                      </tr>
                      <!-- 大考成績 -->
                      <tr v-for="quiz in student.quizResults.filter(q => q.isExam)" :key="quiz.name" class="table-primary">
                        <td>大考</td>
                        <td>{{ quiz.name }}</td>
                        <td>{{ quiz.score }}</td>
                        <td>{{ quiz.date }}</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary me-2" @click="downloadLearningRecord">學習紀錄下載</button>
            <button type="button" class="btn btn-primary me-2" @click="downloadCertificate">結訓證明下載</button>
            <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
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
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-dialog {
  max-width: 800px;
}
</style>