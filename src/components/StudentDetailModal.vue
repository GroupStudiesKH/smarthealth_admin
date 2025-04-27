<script>
import { ref } from 'vue'
import apiService from "@/service/api-service";


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
    },
    courseId: {
      type: String,
      required: true
    },
    studentId: {
      type: String,
      required: true
    }
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:show', false)
    }

    const downloadCertificate = () => {
      apiService.getCourseStudentCert(props.courseId, props.studentId)
    }

    const downloadLearningRecord = () => {
      apiService.getCourseStudentExcel(props.courseId, props.studentId)
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
            <h5 class="modal-title">{{ student.courseName }} - {{ student.name }} 同學學習資料</h5>
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
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="chapter in student.chapterProgress" :key="chapter.title">
                      <td>{{ chapter.title }}</td>
                      <td>
                        <div class="progress">
                          <div class="progress-bar bg-info" role="progressbar" :style="{ width: chapter.progress + '%' }">
                            {{ chapter.progress }}%
                          </div>
                        </div>
                      </td>
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
                      <th>日期</th>
                      <th>分數</th>
                      <th>是否通過</th>
                      <th>耗時</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-if="student.quizResults">
                      <!-- 章節測驗 -->
                      <tr v-for="quiz in student.quizResults" :key="quiz.id">
                        <td>{{ quiz.date }}</td>
                        <td>{{ quiz.score }}</td>
                        <td>{{ quiz.is_pass ? '通過' : '未通過' }}</td>
                        <td>{{ quiz.time }} 分鐘</td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary me-2" @click="downloadLearningRecord">學習紀錄下載</button>
            <button type="button" class="btn btn-primary me-2" @click="downloadCertificate" v-if="student.examIsPassed">結訓證明下載</button>
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