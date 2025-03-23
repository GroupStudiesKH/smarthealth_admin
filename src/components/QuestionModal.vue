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
      id: "",
      chapter: "",
      question: "",
      type: "true_false",
      note: "",
      options: []
    });
    const questionType = ref("true_false");
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
    const questionTypes = {
      true_false: "是非題",
      single_choice: "單選題",
      multiple_choice: "多選題",
    };

    const getQuestion = async (id) => {
      try {
        questionForm.value = {
          id: "",
          chapter: "",
          question: "",
          type: "true_false",
          note: "",
          options: []
        };
        const response = await apiService.getQuestion(id);
        questionForm.value = response;
        questionType.value = response.type;
      } catch (error) {
        console.error("獲取題目失敗:", error);
      }
    };

    // 監聽題型變化
    watch(
      () => questionType.value,
      (newType) => {
        if (newType === "true_false") {
          questionForm.value.options = [
            { option_text: "是", option_index: 0, is_correct: true },
            { option_text: "否", option_index: 1, is_correct: false }
          ];
        } else if (newType !== questionForm.value.type) {
          questionForm.value.options = [];
        }
        questionForm.value.type = newType;
      }
    );

    // 設置答案
    const setAnswer = (index) => {
      if (questionForm.value.type === "true_false" || questionForm.value.type === "single_choice") {
        questionForm.value.options.forEach((option, idx) => {
          option.is_correct = idx === index;
        });
      } else {
        questionForm.value.options[index].is_correct = !questionForm.value.options[index].is_correct;
      }
    };

    // 新增選項
    const addOption = () => {
      questionForm.value.options.push({
        option_text: "",
        option_index: questionForm.value.options.length,
        is_correct: false
      });
    };

    // 刪除選項
    const removeOption = (index) => {
      questionForm.value.options.splice(index, 1);
      // 更新選項索引
      questionForm.value.options.forEach((option, idx) => {
        option.option_index = idx;
      });
    };

    // 更新選項內容
    const updateOption = (index, value) => {
      questionForm.value.options[index].option_text = value;
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
      closeModal,
      saveQuestion,
      questionType,
      setAnswer
    };
  },
};
</script>

<template>
  <div class="modal-backdrop fade show" v-if="show"></div>
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
              <label class="form-label">選項與答案</label>
              <div class="options-container">
                <div
                  v-for="(option, index) in questionForm.options"
                  :key="index"
                  class="option-item mb-2 d-flex align-items-center"
                >
                  <div class="form-check flex-grow-1">
                    <input
                      :type="questionForm.type === 'multiple_choice' ? 'checkbox' : 'radio'"
                      name="answer"
                      class="form-check-input"
                      :checked="option.is_correct"
                      @change="setAnswer(index)"
                    />
                    <input
                      type="text"
                      class="form-control d-inline-block ms-2"
                      style="width: calc(100% - 30px)"
                      v-model="option.option_text"
                      :placeholder="'選項' + (index + 1)"
                      @input="updateOption(index, $event.target.value)"
                    />
                  </div>
                  <button
                    v-if="questionForm.type !== 'true_false' && questionForm.options.length > 2"
                    type="button"
                    class="btn btn-outline-danger btn-sm ms-2"
                    @click="removeOption(index)"
                  >
                    刪除
                  </button>
                </div>
              </div>
              <button
                v-if="questionForm.type !== 'true_false'"
                type="button"
                class="btn btn-outline-primary btn-sm mt-2"
                @click="addOption"
              >
                新增選項
              </button>
            </div>

            <!-- 備註 -->
            <div class="mb-3">
              <label class="form-label">備註</label>
              <textarea
                class="form-control"
                v-model="questionForm.note"
                rows="2"
              ></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">
                取消
              </button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.option-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
</style>