>
```

<script>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    Loading
  },
  setup() {
    const router = useRouter();

    const memberStats = ref({
      totalMembers: 0,
      newMonthlyMembers: 0,
      totalCourses: 0,
      publicCourses: 0
    });

    const popularCourses = ref([]);
    const popularTeachers = ref([]);
    
    const fetchDashboardData = async () => {
      try {
        loading.value = true;
        const data = await apiService.getDashboard();
        loading.value = false;
        // 更新會員統計數據
        memberStats.value = {
          totalMembers: data.total_members,
          newMonthlyMembers: data.new_members_this_month,
          totalCourses: data.total_courses,
          publicCourses: data.published_courses
        };
        
        // 更新熱門課程數據
        popularCourses.value = data.popular_courses.map(course => ({
          name: course.title,
          enrollments: course.enrollment_count,
          id: course.id
        }));
        
        // 更新熱門講師數據
        popularTeachers.value = data.popular_instructors.map(instructor => ({
          name: instructor.name,
          students: instructor.student_count,
          id: instructor.id,
          courses: instructor.course_count
        }));
      } catch (error) {
        loading.value = false;
        console.error('獲取儀表板數據失敗:', error);
      }
    };

    onMounted(() => {
      fetchDashboardData();
    });

    return {
      memberStats,
      popularCourses,
      popularTeachers,
      loading
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
                      <tr v-for="course in popularCourses" :key="course.id">
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
                      <tr v-for="teacher in popularTeachers" :key="teacher.id">
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
  <Loading v-if="loading" />
</template>
