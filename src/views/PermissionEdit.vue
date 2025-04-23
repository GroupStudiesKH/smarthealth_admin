<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/Loading.vue";

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
    const permissionId = route.params.id;

    const permissionData = ref({
      name: "",
      permissions: {},
    });

    const errors = ref({});
    const isLoading = ref(false);

    const permissionStructure = ref({});

    const fetchPermissionOptions = async () => {
      try {
        isLoading.value = true;
        const response = await apiService.getPermissionOptions();
        permissionStructure.value = response;
        permissionData.value = {
          id: "",
          name: "",
          permissions: Object.keys(response).reduce((acc, key) => {
            acc[key] = [];
            return acc;
          }, {})
        };
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
        console.error("Error fetching permission options:", error);
      }
    };

    const fetchPermissionData = async () => {
      try {
        isLoading.value = true;
        const response = await apiService.getPermission(permissionId);
        permissionData.value = {
          id: response.id,
          name: response.name,
          permissions: {
            ...permissionData.value.permissions,
            ...response.permissions
          }
        };
        // Ensure all permission keys exist and are arrays
        Object.keys(permissionStructure.value).forEach(categoryKey => {
          Object.keys(permissionStructure.value[categoryKey].list).forEach(itemKey => {
            if (!Array.isArray(permissionData.value.permissions[itemKey])) {
              permissionData.value.permissions[itemKey] = [];
            }
          });
        });
        console.log("Updated permissionData:", permissionData.value);
        isLoading.value = false;
      } catch (error) {
        isLoading.value = false;
        console.error("Error fetching permission data:", error);
      }
    };

    const updatePermission = async () => {
      isLoading.value = true;
      try {
        errors.value = {};
        const response = await apiService.updatePermission(
          permissionId,
          permissionData.value
        );
        if (response) {
          console.log("Permission updated successfully");
          await checkAdminStatus()
          router.push('/permission')
        } else {
          console.error("Failed to update permission");
          alert("權限更新失敗，請稍後再試。");
        }
      } catch (error) {
        console.error("Error updating permission:", error);
        if (error.response && error.response.data) {
          errors.value = error.response.data.content || {};
        }
        alert("權限更新失敗：" + (error.message || "未知錯誤"));
      } finally {
        isLoading.value = false;
      }
    };

    const goBack = () => {
      router.push("/permission");
    };

    //for update self permission
    const checkAdminStatus = async () => {
      try {
        const response = await apiService.adminMe();
        if (response) {
          // Store user data in sessionStorage
          sessionStorage.setItem('userData', JSON.stringify(response));
          // Update the reactive userData ref
          userData.value = response;
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        // If there's an error (e.g., unauthorized), redirect to login
        router.push("/login");
        // Remove access token from localStorage
        localStorage.removeItem("access_token");
      }
    };


    onMounted(async () => {
      await fetchPermissionOptions();
      await fetchPermissionData();
    });

    return {
      permissionData,
      permissionStructure,
      updatePermission,
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
              <input v-model="permissionData.name" class="form-control" type="text">
            </h4>
          </div>

          <div class="col-12 stretch-card">
            <form @submit.prevent="updatePermission">
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
                                :checked="permissionData.permissions[itemKey] && permissionData.permissions[itemKey].includes(permission)"
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
                {{ isLoading ? '更新中...' : '更新權限' }}
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
  <Loading v-if="isLoading" />
</template>
