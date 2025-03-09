<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import apiService from "@/service/api-service.js";
import multiselect from "vue-multiselect";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    multiselect,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const editor = ref(null);
    const coverImagePreview = ref(null);

    const course = ref({
      title: "",
      instructor: "",
      description: "",
      category: "",
      tags: [],
      chapters: [],
      coverImage: null,
    });

    const categories = ref([]);
    const availableTags = ref([]);

    const selectedTags = ref([]);
    const instructorSearchQuery = ref("");
    const chapterSearchQuery = ref("");

    // 模擬的講師列表
    const availableInstructors = ref([]); // 确保初始化为空数组

    const nameWithPos  = ({name, position}) => {
      return `${name} (${position})`
    }

    // 修改课程获取逻辑
    const getCourse = async () => {
      try {
        const courseID = route.params.id;
        const res = await apiService.getCourse(courseID);

        // 等待讲师数据加载完成
        await getInstructor();

        course.value = {
          title: res.title,
          instructors: res.instructors,
          description: res.description,
          category: res.categories,
          tags: res.tags,
        };

      } catch (error) {
        console.log(error);
      }
    };

    const getInstructor = async () => {
      try {
        // 獲取講師
        const instructorRes = await apiService.getInstructorsOption();
        availableInstructors.value = instructorRes.map((item) => ({
          id: item.id,
          name: item.name,
          position: item.position || "",
        }));
      } catch (error) {
        console.log(error);
      }
    };

    const getTags = async () => {
      try {
        // 獲取標籤
        const tagRes = await apiService.getTags({ type: "tag" });
        availableTags.value = tagRes.data
      } catch (error) {
        console.log(error);
      }
    };

    const getCategory = async () => {
      try {
        // 獲取分類
        const categoryRes = await apiService.getTags({ type: "category" });
        categories.value = categoryRes.data;
      } catch (error) {
        console.log(error);
      }
    };

    const selectInstructor = (instructor) => {
      course.value.instructor = instructor.name;
      instructorSearchQuery.value = "";
    };

    const saveCourse = () => {
      // 這裡實作儲存課程的邏輯
      console.log("儲存課程", course.value);
      router.push("/course/list");
    };

    const handleCoverImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          coverImagePreview.value = e.target.result;
          course.value.coverImage = file;
        };
        reader.readAsDataURL(file);
      }
    };

    const removeCoverImage = () => {
      coverImagePreview.value = null;
      course.value.coverImage = null;
    };

    onMounted(async () => {
      editor.value = ClassicEditor.create(
        document.querySelector("#editor")
      ).catch((error) => {
        console.error(error);
      });

      try {
        getTags();
        getCategory();
        getInstructor();
        await getCourse();
      } catch (error) {
        console.error("資料獲取失敗:", error);
      }
    });

    return {
      course,
      categories,
      availableTags,
      selectedTags,
      saveCourse,
      route,
      handleCoverImageUpload,
      removeCoverImage,
      coverImagePreview,
      editor,
      instructorSearchQuery,
      chapterSearchQuery,
      selectInstructor,
      availableInstructors,
      nameWithPos
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
                <h6 class="card-title">
                  {{ route.params.id ? "編輯課程" : "新增課程" }}
                </h6>

                <form @submit.prevent="saveCourse">
                  <!-- 基本資訊 -->
                  <div class="mb-3">
                    <label class="form-label">課程標題</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="course.title"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">講師</label>
                    <multiselect
                      v-model="course.instructors"
                      :options="availableInstructors"
                      :custom-label="nameWithPos"
                      placeholder="Select one"
                      label="name"
                      track-by="name"
                      aria-label="pick a value"
                      :multiple="true"
                    >
                      <template v-slot:singleLabel="{ option }"
                        ><strong>{{ option.name }}</strong> ({{ option.position }})</template>
                    </multiselect>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程分類</label>
                    <multiselect
                      v-model="course.category"
                      :options="categories"
                      placeholder="Select one"
                      label="name"
                      track-by="name"
                      aria-label="pick a value"
                    >
                      <template v-slot:singleLabel="{ option }"
                        ><strong>{{ option.name }}</strong></template>
                    </multiselect>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程簡介</label>
                    <div id="editor">{{ course.description }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程標籤</label>
                    <div class="d-flex flex-wrap gap-2">
                      <multiselect id="tagging" v-model="course.tags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="name"
                      track-by="id" :options="availableTags" :multiple="true" :taggable="true"></multiselect>
                    </div>
                  </div>

                  <!-- 封面照片上傳 -->
                  <div class="mb-3">
                    <label class="form-label">課程封面照片</label>
                    <div class="cover-image-container">
                      <div v-if="coverImagePreview" class="cover-preview">
                        <img :src="coverImagePreview" alt="課程封面預覽" />
                        <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="removeCoverImage"
                        >
                          移除封面
                        </button>
                      </div>
                      <div v-else class="upload-placeholder">
                        <input
                          type="file"
                          class="form-control"
                          accept="image/*"
                          @change="handleCoverImageUpload"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- 提交按鈕 -->
                  <div class="d-flex justify-content-end gap-2">
                    <router-link
                      class="btn btn-secondary me-2"
                      :to="{ name: 'courseList' }"
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
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped>
.cover-image-container {
  max-width: 400px;
}

.cover-preview {
  position: relative;
  margin-bottom: 1rem;
}

.cover-preview img {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.cover-preview button {
  position: absolute;
  top: 10px;
  right: 10px;
}

.upload-placeholder {
  border: 2px dashed #ddd;
  padding: 20px;
  text-align: center;
  border-radius: 4px;
}
.page-header {
  margin-bottom: 1.5rem;
}

.editor-container {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>
