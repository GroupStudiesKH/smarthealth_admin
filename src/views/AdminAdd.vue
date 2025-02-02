<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
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
      password: '',
      password_confirmation: ''
    });
    const showModal = ref(false);
    const modalMessage = ref('');
    const modalTitle = ref('');
    const errors = ref({});

    const registerAdmin = () => {
      if (!validateForm()) {
        return;
      }
      apiService.registerAdmin(userData.value)
      .then(response => {
        showModalMessage('成功', '管理員已成功新增');
        router.push('/admins'); // 新增成功後導向管理員列表
      })
      .catch(error => {
        console.error('Error registering admin:', error);
        if (error.response && error.response.data) {
          errors.value = error.response.data.content || {};
        }
        showModalMessage('錯誤', '新增管理員失敗，請檢查輸入並再試一次');
      });
    }

    const validateForm = () => {
      errors.value = {};
      if (!userData.value.name.trim()) {
        errors.value.name = ['請填寫姓名'];
      }
      if (!userData.value.email.trim()) {
        errors.value.email = ['請填寫電子郵件'];
      }
      if (!userData.value.permission_group_id) {
        errors.value.permission_group_id = ['請選擇權限群組'];
      }
      if (!userData.value.password) {
        errors.value.password = ['請輸入密碼'];
      }
      if (userData.value.password !== userData.value.password_confirmation) {
        errors.value.password = ['兩次輸入的密碼不一致'];
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
        const response = await apiService.getPermissions();
        permissionList.value = response.data;
      } catch (error) {
        console.error('Error fetching permission list:', error);
        showModalMessage('錯誤', '獲取權限列表失敗，請再試一次');
      }
    };

    onMounted(() => {
      fetchPermissionList();
    });

    return {
        userData,
        registerAdmin,
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
                <h6 class="card-title">新增管理員</h6>
                <form @submit.prevent="registerAdmin">
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
                      :class="{ 'is-invalid': errors.email }"
                      required
                    >
                    <div v-if="errors.email" class="invalid-feedback">
                      {{ errors.email[0] }}
                    </div>
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
                    <label for="password" class="form-label">密碼</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      v-model="userData.password"
                      :class="{ 'is-invalid': errors.password }"
                      required
                    >
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password[0] }}
                    </div>
                  </div>
                  <div class="mb-3">
                    <label for="password_confirmation" class="form-label">確認密碼</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password_confirmation"
                      v-model="userData.password_confirmation"
                      :class="{ 'is-invalid': errors.password }"
                      required
                    >
                    <div v-if="errors.password" class="invalid-feedback">
                      {{ errors.password[0] }}
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">新增管理員</button>
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
