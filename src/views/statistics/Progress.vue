<script>
import { ref } from 'vue'
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
    // 模擬課程統計數據
    const courses = ref([
      {
        id: 1,
        name: '基礎醫療保健課程',
        instructor: '王大明',
        category: '醫療保健',
        completionRate: 85,
        examPassRate: 78
      },
      {
        id: 2,
        name: '進階護理實務',
        instructor: '李美玲',
        category: '護理照護',
        completionRate: 92,
        examPassRate: 88
      },
      {
        id: 3,
        name: '緊急醫療救護訓練',
        instructor: '張志豪',
        category: '急救訓練',
        completionRate: 75,
        examPassRate: 82
      },
      {
        id: 4,
        name: '長期照護實務',
        instructor: '陳雅琪',
        category: '長照服務',
        completionRate: 88,
        examPassRate: 85
      }
    ])

    // 檢視詳細資料方法
    const viewDetails = (courseId) => {
      console.log('查看課程詳細資料:', courseId)
      // 這裡可以導向詳細頁面或開啟 Modal
    }

    return {
      courses,
      viewDetails
    }
  }
}
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <div class="page-wrapper">
      <Navbar />
      <div class="page-content">
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">學習進度統計</h6>
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>課程名稱</th>
                        <th>課程講師</th>
                        <th>分類</th>
                        <th>完課率</th>
                        <th>測驗通過率</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in courses" :key="course.id">
                        <td>{{ course.name }}</td>
                        <td>{{ course.instructor }}</td>
                        <td>{{ course.category }}</td>
                        <td>
                          <div class="progress">
                            <div
                              class="progress-bar bg-success"
                              role="progressbar"
                              :style="{ width: course.completionRate + '%' }"
                            >
                              {{ course.completionRate }}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="progress">
                            <div
                              class="progress-bar bg-info"
                              role="progressbar"
                              :style="{ width: course.examPassRate + '%' }"
                            >
                              {{ course.examPassRate }}%
                            </div>
                          </div>
                        </td>
                        <td>
                          <button
                            class="btn btn-primary btn-sm"
                            @click="viewDetails(course.id)"
                          >
                            檢視
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

<style scoped>
.progress {
  height: 20px;
  margin-bottom: 0;
}
.table td {
  vertical-align: middle;
}
</style>