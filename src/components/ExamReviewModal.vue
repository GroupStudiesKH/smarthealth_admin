<script>
import { ref } from 'vue'

export default {
  name: 'ExamReviewModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    examData: {
      type: Object,
      required: true
    }
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const closeModal = () => {
      emit('update:show', false)
    }

    return {
      closeModal
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">測驗閱卷詳情</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <!-- 基本資訊 -->
          <div class="exam-info mb-4">
            <div class="row">
              <div class="col-md-6">
                <p><strong>測驗名稱：</strong>{{ examData.examName }}</p>
                <p><strong>測驗時間：</strong>{{ examData.examTime }}</p>
                <p><strong>考試分數：</strong>{{ examData.score }}分</p>
              </div>
            </div>
          </div>

          <!-- 作答列表 -->
          <div class="answer-list">
            <h6>作答詳情</h6>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>題號</th>
                    <th>題目</th>
                    <th>學生答案</th>
                    <th>正確答案</th>
                    <th>是否正確</th>
                    <th>填答時間</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="answer in examData.answers" :key="answer.questionId"
                      :class="{ 'table-success': answer.isCorrect, 'table-danger': !answer.isCorrect }">
                    <td>{{ answer.questionId }}</td>
                    <td>{{ answer.question }}</td>
                    <td>{{ answer.studentAnswer }}</td>
                    <td>{{ answer.correctAnswer }}</td>
                    <td>
                      <span v-if="answer.isCorrect" class="badge bg-success">正確</span>
                      <span v-else class="badge bg-danger">錯誤</span>
                    </td>
                    <td>{{ answer.answerTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.table td {
  vertical-align: middle;
}
</style>