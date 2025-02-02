<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const postId = route.params.id;

    const postData = ref({
      id: "",
      category_id: "",
      status: "active",
      sort: 0,
      details: [],
      href: "",
      feature_img: "",
      target: "",
    });

    const categories = ref([]);
    const errors = ref({});
    const isLoading = ref(false);
    const showModal = ref(false);
    const modalMessage = ref("");
    const editors = ref({});

    const languages = ["en", "jp"];
    const activeTab = ref("en");

    const fetchPostData = async () => {
      try {
        const response = await apiService.getPost(postId);
        postData.value = response;
      } catch (error) {
        console.error("Error fetching post data:", error);
        showErrorModal("獲取文章數據失敗，請稍後再試。");
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        categories.value = response;
      } catch (error) {
        console.error("Error fetching categories:", error);
        showErrorModal("獲取分類數據失敗，請稍後再試。");
      }
    };

    const updatePost = async () => {
      isLoading.value = true;
      try {
        errors.value = {};
        const response = await apiService.updatePost(postId, postData.value);
        console.log(response)
        if (response) {
            router.push("/layout/cms");
        }
      } catch (error) {
        console.error("Error updating post:", error);
        if (error.response && error.response.data) {
          const errorData = error.response.data;
          if (errorData.status === "error") {
            if (errorData.message.includes("標題和內容都不能為空")) {
              showErrorModal(errorData.message);
            } else if (errorData.message === "驗證錯誤" && errorData.content) {
              errors.value = errorData.content;
              
              // Map backend errors to form fields
              if (errors.value.category_id) {
                errors.value.category_id = errors.value.category_id[0];
              }
              if (errors.value.status) {
                errors.value.status = errors.value.status[0];
              }
              if (errors.value.sort) {
                errors.value.sort = errors.value.sort[0];
              }
              if (errors.value.href) {
                errors.value.href = errors.value.href[0];
              }
              if (errors.value.feature_img) {
                errors.value.feature_img = errors.value.feature_img[0];
              }
              if (errors.value.target) {
                errors.value.target = errors.value.target[0];
              }
              
              languages.forEach((lang) => {
                const titleError = errors.value[`details.${lang}.title`];
                const contentError = errors.value[`details.${lang}.content`];
                if (titleError) {
                  errors.value[`${lang}_title`] = titleError[0];
                }
                if (contentError) {
                  errors.value[`${lang}_content`] = contentError[0];
                }
              });
              
              showErrorModal("請檢查表單錯誤並重試。");
            }
          }
        } else {
          showErrorModal("文章更新失敗：" + (error.message || "未知錯誤"));
        }
      } finally {
        isLoading.value = false;
      }
    };

    const showErrorModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const showSuccessModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const goBack = () => {
      router.push("/layout/cms");
    };

    const initEditors = () => {
      languages.forEach(lang => {
        ClassicEditor.create(document.querySelector(`#editor-${lang}`), {
          minHeight: '500px',
          image: {
            upload: {
              types: ['jpg', 'jpeg', 'png', 'gif', 'webp']
            }
          }
        })
          .then((newEditor) => {
            editors.value[lang] = newEditor;
            newEditor.setData(getDetail(lang, 'content'));
            newEditor.model.document.on('change:data', () => {
              setDetail(lang, 'content', newEditor.getData());
            });
            
            newEditor.editing.view.change(writer => {
              writer.setStyle('min-height', '500px', newEditor.editing.view.document.getRoot());
            });

            newEditor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
              return new MyUploadAdapter(loader, `${apiService.apiUrl}admin/upload-image`);
            };
          })
          .catch((error) => {
            console.error(`Error initializing editor for ${lang}:`, error);
          });
      });
    };

    class MyUploadAdapter {
      constructor(loader, url) {
        this.loader = loader;
        this.url = url;
      }

      upload() {
        return this.loader.file.then(file => new Promise((resolve, reject) => {
          const data = new FormData();
          data.append('upload', file);

          fetch(this.url, {
            method: 'POST',
            body: data,
            headers: {
              'Authorization': `Bearer ${apiService.getServerToken()}`
            }
          })
            .then(response => response.json())
            .then(result => {
              resolve({
                default: result.url
              });
            })
            .catch(error => {
              reject(error);
            });
        }));
      }

      abort() {
        // Abort the upload if necessary
      }
    }

    const getDetail = (lang, key) => {
      return (
        postData.value.details.find(
          (d) => d.language === lang && d.meta_key === key
        )?.meta_value || ""
      );
    };

    const setDetail = (lang, key, value) => {
      const index = postData.value.details.findIndex(
        (d) => d.language === lang && d.meta_key === key
      );
      if (index !== -1) {
        postData.value.details[index].meta_value = value;
      } else {
        postData.value.details.push({
          language: lang,
          meta_key: key,
          meta_value: value,
        });
      }
    };

    const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const response = await apiService.uploadImage(file);
          postData.value.feature_img = response.url;
        } catch (error) {
          console.error('Error uploading image:', error);
          showErrorModal('圖片上傳失敗，請稍後再試。');
        }
      }
    };

    const clearFeatureImage = () => {
      postData.value.feature_img = '';
    };

    onMounted(async () => {
      await fetchPostData();
      fetchCategories();
      initEditors();
    });

    return {
      postData,
      categories,
      updatePost,
      goBack,
      errors,
      isLoading,
      showModal,
      modalMessage,
      closeModal,
      languages,
      activeTab,
      getDetail,
      setDetail,
      editors,
      handleFileUpload,
      clearFeatureImage,
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
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <h4 class="card-title mb-4">編輯文章</h4>
                <form @submit.prevent="updatePost" class="w-100 row">
                  <div class="mb-3 col-6">
                    <label for="category" class="form-label">分類</label>
                    <div
                      class="radio-group"
                      :class="{ 'is-invalid': errors.category_id }"
                    >
                      <div
                        v-for="category in categories"
                        :key="category.id"
                        class="category-item"
                      >
                        <div class="form-check">
                          <input
                            type="radio"
                            :id="`category-${category.id}`"
                            :value="category.id"
                            v-model="postData.category_id"
                            class="form-check-input"
                          />
                          <label
                            :for="`category-${category.id}`"
                            class="form-check-label"
                          >
                            {{ category.name }}
                          </label>
                          <div
                            v-if="category.children && category.children.length"
                            class="subcategories ml-4"
                          >
                            <div
                              v-for="subCategory in category.children"
                              :key="subCategory.id"
                              class="form-check ml-3"
                            >
                              <input
                                type="radio"
                                :id="`category-${subCategory.id}`"
                                :value="subCategory.id"
                                v-model="postData.category_id"
                                class="form-check-input"
                              />
                              <label
                                :for="`category-${subCategory.id}`"
                                class="form-check-label"
                              >
                                {{ subCategory.name }}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="invalid-feedback" v-if="errors.category_id">
                      {{ errors.category_id }}
                    </div>
                  </div>

                  <div class="mb-3 col-6">
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="postData.status"
                      :class="{ 'is-invalid': errors.status }"
                    >
                      <option value="active">啟用</option>
                      <option value="inactive">未啟用</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.status">
                      {{ errors.status }}
                    </div>

                    <label for="sort" class="form-label mt-3">排序</label>
                    <input
                      type="number"
                      class="form-control"
                      id="sort"
                      v-model="postData.sort"
                      :class="{ 'is-invalid': errors.sort }"
                    />
                    <div class="invalid-feedback" v-if="errors.sort">
                      {{ errors.sort }}
                    </div>
                  </div>

                  <div class="mb-3 col-6">
                    <label for="href" class="form-label">文章連結網址</label>
                    <input
                      type="text"
                      class="form-control"
                      id="href"
                      v-model="postData.href"
                      :class="{ 'is-invalid': errors.href }"
                    />
                    <div class="invalid-feedback" v-if="errors.href">
                      {{ errors.href }}
                    </div>
                  </div>

                  <div class="mb-3 col-6">
                    <label for="target" class="form-label">開啟方式</label>
                    <select
                      class="form-select"
                      id="target"
                      v-model="postData.target"
                      :class="{ 'is-invalid': errors.target }"
                    >
                      <option value="">請選擇</option>
                      <option value="_self">當前窗口</option>
                      <option value="_blank">新窗口</option>
                    </select>
                    <div class="invalid-feedback" v-if="errors.target">
                      {{ errors.target }}
                    </div>
                  </div>

                  <div class="mb-3 col-12">
                    <label for="feature_img" class="form-label">特色圖片</label>
                    <input
                      type="file"
                      class="form-control"
                      id="feature_img"
                      @change="handleFileUpload"
                      :class="{ 'is-invalid': errors.feature_img }"
                    />
                    <div class="invalid-feedback" v-if="errors.feature_img">
                      {{ errors.feature_img }}
                    </div>
                    <div v-if="postData.feature_img" class="mt-2">
                      <img :src="postData.feature_img" alt="Feature Image" style="width: 150px; display: block; margin-bottom: 10px;" />
                      <button type="button" class="btn btn-sm btn-danger ml-2" @click="clearFeatureImage">清除圖片</button>
                    </div>
                  </div>

                  <ul class="nav nav-tabs col-12" id="langTabs" role="tablist">
                    <li class="nav-item" v-for="lang in languages" :key="lang">
                      <a
                        class="nav-link"
                        :class="{ active: activeTab === lang }"
                        :id="`${lang}-tab`"
                        data-bs-toggle="tab"
                        :href="`#${lang}`"
                        role="tab"
                        @click="activeTab = lang"
                      >
                        {{ lang.toUpperCase() }}
                      </a>
                    </li>
                  </ul>

                  <div class="tab-content mt-3" id="langTabContent">
                    <div
                      v-for="lang in languages"
                      :key="lang"
                      class="tab-pane fade"
                      :class="{ 'show active': activeTab === lang }"
                      :id="lang"
                      role="tabpanel"
                    >
                      <div class="mb-3">
                        <label :for="`title-${lang}`" class="form-label"
                          >標題 ({{ lang }})</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          :id="`title-${lang}`"
                          :value="getDetail(lang, 'title')"
                          @input="setDetail(lang, 'title', $event.target.value)"
                          :class="{ 'is-invalid': errors[`${lang}_title`] }"
                        />
                        <div
                          class="invalid-feedback"
                          v-if="errors[`${lang}_title`]"
                        >
                          {{ errors[`${lang}_title`] }}
                        </div>
                      </div>

                      <div class="mb-3">
                        <label :for="`content-${lang}`" class="form-label"
                          >內容 ({{ lang }})</label
                        >
                        <div :id="`editor-${lang}`" class="ckeditor-editor" :class="{ 'is-invalid': errors[`${lang}_content`] }"></div>
                        <div
                          class="invalid-feedback"
                          v-if="errors[`${lang}_content`]"
                        >
                          {{ errors[`${lang}_content`] }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="mt-4">
                    <button
                      type="submit"
                      class="btn btn-primary me-2"
                      :disabled="isLoading"
                    >
                      {{ isLoading ? "更新中..." : "更新文章" }}
                    </button>
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="goBack"
                      :disabled="isLoading"
                    >
                      返回
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>

  <!-- Modal -->
  <div class="modal-backdrop" v-if="showModal" @click="closeModal"></div>
  <div class="modal" tabindex="-1" :class="{ 'd-block': showModal }">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">提示</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            關閉
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
}

.modal {
  z-index: 1050;
}

.ckeditor-editor.is-invalid {
  border: 1px solid #dc3545;
  border-radius: 0.25rem;
}
</style>
