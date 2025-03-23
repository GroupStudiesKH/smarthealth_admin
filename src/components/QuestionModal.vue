<script>
import { ref, watch } from "vue";
import apiService from "@/service/api-service";

export default {
  name: "QuestionModal",
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    questionID: {
      type: String,
      required: true,
    },
    chapterOptions: {
      type: Array,
      default: () => [],
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:show", "save"],
  setup(props, { emit }) {
    const questionForm = ref({
      ...props.questionData,
    });
    const questionOptions = ref([]);
    const questionType = ref("");
    const questionAnswer = ref([]);
    const chapterOptions = ref(props.chapterOptions);

    const questionID = ref(props.questionID);
    watch(
      () => props.questionID,
      (newID) => {
        questionID.value = newID;
        if (newID) {
          getQuestion(newID);
        }
      }
    );

    // 題型選項
    // 題型列舉
    const questionTypes = {
      true_false: "是非題",
      single_choice: "單選題",
      multiple_choice: "多選題",
    };



    const getQuestion = async (id) => {
      try {
        const response = await apiService.getQuestion(id);
        questionForm.value = response;
        questionType.value = response.type;
        questionAnswer.value = [];
        console.log(questionType.value);

        questionOptions.value = response.options;
        response.options.forEach((option, index) => {
          if (option.is_correct) {
            questionAnswer.value.push(index);
          }
        });
      } catch (error) {
        console.error("獲取題目失敗:", error);
      }
    };

    // 監聽題型變化
    watch(
      () => questionType.value,
      (newType) => {
        // 重置答案
        questionOptions.value = [{ option_text: "是", option_index: 0, is_correct: true }, { option_text: "否", option_index: 1, is_correct: false}];

        if(newType == questionForm.value.type){
          questionOptions.value = questionForm.value.options || [];
        }

      }
    );

    const setAnswer = (index) => {
      if (questionForm.value.type != "true_false") {
        const position = questionAnswer.value.indexOf(index);
        if (position === -1) {
          questionAnswer.value.push(index);
        } else {
          questionAnswer.value.splice(position, 1);
        }
      }else{
        questionAnswer.value = [index];
      }
    }

    // 新增選項
    const addOption = () => {
      questionOptions.value.push("");
      questionForm.value.options = questionOptions.value;
    };

    // 刪除選項
    const removeOption = (index) => {
      questionOptions.value.splice(index, 1);
      questionForm.value.options = questionOptions.value;
      // 更新答案
      if (questionForm.value.type === "單選題") {
        if (questionForm.value.answer >= index) {
          questionForm.value.answer = null;
        }
      } else if (questionForm.value.type === "多選題") {
        questionForm.value.answer = questionForm.value.answer.filter(
          (ans) => ans < index
        );
      }
    };

    // 更新選項內容
    const updateOption = (index, value) => {
      questionOptions.value[index] = value;
      questionForm.value.options = questionOptions.value;
    };

    // 切換多選答案
    const toggleMultipleAnswer = (index) => {
      if (!Array.isArray(questionForm.value.answer)) {
        questionForm.value.answer = [];
      }
      const position = questionForm.value.answer.indexOf(index);
      if (position === -1) {
        questionForm.value.answer.push(index);
      } else {
        questionForm.value.answer.splice(position, 1);
      }
      questionForm.value.answer.sort((a, b) => a - b);
    };

    // 關閉modal
    const closeModal = () => {
      emit("update:show", false);
    };

    // 保存題目
    const saveQuestion = () => {
      emit("save", questionForm.value);
      closeModal();
    };

    return {
      questionForm,
      questionTypes,
      chapterOptions,
      addOption,
      removeOption,
      updateOption,
      toggleMultipleAnswer,
      closeModal,
      saveQuestion,
      questionType,
      questionOptions,
      setAnswer,
      questionAnswer
    };
  },
};
</script>

<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ isEdit ? "編輯題目" : "新增題目" }}</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveQuestion">
            <!-- 題型選擇 -->
            {{ questionForm }}
            {{ questionType }}
            <div class="mb-3">
              <label class="form-label">題型</label>
              <select class="form-select" v-model="questionType">
                <option
                  v-for="(value, key) in questionTypes"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </select>
            </div>

            <!-- 所屬範圍 -->
            <div class="mb-3">
              <label class="form-label">所屬範圍</label>
              <select class="form-select" v-model="questionForm.chapter">
                <option value="">請選擇章節/考試範圍</option>
                <option
                  v-for="chapter in chapterOptions"
                  :key="chapter.id"
                  :value="chapter.id"
                >
                  {{ chapter.title }}
                </option>
              </select>
            </div>

            <!-- 題目內容 -->
            <div class="mb-3">
              <label class="form-label">題目內容</label>
              <textarea
                class="form-control"
                v-model="questionForm.question"
                rows="3"
                required
              ></textarea>
            </div>

            <!-- 答案設定區域 -->
            <div class="mb-3">
              <label class="form-label">答案設定</label>

              <!-- 是非題答案 -->
              <div v-if="questionType === 'true_false'" class="d-flex gap-3">
                <div class="form-check" v-for="(qValue, qKey) in questionOptions" v-bind:key="qKey">
                  <input
                    type="radio"
                    class="form-check-input"
                    :checked="questionAnswer.indexOf(qKey) !== -1"
                    @click="setAnswer(qKey)"
                    required
                  />
                  <label class="form-check-label">{{ qValue.option_text }}</label>
                </div>

              </div>

              <!-- 單選題和多選題選項 -->
              <div v-else>
                <div class="mb-2 d-flex justify-content-end">
                  <button
                    type="button"
                    class="btn btn-outline-primary btn-sm"
                    @click="addOption"
                  >
                    <i class="material-icons align-middle">add</i>
                    新增選項
                  </button>
                </div>
                <div
                  v-for="(option, index) in options"
                  :key="index"
                  class="mb-2 d-flex gap-2 align-items-center"
                >
                  <div class="form-check flex-grow-1">
                    <input
                      :type="
                        questionForm.type === '單選題' ? 'radio' : 'checkbox'
                      "
                      class="form-check-input"
                      :value="index"
                      v-model="questionForm.answer"
                      @change="
                        questionForm.type === '多選題' &&
                          toggleMultipleAnswer(index)
                      "
                      required
                    />
                    <input
                      type="text"
                      class="form-control"
                      v-model="options[index]"
                      @input="updateOption(index, $event.target.value)"
                      placeholder="請輸入選項內容"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="removeOption(index)"
                    :disabled="questionOptions.length <= 2"
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
                v-model="questionForm.note"
                rows="2"
                required
              ></textarea>
            </div>

            <!-- 提交按鈕 -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                取消
              </button>
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