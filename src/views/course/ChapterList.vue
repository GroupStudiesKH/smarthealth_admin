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
        title: "除了資料統一，規則統一，還要有應用程式市集",
        status: "已發布",
        lastModified: "2023-12-15",
        videoPath: "assets/video/除了資料統一，規則統一，還要有應用程式市集.mov"
      },
      {
        id: 2,
        title: "統一台灣電子病歷的策略思考",
        status: "已發布",
        lastModified: "2023-12-14",
        videoPath: "assets/video/統一台灣電子病歷的策略思考.mov"
      },
      {
        id: 3,
        title: "開發FHIR工具，FHIR資料中臺實現互通",
        status: "已發布",
        lastModified: "2023-12-13",
        videoPath: "assets/video/開發FHIR工具，FHIR資料中臺實現互通.mov"
      },
      {
        id: 4,
        title: "臺灣醫中電子病歷資料統一的架構",
        status: "已發布",
        lastModified: "2023-12-12",
        videoPath: "assets/video/臺灣醫中電子病歷資料統一的架構.mov"
      },
      {
        id: 5,
        title: "FHIR 統一資料，但是沒有統一規則",
        status: "已發布",
        lastModified: "2023-12-11",
        videoPath: "assets/video/FHIR 統一資料，但是沒有統一規則.mov"
      },
      {
        id: 6,
        title: "FHIR 統一資料",
        status: "已發布",
        lastModified: "2023-12-10",
        videoPath: "assets/video/FHIR 統一資料.mov"
      },
      {
        id: 7,
        title: "LOINC標準碼",
        status: "已發布",
        lastModified: "2023-12-09",
        videoPath: "assets/video/LOINC標準碼.mov"
      },
      {
        id: 8,
        title: "RxNorm",
        status: "已發布",
        lastModified: "2023-12-08",
        videoPath: "assets/video/RxNorm.mov"
      },
      {
        id: 9,
        title: "SNOMED CT",
        status: "已發布",
        lastModified: "2023-12-07",
        videoPath: "assets/video/SNOMED CT.mov"
      },
      {
        id: 10,
        title: "TW CDI",
        status: "已發布",
        lastModified: "2023-12-06",
        videoPath: "assets/video/TW CDI.mov"
      }
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