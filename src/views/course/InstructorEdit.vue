<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
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
    const imagePreview = ref(null);

    const instructor = ref({
      name: "",
      title: "",
      description: "",
      note: "",
      image: null
    });

    onMounted(() => {
      // TODO: 根據 ID 載入講師資料
      const instructorId = route.params.id;
      // 模擬 API 載入資料
      instructor.value = {
        name: "王大明",
        title: "健康管理專家",
        description: "擁有多年健康管理經驗...",
        note: "特殊備註",
        image: null
      };
    });

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

    const saveInstructor = () => {
      // TODO: 實作更新講師資料的 API 呼叫
      console.log("更新講師資料:", instructor.value);
      router.push("/course/instructor");
    };

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
                      v-model="instructor.title"
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