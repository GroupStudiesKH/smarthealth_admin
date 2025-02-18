<script>
import { ref, computed } from "vue";
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
    const instructors = ref([
      {
        id: 1,
        name: "王大明",
        note: "醫療資訊系統架構師",
        created_at: "2023-12-01",
      },
      {
        id: 2,
        name: "李小華",
        note: "FHIR標準規範專家",
        created_at: "2023-12-05",
      },
      {
        id: 3,
        name: "張醫師",
        note: "資深臨床醫師兼醫資顧問",
        created_at: "2023-12-08",
      },
      {
        id: 4,
        name: "陳工程師",
        note: "醫療系統整合專家",
        created_at: "2023-12-10",
      },
      {
        id: 5,
        name: "林博士",
        note: "醫療資訊標準研究員",
        created_at: "2023-12-15",
      },
      {
        id: 6,
        name: "黃教授",
        note: "醫療資訊學系教授",
        created_at: "2023-12-18",
      },
      {
        id: 7,
        name: "吳資訊長",
        note: "醫院資訊部主管",
        created_at: "2023-12-20",
      },
      {
        id: 8,
        name: "周顧問",
        note: "醫療資訊安全顧問",
        created_at: "2023-12-22",
      },
      {
        id: 9,
        name: "楊工程師",
        note: "電子病歷系統開發者",
        created_at: "2023-12-25",
      },
      {
        id: 10,
        name: "謝專家",
        note: "醫療數據分析專家",
        created_at: "2023-12-28",
      },
      {
        id: 11,
        name: "劉博士",
        note: "醫療AI研究員",
        created_at: "2024-01-02",
      },
      {
        id: 12,
        name: "鄭經理",
        note: "醫療軟體產品經理",
        created_at: "2024-01-05",
      },
      {
        id: 13,
        name: "蔡醫師",
        note: "臨床資訊系統顧問",
        created_at: "2024-01-08",
      },
      {
        id: 14,
        name: "許工程師",
        note: "醫療介面設計專家",
        created_at: "2024-01-10",
      }
    ]);

    const searchQuery = ref("");
    const currentPage = ref(1);
    const pageSize = 10;

    const filteredInstructors = computed(() => {
      return instructors.value.filter((instructor) =>
        instructor.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const paginatedInstructors = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      const end = start + pageSize;
      return filteredInstructors.value.slice(start, end);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredInstructors.value.length / pageSize);
    });

    const deleteInstructor = (id) => {
      if (confirm("確定要刪除此講師嗎？")) {
        instructors.value = instructors.value.filter(
          (instructor) => instructor.id !== id
        );
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
    };

    return {
      instructors,
      searchQuery,
      filteredInstructors,
      paginatedInstructors,
      currentPage,
      totalPages,
      deleteInstructor,
      changePage,
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
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title mb-0">講師列表</h6>
                  <router-link to="/course/instructor/add" class="btn btn-primary">
                    新增講師
                  </router-link>
                </div>

                <div class="row mb-4">
                  <div class="col-md-4">
                    <input
                      type="text"
                      class="form-control"
                      v-model="searchQuery"
                      placeholder="搜尋講師名稱"
                    />
                  </div>
                </div>

                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>講師名稱</th>
                        <th>備註</th>
                        <th>新增日期</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="instructor in paginatedInstructors" :key="instructor.id">
                        <td>{{ instructor.name }}</td>
                        <td>{{ instructor.note }}</td>
                        <td>{{ instructor.created_at }}</td>
                        <td>
                          <router-link
                            :to="`/course/instructor/edit/${instructor.id}`"
                            class="btn btn-sm btn-outline-primary me-2"
                          >
                            編輯
                          </router-link>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            @click="deleteInstructor(instructor.id)"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- 分頁導航 -->
                <nav class="mt-4 d-flex justify-content-center">
                  <ul class="pagination">
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === 1 }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage - 1)"
                      >
                        上一頁
                      </a>
                    </li>
                    <li
                      v-for="page in totalPages"
                      :key="page"
                      class="page-item"
                      :class="{ active: currentPage === page }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(page)"
                      >
                        {{ page }}
                      </a>
                    </li>
                    <li
                      class="page-item"
                      :class="{ disabled: currentPage === totalPages }"
                    >
                      <a
                        class="page-link"
                        href="#"
                        @click.prevent="changePage(currentPage + 1)"
                      >
                        下一頁
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>