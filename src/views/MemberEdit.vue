<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEdit = route.params.id !== undefined;
    const memberId = route.params.id;

    const formData = reactive({
      name: "",
      email: "",
      password: "",
      showPassword: false,
      status: 'active',
      created_at: "",
      last_login_at: "",
      registration_source: "",
      last_login_ip: "",
      role: "",
      roleOptions: [
        { value: "student", label: "學生" },
        { value: "teacher", label: "老師" },
        { value: "doctor", label: "醫師" },
        { value: "nurse", label: "護理人員" },
        { value: "vendor", label: "廠商" },
        { value: "other", label: "其他" }
      ],
      organization: "",
      national_id: "",
      address: "",
      mobile: "",
      gender: ""
    });

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref("");

    const fetchMemberData = async () => {
      if (!isEdit) return;
      
      try {
        // 模擬 API 響應數據
        const mockData = await apiService.getMember(memberId);

        Object.assign(formData, mockData);
      } catch (error) {
        console.error("Failed to fetch member data:", error);
        modalMessage.value = "獲取會員資料失敗";
        showModal.value = true;
      }
    };

    const handleSubmit = async () => {
      try {
        errors.value = {};
        if (!isEdit){
          await apiService.addMember(formData);
        }else{
          await apiService.editMember(memberId, formData);
        }
        
        router.push("/member");
      } catch (error) {
        console.error("Failed to save member:", error);
        
        // 處理後端回傳的驗證錯誤
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
            
            modalMessage.value = errorMessages;
            showModal.value = true;
          } else {
            // 如果有錯誤訊息但沒有詳細內容
            modalMessage.value = error.response.data.message || "儲存失敗";
            showModal.value = true;
          }
        } else {
          // 如果不是預期的錯誤格式，顯示一般錯誤訊息
          modalMessage.value = "儲存失敗";
          showModal.value = true;
        }
      }
    };
    onMounted(() => {
      fetchMemberData();
    });

    return {
      formData,
      errors,
      isEdit,
      showModal,
      modalMessage,
      handleSubmit
    };
  },
};
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
                <h6 class="card-title">{{ isEdit ? '編輯會員' : '新增會員' }}</h6>

                <form @submit.prevent="handleSubmit">
                  <div class="row">
                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">Email <span class="text-danger">*</span></label>
                      <input
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        v-model="formData.email"
                        :disabled="isEdit"
                      />
                      <div class="invalid-feedback" v-if="errors.email">
                        {{ errors.email }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">會員名稱 <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name }"
                        v-model="formData.name"
                      />
                      <div class="invalid-feedback" v-if="errors.name">
                        {{ errors.name }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">密碼 <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <input
                          :type="formData.showPassword ? 'text' : 'password'"
                          class="form-control"
                          :class="{ 'is-invalid': errors.password }"
                          v-model="formData.password"
                          :placeholder="isEdit ? '不修改請留空' : ''"
                        />
                        <button
                          class="btn btn-outline-secondary"
                          type="button"
                          @click="formData.showPassword = !formData.showPassword"
                        >
                          <i class="material-icons">{{ formData.showPassword ? 'visibility_off' : 'visibility' }}</i>
                        </button>
                        <div class="invalid-feedback" v-if="errors.password">
                          {{ errors.password }}
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">身份別 <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': errors.role }"
                        v-model="formData.role"
                      >
                        <option value="">請選擇身份別</option>
                        <option v-for="option in formData.roleOptions" 
                                :key="option.value" 
                                :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback" v-if="errors.role">
                        {{ errors.role }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">任職單位 <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.organization }"
                        v-model="formData.organization"
                      />
                      <div class="invalid-feedback" v-if="errors.organization">
                        {{ errors.organization }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">身分證字號 <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.national_id }"
                        v-model="formData.national_id"
                      />
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">地址 <span class="text-danger">*</span></label>
                      <input
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.address }"
                        v-model="formData.address"
                      />
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">手機 <span class="text-danger">*</span></label>
                      <input
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.mobile }"
                        v-model="formData.mobile"
                      />
                      <div class="invalid-feedback" v-if="errors.mobile">
                        {{ errors.mobile }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">性別 <span class="text-danger">*</span></label>
                      <div class="form-check">
                        <input
                          type="radio"
                          class="form-check-input"
                          id="male"
                          value="male"
                          v-model="formData.gender"
                        />
                        <label class="form-check-label" for="male">男性</label>
                      </div>
                      <div class="form-check">
                        <input
                          type="radio"
                          class="form-check-input"
                          id="female"
                          value="female"
                          v-model="formData.gender"
                        />
                        <label class="form-check-label" for="female">女性</label>
                      </div>
                      <div class="invalid-feedback" v-if="errors.gender">
                        {{ errors.gender }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">狀態</label>
                      <div class="form-check">
                        <div class="form-check">
                          <input
                            type="radio"
                            class="form-check-input"
                            id="active"
                            value="active"
                            v-model="formData.status"
                          />
                          <label class="form-check-label" for="active">啟用</label>
                        </div>
                        <div class="form-check">
                          <input
                            type="radio"
                            class="form-check-input"
                            id="inactive"
                            value="inactive"
                            v-model="formData.status"
                          />
                          <label class="form-check-label" for="inactive">停用</label>
                        </div>
                      </div>
                    </div>

                    <div v-if="isEdit">
                      <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">註冊日期</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.created_at"
                          disabled
                        />
                      </div>

                      <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">上次登入日期</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.last_login_at"
                          disabled
                        />
                      </div>

                      <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">註冊來源</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.registration_source"
                          disabled
                        />
                      </div>

                      <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">上次登入IP</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.last_login_ip"
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary me-2">儲存</button>
                  <router-link to="/member" class="btn btn-secondary">取消</router-link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>

    <!-- Error Modal -->
    <div class="modal fade" :class="{ show: showModal }" tabindex="-1" :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">錯誤提示</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body" v-html="modalMessage">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">關閉</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show" v-if="showModal"></div>

  </div>
</template>