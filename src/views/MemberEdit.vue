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
      status: true,
      registrationDate: "",
      lastLoginDate: "",
      registrationSource: "",
      lastLoginIp: "",
      identity: "",
      identityOptions: [
        { value: "student", label: "學生" },
        { value: "teacher", label: "老師" },
        { value: "doctor", label: "醫師" },
        { value: "nurse", label: "護理人員" },
        { value: "vendor", label: "廠商" },
        { value: "other", label: "其他" }
      ],
      otherIdentity: "",
      organization: "",
      idNumber: "",
      address: "",
      phone: "",
      gender: ""
    });

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref("");

    const fetchMemberData = async () => {
      if (!isEdit) return;
      
      try {
        // 模擬 API 響應數據
        const mockData = {
          name: "測試會員",
          email: "test@example.com",
          status: true,
          registrationDate: "2023-01-01",
          lastLoginDate: "2023-12-01",
          registrationSource: "網站註冊",
          lastLoginIp: "192.168.1.1",
          identity: "一般會員",
          phone: "0912345678",
          gender: "male"
        };

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
        
        // 基本驗證
        if (!formData.name) {
          errors.value.name = "請輸入會員名稱";
          return;
        }

        if (!formData.email) {
          errors.value.email = "請輸入Email";
          return;
        }

        if (!formData.identity) {
          errors.value.identity = "請選擇身份別";
          return;
        }

        if (formData.identity === "other" && !formData.otherIdentity) {
          errors.value.otherIdentity = "請填寫其他身份";
          return;
        }

        if (!formData.organization) {
          errors.value.organization = "請輸入任職單位";
          return;
        }

        if (!isEdit && !formData.password) {
          errors.value.password = "請輸入密碼";
          return;
        }

        if (formData.password && (formData.password.length < 8 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password))) {
          errors.value.password = "密碼需要至少八碼及英數混合";
          return;
        }

        if (!formData.phone) {
          errors.value.phone = "請輸入手機號碼";
          return;
        } else if (!/^[0-9]{10}$/.test(formData.phone)) {
          errors.value.phone = "請輸入有效的手機號碼";
          return;
        }

        if (!formData.gender) {
          errors.value.gender = "請選擇性別";
          return;
        }

        if (!isEdit && !formData.email) {
          errors.value.email = "請輸入Email";
          return;
        }



        // 模擬 API 請求
        await new Promise(resolve => setTimeout(resolve, 500));

        router.push("/member");
      } catch (error) {
        console.error("Failed to save member:", error);
        modalMessage.value = "儲存失敗";
        showModal.value = true;
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
                  <div class="mb-3">
                    <label class="form-label">Email</label>
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

                  <div class="mb-3">
                    <label class="form-label">會員名稱</label>
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

                  <div class="mb-3">
                    <label class="form-label">密碼</label>
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

                  <div class="mb-3">
                    <label class="form-label">身份別 <span class="text-danger">*</span></label>
                    <select
                      class="form-select"
                      :class="{ 'is-invalid': errors.identity }"
                      v-model="formData.identity"
                    >
                      <option value="">請選擇身份別</option>
                      <option v-for="option in formData.identityOptions" 
                              :key="option.value" 
                              :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.identity">
                      {{ errors.identity }}
                    </div>
                  </div>

                  <div class="mb-3" v-if="formData.identity === 'other'">
                    <label class="form-label">其他身份 <span class="text-danger">*</span></label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.otherIdentity }"
                      v-model="formData.otherIdentity"
                    />
                    <div class="invalid-feedback" v-if="errors.otherIdentity">
                      {{ errors.otherIdentity }}
                    </div>
                  </div>

                  <div class="mb-3">
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

                  <div class="mb-3">
                    <label class="form-label">身分證字號</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.idNumber }"
                      v-model="formData.idNumber"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">地址</label>
                    <input
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': errors.address }"
                      v-model="formData.address"
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">手機</label>
                    <input
                      type="tel"
                      class="form-control"
                      :class="{ 'is-invalid': errors.phone }"
                      v-model="formData.phone"
                    />
                    <div class="invalid-feedback" v-if="errors.phone">
                      {{ errors.phone }}
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">性別</label>
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

                  <div class="mb-3">
                    <label class="form-label">狀態</label>
                    <div class="form-check form-switch">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="formData.status"
                      />
                      <label class="form-check-label">
                        {{ formData.status ? '啟用' : '停用' }}
                      </label>
                    </div>
                  </div>

                  <div v-if="isEdit">
                    <div class="mb-3">
                      <label class="form-label">註冊日期</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.registrationDate"
                        disabled
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">上次登入日期</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.lastLoginDate"
                        disabled
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">註冊來源</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.registrationSource"
                        disabled
                      />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">上次登入IP</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="formData.lastLoginIp"
                        disabled
                      />
                    </div>
                  </div>

                  <button type="submit" class="btn btn-primary me-2">儲存</button>
                  <button type="button" class="btn btn-secondary" @click="router.push('/member')">取消</button>
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
          <div class="modal-body">
            {{ modalMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>