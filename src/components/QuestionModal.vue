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
      chapter_id: "",
      question: "",
      type: "true_false",
      note: "",
      options: [
        { option_text: "是", option_index: 0, is_correct: true },
        { option_text: "否", option_index: 1, is_correct: false },
      ],
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
        }else{
          questionForm.value = {
            id: "",
            chapter_id: "",
            question: "",
            type: "true_false",
            note: "",
            options: [
              { option_text: "是", option_index: 0, is_correct: true },
              { option_text: "否", option_index: 1, is_correct: false },
            ],
          }
        }
      }
    );
    
    // 監聽彈窗顯示狀態，當彈窗打開且不是編輯模式時重置表單
    watch(
      () => props.show,
      (newShow) => {
        if (newShow && !props.isEdit) {
          questionForm.value = {
            id: "",
            chapter_id: "",
            question: "",
            type: "true_false",
            note: "",
            options: [
              { option_text: "是", option_index: 0, is_correct: true },
              { option_text: "否", option_index: 1, is_correct: false },
            ],
          };
          questionType.value = "true_false";
        }
      }
    );

    // 題型選項
    const questionTypes = {
      true_false: "是非題",
      single_choice: "單選題",
      multiple_choice: "多選題",
    };

    const showModal = ref(false);
    const modalMessage = ref("");
    const errors = ref({});
    const showErrorModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    }

    const getQuestion = async (id) => {
      try {
        questionForm.value = {
          id: "",
          chapter_id: "",
          question: "",
          type: "true_false",
          note: "",
          options: [],
        };
        const response = await apiService.getQuestion(id);
        questionForm.value = response;
        questionType.value = response.type;
      } catch (error) {
        showErrorModal("獲取題目失敗");
      }
    };

    // 監聽題型變化
    watch(
      () => questionType.value,
      (newType) => {
        if (newType === "true_false") {
          questionForm.value.options = [
            { option_text: "是", option_index: 0, is_correct: true },
            { option_text: "否", option_index: 1, is_correct: false },
          ];
        } else if (newType !== questionForm.value.type) {
          questionForm.value.options = [];
        }
        questionForm.value.type = newType;
      }
    );

    // 設置答案
    const setAnswer = (index) => {
      if (
        questionForm.value.type === "true_false" ||
        questionForm.value.type === "single_choice"
      ) {
        questionForm.value.options.forEach((option, idx) => {
          option.is_correct = idx === index;
        });
      } else {
        questionForm.value.options[index].is_correct =
          !questionForm.value.options[index].is_correct;
      }
    };

    // 新增選項
    const addOption = () => {
      questionForm.value.options.push({
        option_text: "",
        option_index: questionForm.value.options.length,
        is_correct: false,
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
    const saveQuestion = async () => {
      try {

        if(props.isEdit){
          await apiService.updateQuestion(
            questionID.value,
            questionForm.value
          );
        }else{
          await apiService.addQuestion(questionForm.value);
        }


        emit("save", questionForm.value);
        closeModal();
      } catch (error) {
        if (error.response?.data?.status === 'error') {
          // 處理後端回傳的驗證錯誤
          if (error.response.data.content) {
            // 移除錯誤訊息中的括號和引號
            const cleanedErrors = {};
            for (const [key, value] of Object.entries(error.response.data.content)) {
              cleanedErrors[key] = Array.isArray(value) ? value[0].replace(/[\[\]"]/g, '') : value;
            }
            errors.value = cleanedErrors;

            // 組合所有錯誤訊息
            const errorMessages = Object.values(cleanedErrors).join('<br/>');
            

            showErrorModal("橫幅更新失敗：" + (errorMessages|| "未知錯誤"));

          } else {
            // 如果有錯誤訊息但沒有詳細內容
            showErrorModal("橫幅更新失敗：" + (error.response.data.message || "儲存失敗"));
          }
        } else {
          // 如果不是預期的錯誤格式，顯示一般錯誤訊息
          showErrorModal("儲存失敗");
        }
      }
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
      setAnswer,
      showModal,
      modalMessage,
      showErrorModal,
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
              <select class="form-select" v-model="questionForm.chapter_id" required>
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
                      :type="
                        questionForm.type === 'multiple_choice'
                          ? 'checkbox'
                          : 'radio'
                      "
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
                    v-if="
                      questionForm.type !== 'true_false' &&
                      questionForm.options.length > 1
                    "
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
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeModal"
              >
                取消
              </button>
              <button type="submit" class="btn btn-primary">保存</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Error Modal -->
  <div
    class="modal fade"
    :class="{ show: showModal }"
    tabindex="-1"
    :style="{ display: showModal ? 'block' : 'none' }"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">錯誤提示</h5>
          <button
            type="button"
            class="btn-close"
            @click="showModal = false"
          ></button>
        </div>
        <div class="modal-body" v-html="modalMessage"></div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showModal = false"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showModal"></div>
</template>

<style scoped>
.option-item {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
}
</style>