>
```

<script>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const router = useRouter();

    const memberStats = ref({
      totalMembers: 12456,
      newMonthlyMembers: 245,
      totalCourses: 389,
      publicCourses: 156
    });

    const popularCourses = ref([
      { name: '健康飲食入門', enrollments: 156, rating: 4.8 },
      { name: '運動科學基礎', enrollments: 142, rating: 4.7 },
      { name: '心理健康與壓力管理', enrollments: 128, rating: 4.9 },
      { name: '瑜伽與冥想課程', enrollments: 115, rating: 4.6 },
      { name: '營養學概論', enrollments: 98, rating: 4.5 }
    ]);

    const popularTeachers = ref([
      { name: '王大明', courses: 12, students: 1560, rating: 4.9 },
      { name: '李小華', courses: 8, students: 1280, rating: 4.8 },
      { name: '張教授', courses: 10, students: 1150, rating: 4.7 },
      { name: '陳醫師', courses: 6, students: 980, rating: 4.8 },
      { name: '林講師', courses: 7, students: 860, rating: 4.6 }
    ]);

    onMounted(() => {
      // 初始化數據
    });

    return {
      memberStats,
      popularCourses,
      popularTeachers
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
        <div class="row">
          <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">總會員數量</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ memberStats.totalMembers }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">本月新增會員</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ memberStats.newMonthlyMembers }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">總課程數量</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ memberStats.totalCourses }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">公開課程數量</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ memberStats.publicCourses }}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-7 col-xl-8 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">本月熱門課程排行</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>課程名稱</th>
                        <th>報名人數</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="course in popularCourses" :key="course.name">
                        <td>{{ course.name }}</td>
                        <td>{{ course.enrollments }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-5 col-xl-4 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">本月熱門講師排行</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>講師姓名</th>
                        <th>課程數</th>
                        <th>學員數</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="teacher in popularTeachers" :key="teacher.name">
                        <td>{{ teacher.name }}</td>
                        <td>{{ teacher.courses }}</td>
                        <td>{{ teacher.students }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  </div>
</template>
