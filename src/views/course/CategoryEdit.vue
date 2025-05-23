<script>
import { ref, onMounted } from 'vue';
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
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
    const categoryName = ref("");
    const description = ref("");
    const featuredImage = ref(null);
    const imagePreview = ref("");
    const loading = ref(false);
    const error = ref(null);

    onMounted(async () => {
      try {
        const categoryId = route.params.id;
        loading.value = true;
        const response = await apiService.getTag(categoryId);
        loading.value = false;
        categoryName.value = response.name;
        description.value = response.description || "";
        if (response.featured_image) {
          imagePreview.value = response.featured_image;
          error.value = null;
        }
      } catch (err) {
        console.error('獲取分類失敗:', err);
        loading.value = false;
        error.value = '無法載入分類資料';
      } finally {
        loading.value = false;
      }
    });

    const handleSubmit = async () => {
      try {
        const categoryId = route.params.id;
        loading.value = true;
        const formData = new FormData();
        formData.append('name', categoryName.value);
        formData.append('description', description.value);
        if (featuredImage.value) {
          formData.append('featured_image', featuredImage.value);
        }
        await apiService.editTag(categoryId, formData);
        loading.value = false;
        router.push({name: 'category-list'});
      } catch (err) {
        console.error('更新失敗:', err);
        error.value = '儲存分類時發生錯誤';
      }
    };

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        featuredImage.value = file;
        imagePreview.value = URL.createObjectURL(file);
      }
    };

    return {
      categoryName,
      description,
      handleSubmit,
      handleImageChange,
      loading,
      imagePreview
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <div class="page-wrapper">
      <Navbar />

      <div class="page-content">
        <div class="row mb-4">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯課程分類</h6>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label for="categoryName" class="form-label">分類名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="categoryName"
                      v-model="categoryName"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="description" class="form-label">分類描述</label>
                    <textarea
                      class="form-control"
                      id="description"
                      v-model="description"
                      rows="5"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="featuredImage" class="form-label">分類圖片</label>
                    <input
                      type="file"
                      class="form-control"
                      id="featuredImage"
                      @change="handleImageChange"
                      accept="image/*"
                    />
                    <div v-if="imagePreview" class="mt-2">
                      <img :src="imagePreview" class="img-preview" alt="分類圖片預覽" />
                    </div>
                  </div>

                  <div class="d-flex justify-content-end">
                    <router-link
                      class="btn btn-secondary me-2"
                      :to="{name: 'category-list'}"
                    >
                      取消
                    </router-link>
                    <button type="submit" class="btn btn-primary">儲存</button>
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
  <Loading v-if="loading" />
</template>

<style scoped>
.page-content {
  padding: 2rem;
}

.img-preview {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
}
</style>