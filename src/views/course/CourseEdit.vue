<script>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const editor = ref(null);
    const coverImagePreview = ref(null);

    const course = ref({
      title: "",
      instructor: "",
      content: "",
      category: "",
      tags: [],
      chapters: [],
      coverImage: null
    });

    const categories = ["健康管理", "營養學", "運動科學", "心理健康"];
    const availableTags = ["基礎", "入門", "進階", "專業", "實務"];
    const availableChapters = ref([
      { id: 1, title: "第一章：健康管理概論" },
      { id: 2, title: "第二章：健康評估方法" },
      { id: 3, title: "第三章：健康計劃制定" },
      { id: 4, title: "第四章：健康監測與追蹤" },
    ]);

    const selectedTags = ref([]);

    const addChapter = () => {
      course.value.chapters.push({
        id: null,
        title: "",
        order: course.value.chapters.length + 1,
      });
    };

    const removeChapter = (index) => {
      course.value.chapters.splice(index, 1);
      // 重新排序
      course.value.chapters.forEach((chapter, idx) => {
        chapter.order = idx + 1;
      });
    };

    const updateChapterTitle = (index, chapterId) => {
      const selectedChapter = availableChapters.value.find(ch => ch.id === chapterId);
      if (selectedChapter) {
        course.value.chapters[index].id = selectedChapter.id;
        course.value.chapters[index].title = selectedChapter.title;
      }
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

    onMounted(() => {
      editor.value = ClassicEditor
        .create(document.querySelector('#editor'))
        .catch(error => {
          console.error(error);
        });

      const courseId = route.params.id;
      if (courseId) {
        // 如果是編輯模式，載入課程資料
        // 這裡模擬從API獲取資料
        course.value = {
          title: "基礎健康管理課程",
          instructor: "王大明",
          content: "課程簡介內容...",
          category: "健康管理",
          tags: ["基礎", "入門"],
          chapters: [
            {
              title: "第一章：健康管理概論",
              content: "章節內容...",
              order: 1,
            },
          ],
        };
        selectedTags.value = course.value.tags;
      }
    });

    return {
      course,
      categories,
      availableTags,
      selectedTags,
      addChapter,
      removeChapter,
      saveCourse,
      route,
      handleCoverImageUpload,
      removeCoverImage,
      coverImagePreview,
      editor
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
                    <input
                      type="text"
                      class="form-control"
                      v-model="course.instructor"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程分類</label>
                    <select
                      class="form-select"
                      v-model="course.category"
                      required
                    >
                      <option value="">請選擇分類</option>
                      <option
                        v-for="category in categories"
                        :key="category"
                        :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程標籤</label>
                    <div class="d-flex flex-wrap gap-2">
                      <div
                        v-for="tag in availableTags"
                        :key="tag"
                        class="form-check"
                      >
                        <input
                          type="checkbox"
                          class="form-check-input"
                          :id="`tag-${tag}`"
                          :value="tag"
                          v-model="selectedTags"
                        />
                        <label class="form-check-label" :for="`tag-${tag}`">
                          {{ tag }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">課程簡介</label>
                    <div id="editor"></div>
                  </div>



                <!-- 封面照片上傳 -->
                <div class="mb-3">
                    <label class="form-label">課程封面照片</label>
                    <div class="cover-image-container">
                      <div v-if="coverImagePreview" class="cover-preview">
                        <img :src="coverImagePreview" alt="課程封面預覽" />
                        <button type="button" class="btn btn-danger btn-sm" @click="removeCoverImage">
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

                  <!-- 章節管理 -->
                  <div class="mb-3">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <label class="form-label mb-0">章節管理</label>
                      <button type="button" class="btn btn-primary btn-sm" @click="addChapter">
                        新增章節
                      </button>
                    </div>

                    <div class="table-responsive">
                      <table class="table table-bordered">
                        <thead>
                          <tr>
                            <th style="width: 80px">順序</th>
                            <th>章節</th>
                            <th style="width: 100px">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(chapter, index) in course.chapters" :key="index">
                            <td class="text-center">{{ chapter.order }}</td>
                            <td>
                              <select 
                                class="form-select" 
                                v-model="chapter.id"
                                @change="updateChapterTitle(index, chapter.id)"
                                required
                              >
                                <option value="">請選擇章節</option>
                                <option 
                                  v-for="availableChapter in availableChapters" 
                                  :key="availableChapter.id"
                                  :value="availableChapter.id"
                                >
                                  {{ availableChapter.title }}
                                </option>
                              </select>
                            </td>
                            <td class="text-center">
                              <button 
                                type="button" 
                                class="btn btn-outline-danger btn-sm"
                                @click="removeChapter(index)"
                              >
                                刪除
                              </button>
                            </td>
                          </tr>
                          <tr v-if="course.chapters.length === 0">
                            <td colspan="3" class="text-center">尚未添加任何章節</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- 提交按鈕 -->
                  <div class="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      @click="router.push('/course/list')"
                    >
                      取消
                    </button>
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