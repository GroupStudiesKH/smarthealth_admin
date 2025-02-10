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
    const permissionList = ref([]);
    const userData = ref({
      name: '',
      email: '',
      permission_group_id: '',
      new_password: ''
    });
    const showPassword = ref(false);
    const showModal = ref(false);
    const modalMessage = ref('');
    const modalTitle = ref('');
    const errors = ref({});

    const adminEdit = () => {
      if (!validateForm()) {
        return;
      }
      // 模擬 API 響應
      const mockResponse = {
        ...userData.value,
        id: 1
      };
      
      try {
        // 模擬成功響應
        sessionStorage.setItem('userData', JSON.stringify(mockResponse));
        showModalMessage('成功', '使用者資料已成功更新');
      } catch (error) {
        console.error('Error updating user data:', error);
        showModalMessage('錯誤', '更新使用者資料失敗，請檢查輸入並再試一次');
      }
    }

    const validateForm = () => {
      errors.value = {};
      if (!userData.value.name.trim()) {
        errors.value.name = ['請填寫姓名'];
      }
      if (!userData.value.permission_group_id) {
        errors.value.permission_group_id = ['請選擇權限群組'];
      }
      if (userData.value.new_password && userData.value.new_password.length < 6) {
        errors.value.password = ['密碼長度至少需要6個字元'];
      }
      return Object.keys(errors.value).length === 0;
    }

    const showModalMessage = (title, message) => {
      modalTitle.value = title;
      modalMessage.value = message;
      showModal.value = true;
    }

    const closeModal = () => {
      showModal.value = false;
    }

    const fetchPermissionList = async () => {
      try {
        // 模擬權限列表數據
        const mockPermissions = [
          { id: 1, name: '系統管理員' },
          { id: 2, name: '一般管理員' },
          { id: 3, name: '客服人員' }
        ];
        permissionList.value = mockPermissions;
      } catch (error) {
        console.error('Error fetching permission list:', error);
        showModalMessage('錯誤', '獲取權限列表失敗，請再試一次');
      }
    };

    onMounted(() => {
      fetchPermissionList();

      const userDataString = sessionStorage.getItem('userData');
      if (userDataString) {
        userData.value = { ...JSON.parse(userDataString), password: '', password_confirmation: '' };
      } else {
        console.error('User data not found in sessionStorage');
        // Optionally, redirect to login page if user data is not available
        // router.push('/login');
      }
    });

    return {
        userData,
        adminEdit,
        permissionList,
        showModal,
        modalMessage,
        modalTitle,
        closeModal,
        errors
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
        <div class="row mb-4">
          <div class="col-12 col-lg-8 mx-auto stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯使用者資料</h6>
                <form @submit.prevent="adminEdit">
                  <div class="mb-3">
                    <label for="name" class="form-label">姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="userData.name"
                      :class="{ 'is-invalid': errors.name }"
                      required
                    >
                    <div v-if="errors.name" class="invalid-feedback">
                      {{ errors.name[0] }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="email" class="form-label">電子郵件</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="userData.email"
                      disabled
                    >
                  </div>
                  <div class="mb-3">
                    <label for="permission_group_id" class="form-label">權限群組</label>
                    <select
                      class="form-select"
                      id="permission_group_id"
                      v-model="userData.permission_group_id"
                      :class="{ 'is-invalid': errors.permission_group_id }"
                      required
                    >
                      <option value="">請選擇權限群組</option>
                      <option v-for="group in permissionList" :key="group.id" :value="group.id">
                        {{ group.name }}
                      </option>
                    </select>
                    <div v-if="errors.permission_group_id" class="invalid-feedback">
                      {{ errors.permission_group_id[0] }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="new_password" class="form-label">更改密碼</label>
                    <div class="input-group">
                      <input
                        :type="showPassword ? 'text' : 'password'"
                        class="form-control"
                        id="new_password"
                        v-model="userData.new_password"
                        :class="{ 'is-invalid': errors.password }"
                      >
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="showPassword = !showPassword"
                      >
                        <i :class="showPassword ? 'material-icons' : 'material-icons'">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
                      </button>
                      <div v-if="errors.password" class="invalid-feedback">
                        {{ errors.password[0] }}
                      </div>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">更新資料</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" :class="{ 'show': showModal }" tabindex="-1" style="display: block;" v-if="showModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ modalTitle }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <p>{{ modalMessage }}</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" v-if="showModal"></div>

        <!-- row -->
      </div>
      <Footer />
    </div>
  </div>
</template>
