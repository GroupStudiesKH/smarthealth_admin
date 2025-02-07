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
        permissionData.value.permissions = Object.keys(mockPermissionStructure).reduce((acc, key) => {
          Object.keys(mockPermissionStructure[key].list).forEach(itemKey => {
            acc[itemKey] = [];
          });
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
