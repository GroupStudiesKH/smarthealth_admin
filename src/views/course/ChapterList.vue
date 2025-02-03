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
    const chapters = ref([
      {
        id: 1,
        title: "第一章：健康管理概論",
        status: "已發布",
        lastModified: "2023-12-15",
      },
      {
        id: 2,
        title: "第二章：健康評估方法",
        status: "草稿",
        lastModified: "2023-12-14",
      },
    ]);

    const addChapter = () => {
      router.push(`/course/${route.params.courseId}/chapter/add`);
    };

    const editChapter = (chapterId) => {
      router.push(`/course/${route.params.courseId}/chapter/${chapterId}/edit`);
    };

    const deleteChapter = async (chapterId) => {
      if (confirm("確定要刪除此章節嗎？")) {
        try {
          // 這裡實作刪除章節的 API 呼叫
          console.log("刪除章節:", chapterId);
          // 重新載入章節列表
          // await fetchChapters();
        } catch (error) {
          console.error("刪除章節失敗:", error);
        }
      }
    };

    onMounted(() => {
      // 這裡實作載入章節列表的 API 呼叫
      // fetchChapters();
    });

    return {
      chapters,
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
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title mb-0">章節管理</h6>
                  <button type="button" class="btn btn-primary" @click="addChapter">
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
                        <th>最後修改日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="chapter in chapters" :key="chapter.id">
                        <td>{{ chapter.title }}</td>
                        <td>
                          <span
                            :class="{
                              'badge bg-success': chapter.status === '已發布',
                              'badge bg-warning': chapter.status === '草稿',
                            }"
                          >
                            {{ chapter.status }}
                          </span>
                        </td>
                        <td>{{ chapter.lastModified }}</td>
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
</template>