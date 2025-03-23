<script>
import { ref, watch } from 'vue'

export default {
  name: 'QuestionModal',
  props: {
    show: {
      type: Boolean,
      required: true
    },
    questionData: {
      type: Object,
      default: () => ({
        id: null,
        type: '是非題',
        content: '',
        chapter: '',
        options: [],
        answer: null,
        explanation: ''
      })
    },
    chapterOptions: {
      type: Array,
      default: () => []
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:show', 'save'],
  setup(props, { emit }) {
    const questionForm = ref({
      ...props.questionData
    })

    // 題型選項
    // 題型列舉
    const questionTypes = {
      true_false: '是非題',
      single_choice: '單選題',
      multiple_choice: '多選題'
    }

    // 選項列表（用於單選題和多選題）
    const options = ref(questionForm.value.options || [])

    const chapterOptions = ref(props.chapterOptions)

    // 監聽題型變化
    watch(() => questionForm.value.type, (newType) => {
      // 重置答案
      if (newType === '是非題') {
        questionForm.value.answer = null
        questionForm.value.options = []
      } else {
        questionForm.value.answer = newType === '單選題' ? null : []
        if (options.value.length === 0) {
          options.value = ['', '', '', '']
          questionForm.value.options = options.value
        }
        // 確保多選題的答案是陣列
        if (newType === '多選題' && !Array.isArray(questionForm.value.answer)) {
          questionForm.value.answer = []
        }
      }
    })

    // 新增選項
    const addOption = () => {
      options.value.push('')
      questionForm.value.options = options.value
    }

    // 刪除選項
    const removeOption = (index) => {
      options.value.splice(index, 1)
      questionForm.value.options = options.value
      // 更新答案
      if (questionForm.value.type === '單選題') {
        if (questionForm.value.answer >= index) {
          questionForm.value.answer = null
        }
      } else if (questionForm.value.type === '多選題') {
        questionForm.value.answer = questionForm.value.answer.filter(ans => ans < index)
      }
    }

    // 更新選項內容
    const updateOption = (index, value) => {
      options.value[index] = value
      questionForm.value.options = options.value
    }

    // 切換多選答案
    const toggleMultipleAnswer = (index) => {
      if (!Array.isArray(questionForm.value.answer)) {
        questionForm.value.answer = []
      }
      const position = questionForm.value.answer.indexOf(index)
      if (position === -1) {
        questionForm.value.answer.push(index)
      } else {
        questionForm.value.answer.splice(position, 1)
      }
      questionForm.value.answer.sort((a, b) => a - b)
    }

    // 關閉modal
    const closeModal = () => {
      emit('update:show', false)
    }

    // 保存題目
    const saveQuestion = () => {
      emit('save', questionForm.value)
      closeModal()
    }

    return {
      questionForm,
      questionTypes,
      chapterOptions,
      options,
      addOption,
      removeOption,
      updateOption,
      toggleMultipleAnswer,
      closeModal,
      saveQuestion
    }
  }
}
</script>

<template>
  <div v-if="show" class="modal fade show d-block" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? '編輯題目' : '新增題目' }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveQuestion">
            <!-- 題型選擇 -->
            <div class="mb-3">
              <label class="form-label">題型</label>
              <select class="form-select" v-model="questionForm.type">
                <option v-for="(value, key) in questionTypes" :key="key" :value="value">
                  {{ value }}
                </option>
              </select>
            </div>

            <!-- 所屬範圍 -->
            <div class="mb-3">
              <label class="form-label">所屬範圍</label>
              <select class="form-select" v-model="questionForm.chapter">
                <option value="">請選擇章節/考試範圍</option>
                <option v-for="chapter in chapterOptions" :key="chapter.id" :value="chapter.id">
                  {{ chapter.title }}
                </option>
              </select>
            </div>

            <!-- 題目內容 -->
            <div class="mb-3">
              <label class="form-label">題目內容</label>
              <textarea
                class="form-control"
                v-model="questionForm.content"
                rows="3"
                required
              ></textarea>
            </div>

            <!-- 答案設定區域 -->
            <div class="mb-3">
              <label class="form-label">答案設定</label>
              
              <!-- 是非題答案 -->
              <div v-if="questionForm.type === '是非題'" class="d-flex gap-3">
                <div class="form-check">
                  <input
                    type="radio"
                    class="form-check-input"
                    :value="true"
                    v-model="questionForm.answer"
                    required
                  >
                  <label class="form-check-label">是</label>
                </div>
                <div class="form-check">
                  <input
                    type="radio"
                    class="form-check-input"
                    :value="false"
                    v-model="questionForm.answer"
                    required
                  >
                  <label class="form-check-label">否</label>
                </div>
              </div>

              <!-- 單選題和多選題選項 -->
              <div v-else>
                <div class="mb-2 d-flex justify-content-end">
                  <button type="button" class="btn btn-outline-primary btn-sm" @click="addOption">
                    <i class="material-icons align-middle">add</i>
                    新增選項
                  </button>
                </div>
                <div v-for="(option, index) in options" :key="index" class="mb-2 d-flex gap-2 align-items-center">
                  <div class="form-check flex-grow-1">
                    <input
                      :type="questionForm.type === '單選題' ? 'radio' : 'checkbox'"
                      class="form-check-input"
                      :value="index"
                      v-model="questionForm.answer"
                      @change="questionForm.type === '多選題' && toggleMultipleAnswer(index)"
                      required
                    >
                    <input
                      type="text"
                      class="form-control"
                      v-model="options[index]"
                      @input="updateOption(index, $event.target.value)"
                      placeholder="請輸入選項內容"
                      required
                    >
                  </div>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeOption(index)"
                    :disabled="options.length <= 2"
                  >
                    <i class="material-icons">delete</i>
                  </button>
                </div>
              </div>
            </div>

            <!-- 答案說明 -->
            <div class="mb-3">
              <label class="form-label">答案說明</label>
              <textarea
                class="form-control"
                v-model="questionForm.explanation"
                rows="2"
                required
              ></textarea>
            </div>

            <!-- 提交按鈕 -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
              <button type="submit" class="btn btn-primary">儲存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.material-icons {
  font-size: 16px;
  line-height: 1;
  vertical-align: middle;
}
</style>