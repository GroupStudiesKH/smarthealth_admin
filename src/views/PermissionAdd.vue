<script>
import { onMounted, ref } from "vue";
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

    const permissionData = ref({
      name: "",
      permissions: {},
    });

    const errors = ref({});
    const isLoading = ref(false);

    const permissionStructure = ref({});

    const fetchPermissionOptions = async () => {
      try {
        const response = await apiService.getPermissionOptions();
        permissionStructure.value = response;
        permissionData.value.permissions = Object.keys(response).reduce((acc, key) => {
          acc[key] = [];
          return acc;
        }, {});
      } catch (error) {
        console.error("Error fetching permission options:", error);
      }
    };

    const addPermission = async () => {
      isLoading.value = true;
      try {
        errors.value = {};
        const response = await apiService.addPermission(permissionData.value);
        if (response) {
          console.log("Permission added successfully");
          router.push('/permission');
        } else {
          console.error("Failed to add permission");
          alert("權限新增失敗，請稍後再試。");
        }
      } catch (error) {
        console.error("Error adding permission:", error);
        if (error.response && error.response.data) {
          errors.value = error.response.data.content || {};
        }
        alert("權限新增失敗：" + (error.message || "未知錯誤"));
      } finally {
        isLoading.value = false;
      }
    };

    const goBack = () => {
      router.push("/permission");
    };

    onMounted(async () => {
      await fetchPermissionOptions();
    });

    return {
      permissionData,
      permissionStructure,
      addPermission,
      goBack,
      errors,
      isLoading,
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
          <div class="col-12 stretch-card">
            <h4 class="mb-3">
              <input v-model="permissionData.name" class="form-control" type="text" placeholder="權限名稱">
            </h4>
          </div>

          <div class="col-12 stretch-card">
            <form @submit.prevent="addPermission">
              <div class="row">
                <div
                  class="col-md-3 mb-3"
                  v-for="(category, categoryKey) in permissionStructure"
                  :key="categoryKey"
                >
                  <div class="card h-100">
                    <div class="card-body">
                      <div class="mb-4">
                        <h5 class="mb-3">{{ category.title }}</h5>
                        <div
                          v-for="(item, itemKey) in category.list"
                          :key="itemKey"
                          class="mb-3"
                        >
                          <p>{{ item.title }}</p>
                          <div class="d-flex flex-wrap">
                            <div
                              v-for="permission in item.permissions"
                              :key="permission"
                              class="form-check permissionItem me-3"
                            >
                              <input
                                class="form-check-input"
                                type="checkbox"
                                :id="`${categoryKey}-${itemKey}-${permission}`"
                                :value="permission"
                                v-model="permissionData.permissions[itemKey]"
                              />
                              <label
                                class="form-check-label"
                                :for="`${categoryKey}-${itemKey}-${permission}`"
                              >
                                {{
                                  permission === "list"
                                    ? "列表"
                                    : permission === "create"
                                    ? "新增"
                                    : permission === "edit"
                                    ? "編輯"
                                    : permission === "del"
                                    ? "刪除"
                                    : permission
                                }}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" class="btn btn-primary me-2" :disabled="isLoading">
                {{ isLoading ? '新增中...' : '新增權限' }}
              </button>
              <button type="button" class="btn btn-secondary" @click="goBack" :disabled="isLoading">
                返回
              </button>
            </form>
          </div>
        </div>
        <!-- row -->
      </div>
      <Footer />
    </div>
  </div>
</template>
