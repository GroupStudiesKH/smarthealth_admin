<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import apiService from "@/service/api-service.js";


export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const imagePreview = ref(null);
    const loading = ref(false);
    const instructor = ref({})

    const getInstructor = async () => {
      try {
        loading.value = true;
        const response = await apiService.getInstructor(route.params.id);
        instructor.value = response
        if (instructor.value.photo) {
          imagePreview.value = `${instructor.value.photo}`;
        }
      } catch (error) {
        alert('取得講師資料失敗');
        router.push('/course/instructor');
      } finally {
        loading.value = false;
      }
    }

    const saveInstructor = async () => {
      loading.value = true;
      try {
        const formData = new FormData();
        formData.append('name', instructor.value.name);
        formData.append('position', instructor.value.position);
        formData.append('description', instructor.value.description);
        formData.append('note', instructor.value.note);
        formData.append('index_show', instructor.value.index_show);
        if (instructor.value.image instanceof File) {
          formData.append('photo', instructor.value.image);
        }

        await apiService.updateInstructor(route.params.id, formData);
        router.push('/course/instructor');
      } catch (error) {
        alert('更新失敗：' + error.message);
      } finally {
        loading.value = false;
      }
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        instructor.value.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeImage = () => {
      instructor.value.image = null;
      imagePreview.value = null;
    };

    onMounted(() => {
      getInstructor()
    });

    return {
      instructor,
      imagePreview,
      handleImageUpload,
      removeImage,
      saveInstructor
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
          <div class="col-12 mx-auto stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯講師</h6>

                <form @submit.prevent="saveInstructor">
                  <div class="mb-3">
                    <label class="form-label">講師名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="instructor.name"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">講師照片</label>
                    <input
                      type="file"
                      class="form-control"
                      accept="image/*"
                      @change="handleImageUpload"
                    />
                    <div v-if="imagePreview" class="mt-2">
                      <img :src="imagePreview" class="img-thumbnail" style="max-width: 200px" />
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-danger ms-2"
                        @click="removeImage"
                      >
                        移除照片
                      </button>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">職稱</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="instructor.position"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">描述</label>
                    <textarea
                      class="form-control"
                      v-model="instructor.description"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">備註</label>
                    <textarea
                      class="form-control"
                      v-model="instructor.note"
                      rows="2"
                    ></textarea>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">是否展示在首頁</label>
                    <select class="form-select" v-model="instructor.index_show" required>
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                  </div>

                  <div class="d-flex justify-content-end">
                    <router-link to="/course/instructor" class="btn btn-secondary me-2">
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
</template>