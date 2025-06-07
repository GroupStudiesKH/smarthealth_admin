<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isEdit = route.params.id !== undefined;
    const memberId = route.params.id;
    const loading = ref(false);

    // 國籍選項 - 世界各國家地區（中英文對照）
    const nationalityOptions = [
      // 亞洲
      { value: '台灣', label: '台灣 (Taiwan)' },
      { value: '中國', label: '中國 (China)' },
      { value: '日本', label: '日本 (Japan)' },
      { value: '韓國', label: '韓國 (South Korea)' },
      { value: '新加坡', label: '新加坡 (Singapore)' },
      { value: '馬來西亞', label: '馬來西亞 (Malaysia)' },
      { value: '泰國', label: '泰國 (Thailand)' },
      { value: '越南', label: '越南 (Vietnam)' },
      { value: '菲律賓', label: '菲律賓 (Philippines)' },
      { value: '印尼', label: '印尼 (Indonesia)' },
      { value: '印度', label: '印度 (India)' },
      { value: '巴基斯坦', label: '巴基斯坦 (Pakistan)' },
      { value: '孟加拉', label: '孟加拉 (Bangladesh)' },
      { value: '斯里蘭卡', label: '斯里蘭卡 (Sri Lanka)' },
      { value: '緬甸', label: '緬甸 (Myanmar)' },
      { value: '柬埔寨', label: '柬埔寨 (Cambodia)' },
      { value: '寮國', label: '寮國 (Laos)' },
      { value: '蒙古', label: '蒙古 (Mongolia)' },
      { value: '哈薩克', label: '哈薩克 (Kazakhstan)' },
      { value: '烏茲別克', label: '烏茲別克 (Uzbekistan)' },
      // 歐洲
      { value: '英國', label: '英國 (United Kingdom)' },
      { value: '法國', label: '法國 (France)' },
      { value: '德國', label: '德國 (Germany)' },
      { value: '義大利', label: '義大利 (Italy)' },
      { value: '西班牙', label: '西班牙 (Spain)' },
      { value: '葡萄牙', label: '葡萄牙 (Portugal)' },
      { value: '荷蘭', label: '荷蘭 (Netherlands)' },
      { value: '比利時', label: '比利時 (Belgium)' },
      { value: '瑞士', label: '瑞士 (Switzerland)' },
      { value: '奧地利', label: '奧地利 (Austria)' },
      { value: '瑞典', label: '瑞典 (Sweden)' },
      { value: '挪威', label: '挪威 (Norway)' },
      { value: '丹麥', label: '丹麥 (Denmark)' },
      { value: '芬蘭', label: '芬蘭 (Finland)' },
      { value: '冰島', label: '冰島 (Iceland)' },
      { value: '愛爾蘭', label: '愛爾蘭 (Ireland)' },
      { value: '波蘭', label: '波蘭 (Poland)' },
      { value: '捷克', label: '捷克 (Czech Republic)' },
      { value: '匈牙利', label: '匈牙利 (Hungary)' },
      { value: '斯洛伐克', label: '斯洛伐克 (Slovakia)' },
      { value: '斯洛維尼亞', label: '斯洛維尼亞 (Slovenia)' },
      { value: '克羅埃西亞', label: '克羅埃西亞 (Croatia)' },
      { value: '塞爾維亞', label: '塞爾維亞 (Serbia)' },
      { value: '保加利亞', label: '保加利亞 (Bulgaria)' },
      { value: '羅馬尼亞', label: '羅馬尼亞 (Romania)' },
      { value: '希臘', label: '希臘 (Greece)' },
      { value: '俄羅斯', label: '俄羅斯 (Russia)' },
      { value: '烏克蘭', label: '烏克蘭 (Ukraine)' },
      { value: '白俄羅斯', label: '白俄羅斯 (Belarus)' },
      { value: '立陶宛', label: '立陶宛 (Lithuania)' },
      { value: '拉脫維亞', label: '拉脫維亞 (Latvia)' },
      { value: '愛沙尼亞', label: '愛沙尼亞 (Estonia)' },
      // 北美洲
      { value: '美國', label: '美國 (United States)' },
      { value: '加拿大', label: '加拿大 (Canada)' },
      { value: '墨西哥', label: '墨西哥 (Mexico)' },
      // 南美洲
      { value: '巴西', label: '巴西 (Brazil)' },
      { value: '阿根廷', label: '阿根廷 (Argentina)' },
      { value: '智利', label: '智利 (Chile)' },
      { value: '秘魯', label: '秘魯 (Peru)' },
      { value: '哥倫比亞', label: '哥倫比亞 (Colombia)' },
      { value: '委內瑞拉', label: '委內瑞拉 (Venezuela)' },
      { value: '厄瓜多', label: '厄瓜多 (Ecuador)' },
      { value: '烏拉圭', label: '烏拉圭 (Uruguay)' },
      { value: '巴拉圭', label: '巴拉圭 (Paraguay)' },
      { value: '玻利維亞', label: '玻利維亞 (Bolivia)' },
      // 非洲
      { value: '南非', label: '南非 (South Africa)' },
      { value: '埃及', label: '埃及 (Egypt)' },
      { value: '奈及利亞', label: '奈及利亞 (Nigeria)' },
      { value: '肯亞', label: '肯亞 (Kenya)' },
      { value: '衣索比亞', label: '衣索比亞 (Ethiopia)' },
      { value: '摩洛哥', label: '摩洛哥 (Morocco)' },
      { value: '阿爾及利亞', label: '阿爾及利亞 (Algeria)' },
      { value: '突尼西亞', label: '突尼西亞 (Tunisia)' },
      { value: '利比亞', label: '利比亞 (Libya)' },
      { value: '加納', label: '加納 (Ghana)' },
      // 大洋洲
      { value: '澳洲', label: '澳洲 (Australia)' },
      { value: '紐西蘭', label: '紐西蘭 (New Zealand)' },
      { value: '斐濟', label: '斐濟 (Fiji)' },
      { value: '巴布亞紐幾內亞', label: '巴布亞紐幾內亞 (Papua New Guinea)' },
      // 中東
      { value: '以色列', label: '以色列 (Israel)' },
      { value: '土耳其', label: '土耳其 (Turkey)' },
      { value: '伊朗', label: '伊朗 (Iran)' },
      { value: '伊拉克', label: '伊拉克 (Iraq)' },
      { value: '沙烏地阿拉伯', label: '沙烏地阿拉伯 (Saudi Arabia)' },
      { value: '阿拉伯聯合大公國', label: '阿拉伯聯合大公國 (UAE)' },
      { value: '科威特', label: '科威特 (Kuwait)' },
      { value: '卡達', label: '卡達 (Qatar)' },
      { value: '巴林', label: '巴林 (Bahrain)' },
      { value: '阿曼', label: '阿曼 (Oman)' },
      { value: '約旦', label: '約旦 (Jordan)' },
      { value: '黎巴嫩', label: '黎巴嫩 (Lebanon)' },
      { value: '敘利亞', label: '敘利亞 (Syria)' },
      { value: '葉門', label: '葉門 (Yemen)' }
    ];

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
      nationality: "",
      national_id: "",
      address: "",
      mobile: "",
      gender: "",
      birthdate: "",
      provider: "",
    });

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref("");

    const fetchMemberData = async () => {
      if (!isEdit) return;
      
      try {

        loading.value = true
        const mockData = await apiService.getMember(memberId);
        loading.value = false;
        Object.assign(formData, mockData);
      } catch (error) {
        console.error("Failed to fetch member data:", error);
        modalMessage.value = "獲取會員資料失敗";
        showModal.value = true;
        loading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        errors.value = {};
        loading.value = true;
        if (!isEdit){
          await apiService.addMember(formData);
        }else{
          await apiService.editMember(memberId, formData);
        }
        loading.value = false;
        
        router.push("/member");
      } catch (error) {
        console.error("Failed to save member:", error);
        loading.value = false;
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
          loading.value = false;
        }
      }
    };
    onMounted(() => {
      if(isEdit){
        fetchMemberData();
      }
    });

    return {
      formData,
      nationalityOptions,
      errors,
      isEdit,
      loading,
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
                      <label class="form-label">國籍 <span class="text-danger">*</span></label>
                      <select
                        class="form-select"
                        :class="{ 'is-invalid': errors.nationality }"
                        v-model="formData.nationality"
                      >
                        <option value="">請選擇國籍</option>
                        <option v-for="option in nationalityOptions" 
                                :key="option.value" 
                                :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                      <div class="invalid-feedback" v-if="errors.nationality">
                        {{ errors.nationality }}
                      </div>
                    </div>

                    <div class="col-md-6 col-12 mb-3">
                      <label class="form-label">身分證字號/護照號碼 <span class="text-danger">*</span></label>
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

                    <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">生日 <span class="text-danger">*</span></label>
                        <input
                          type="date"
                          class="form-control"
                          v-model="formData.birthdate"
                        />
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

                      <div class="col-md-6 col-12 mb-3">
                        <label class="form-label">第三方註冊</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="formData.provider"
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

  <Loading v-if="loading" />
</template>