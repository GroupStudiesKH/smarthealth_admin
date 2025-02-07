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
        // 模擬權限結構數據
        const mockPermissionStructure = {
          courseManagement: {
            title: "課程管理",
            list: {
              "course-management": {
                title: "課程管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "course-list": {
                title: "課程列表",
                permissions: ["list", "create", "edit", "del"]
              },
              "course-category": {
                title: "分類管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "course-tag": {
                title: "標籤管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "course-instructor": {
                title: "講師管理",
                permissions: ["list", "create", "edit", "del"]
              }
            }
          },
          memberManagement: {
            title: "會員管理",
            list: {
              "member-management": {
                title: "會員管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "member-list": {
                title: "會員列表",
                permissions: ["list", "create", "edit", "del"]
              }
            }
          },
          statisticsManagement: {
            title: "課程統計",
            list: {
              "course-statistics": {
                title: "課程統計",
                permissions: ["list"]
              },
              "course-progress": {
                title: "學習進度統計",
                permissions: ["list"]
              }
            }
          },
          examManagement: {
            title: "測驗管理",
            list: {
              "exam-management": {
                title: "測驗管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "exam-statistics": {
                title: "課程測驗列表",
                permissions: ["list"]
              }
            }
          },
          siteSettings: {
            title: "網站基本設定",
            list: {
              "site-settings": {
                title: "網站基本設定",
                permissions: ["list", "edit"]
              },
              "site-brand": {
                title: "品牌設定",
                permissions: ["list", "edit"]
              },
              "site-social": {
                title: "社群設定",
                permissions: ["list", "edit"]
              }
            }
          },
          layoutManagement: {
            title: "介紹頁面管理",
            list: {
              "layout-banner-management": {
                title: "首頁Banner管理",
                permissions: ["list", "create", "edit", "del"]
              },
              "content-faq": {
                title: "FAQ",
                permissions: ["edit"]
              },
              "content-about": {
                title: "計劃緣起",
                permissions: ["edit"]
              },
              "content-privacy": {
                title: "隱私權政策",
                permissions: ["edit"]
              },
              "content-security": {
                title: "資安政策",
                permissions: ["edit"]
              }
            }
          },
          permissionManagement: {
            title: "權限管理",
            list: {
              "permissions_group": {
                title: "角色管理",
                permissions: ["list", "create", "edit", "del"]
              }
            }
          }
        };

        permissionStructure.value = mockPermissionStructure;
      } catch (error) {
        console.error("Error fetching permission options:", error);
      }
    };

    const fetchPermissionData = async () => {
      try {
        // 模擬 API 響應數據
        const mockData = {
          id: permissionId,
          name: "測試權限組",
          permissions: {
            "course-management": ["list", "create"],
            "course-list": ["list"],
            "member-management": ["list", "edit"],
            "member-list": ["list"],
            "course-statistics": ["list"],
            "layout-banner-management": ["list", "edit"],
            "content-faq": ["edit"],
            "permissions_group": ["list"]
          }
        };

        permissionData.value = {
          id: mockData.id,
          name: mockData.name,
          permissions: {
            ...permissionData.value.permissions,
            ...mockData.permissions
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
      } catch (error) {
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
</template>
