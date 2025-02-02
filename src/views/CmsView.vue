<script>
import { onMounted, ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
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
    const tableData = ref([]);
    const totalRecords = ref(0);
    const searchForm = reactive({
      title: "",
    });

    const tableColumns = reactive([
      { key: "title", label: "標題", width: "40%" },
      { key: "category_name", label: "分類" },
      { key: "status", label: "狀態" },
      { key: "sort", label: "排序" },
      { key: "created_at", label: "創建時間" },
      { key: "updated_at", label: "更新時間" },
      { key: "actions", label: "操作" },
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        const response = await apiService.getPosts({
          page,
          pageSize,
          search,
          ...searchForm,
        });

        if (response && response.data) {
          console.log(response);
          tableData.value = response.data;
          totalRecords.value = response.recordsTotal;
        } else {
          console.error("Invalid response structure:", response);
          tableData.value = [];
          totalRecords.value = 0;
        }
      } catch (error) {
        console.error("Failed to fetch article data:", error);
      }
    };

    const deletePost = async (id) => {
      if (confirm("確定要刪除這篇文章嗎？")) {
        try {
          await apiService.deletePost(id);
          dataTable.ajax.reload();
        } catch (error) {
          console.error("Failed to delete post:", error);
        }
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#articleList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          width: column.width,
          render: (data, type, row) => {
            if (column.key === "actions") {
              return `
                <a href="/layout/cms/edit/${row.id}" class="btn btn-link p-0 me-2">
                  <i class="material-icons">edit</i>
                </a>
                <button class="btn btn-link p-0 delete-btn" data-id="${row.id}">
                  <i class="material-icons">delete</i>
                </button>
              `;
            }
            if (column.key === "status") {
              const statuses = {
                active: "公開",
                inactive: "隱藏",
              };
              return statuses[data] || data;
            }
            return data;
          },
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        ajax: (data, callback, settings) => {
          const page = Math.floor(data.start / data.length) + 1;
          const pageSize = data.length;
          const search = data.search.value || "";
          fetchTableData(page, pageSize, search)
            .then(() => {
              callback({
                recordsTotal: totalRecords.value,
                recordsFiltered: totalRecords.value,
                data: tableData.value,
              });
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
              callback({
                recordsTotal: 0,
                recordsFiltered: 0,
                data: [],
              });
            });
        },
        language: {
          search: "搜索文章標題:",
          sEmptyTable: "暫無資料",
          paginate: {
            previous: "上一頁",
            next: "下一頁",
          },
          info: "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
          lengthMenu: "顯示 _MENU_ 項結果",
          infoEmpty: "顯示第 0 至 0 項結果，共 0 項",
          infoFiltered: "(由 _MAX_ 項結果過濾)",
        },
        pagingType: "full_numbers",
        autoWidth: false,
      });

      // Add event listener for delete buttons
      document.querySelector('#articleList').addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn')) {
          const id = e.target.closest('.delete-btn').dataset.id;
          deletePost(id);
        }
      });
    };

    onMounted(() => {
      initializeDataTable();
    });

    return {
      tableData,
      tableColumns,
      searchForm,
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
          <div class="col-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="card-title mb-0">文章列表</h6>
                  <router-link to="/layout/cms/add" class="btn btn-primary">新增文章</router-link>
                </div>

                <div class="table-responsive">
                  <table class="table dataTable" id="articleList">
                    <thead>
                      <tr>
                        <th
                          v-for="column in tableColumns"
                          :key="column.key"
                          class="text-nowrap"
                          :style="{ width: column.width }"
                        >
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
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
