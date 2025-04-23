<script>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/loading.vue";
import apiService from "@/service/api-service";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const chapters = ref([]);
    const loading = ref(false);

    const addChapter = () => {
      router.push(`/course/${route.params.courseId}/chapter/add`);
    };

    const editChapter = (chapterId) => {
      router.push(`/course/${route.params.courseId}/chapter/${chapterId}/edit`);
    };

    const deleteChapter = async (chapterId) => {
      if (confirm("確定要刪除此章節嗎？")) {
        try {
          loading.value = true;
          await apiService.deleteChapter(route.params.courseId, chapterId);
          chapters.value = chapters.value.filter(
            (chapter) => chapter.id !== chapterId
          );
          loading.value = false;
        } catch (error) {
          loading.value = false;
          alert("刪除章節失敗");
        }
      }
    };

    const fetchChapters = async () => {
      try {
        loading.value = true;
        const results = await apiService.getChapters(route.params.courseId);
        loading.value = false;
        chapters.value = results;
      } catch (error) {
        loading.value = false;
        alert("獲取課程列表失敗");
        console.log(error);
      }
    };

    onMounted(() => {
      // 這裡實作載入章節列表的 API 呼叫
      fetchChapters();
    });

    return {
      chapters,
      loading,
      addChapter,
      editChapter,
      deleteChapter,
    };
  },
};
</script>

<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />

    <div class="page-wrapper">
      <div class="page-content">
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div
                  class="d-flex justify-content-between align-items-center mb-4"
                >
                  <h6 class="card-title mb-0">章節管理</h6>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addChapter"
                  >
                    <i class="link-icon" data-feather="plus"></i>
                    新增章節
                  </button>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>章節標題</th>
                        <th>狀態</th>
                        <th>新增日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="chapter in chapters" :key="chapter.id">
                        <td>{{ chapter.title }}</td>
                        <td>
                          <span
                            :class="{
                              'badge bg-success': chapter.status === 'publish',
                              'badge bg-warning':
                                chapter.status === 'unpublish',
                            }"
                          >
                            {{
                              chapter.status == "publish" ? "公開" : "未公開"
                            }}
                          </span>
                        </td>
                        <td>{{ chapter.created_at }}</td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-2"
                            @click="editChapter(chapter.id)"
                          >
                            編輯
                          </button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteChapter(chapter.id)"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>

  
  <!-- 載入中彈窗 -->
  <Loading v-if="loading" />
</template>