<script>
import { ref, computed, onMounted } from "vue";
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
    const route = useRoute();
    const router = useRouter();

    const course = ref({
      title: "",
      instructor: "",
      content: "",
      category: "",
      tags: [],
      chapters: [],
    });

    const categories = ["健康管理", "營養學", "運動科學", "心理健康"];
    const availableTags = ["基礎", "入門", "進階", "專業", "實務"];

    const selectedTags = ref([]);

    const addChapter = () => {
      course.value.chapters.push({
        title: "",
        content: "",
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

    const saveCourse = () => {
      // 這裡實作儲存課程的邏輯
      console.log("儲存課程", course.value);
      router.push("/course/list");
    };

    onMounted(() => {
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

                  <!-- 課程內容 -->
                  <div class="mb-3">
                    <label class="form-label">課程簡介</label>
                    <div class="editor-container">
                      <!-- 這裡整合 WYSIWYG 編輯器 -->
                      <textarea
                        class="form-control"
                        v-model="course.content"
                        rows="5"
                      ></textarea>
                    </div>
                  </div>

                  <!-- 章節管理 -->
                  <div class="mb-3">
                    <div
                      class="d-flex justify-content-between align-items-center mb-3"
                    >
                      <label class="form-label mb-0">章節管理</label>
                      <button
                        type="button"
                        class="btn btn-primary btn-sm"
                        @click="addChapter"
                      >
                        新增章節
                      </button>
                    </div>

                    <div
                      v-for="(chapter, index) in course.chapters"
                      :key="index"
                      class="card mb-3"
                    >
                      <div class="card-body">
                        <div
                          class="d-flex justify-content-between align-items-start mb-3"
                        >
                          <h6 class="card-title mb-0">
                            第 {{ chapter.order }} 章
                          </h6>
                          <button
                            type="button"
                            class="btn btn-outline-danger btn-sm"
                            @click="removeChapter(index)"
                          >
                            刪除
                          </button>
                        </div>

                        <div class="mb-3">
                          <label class="form-label">章節標題</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="chapter.title"
                            required
                          />
                        </div>

                        <div class="mb-3">
                          <label class="form-label">章節內容</label>
                          <div class="editor-container">
                            <!-- 這裡整合 WYSIWYG 編輯器 -->
                            <textarea
                              class="form-control"
                              v-model="chapter.content"
                              rows="3"
                            ></textarea>
                          </div>
                        </div>
                      </div>
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
.page-header {
  margin-bottom: 1.5rem;
}

.editor-container {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
</style>