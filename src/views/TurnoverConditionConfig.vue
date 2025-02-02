<script>
import { onMounted, ref, reactive, watch } from "vue";
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
      name: "",
      startDate: "",
      endDate: "",
      status: "",
      gameTypes: {
        Arcard: false,
        Fishing: false,
        Live: false,
        Slot: false,
        Tablegame: false,
        Videogame: false
      }
    });

    // Initialize searchForm from URL parameters
    const initSearchForm = () => {
      Object.keys(searchForm).forEach(key => {
        if (route.query[key]) {
          if (key === 'gameTypes') {
            const types = route.query[key].split(',');
            types.forEach(type => {
              searchForm.gameTypes[type] = true;
            });
          } else {
            searchForm[key] = route.query[key];
          }
        }
      });
    };

    const resetSearch = () => {
      searchForm.name = "";
      searchForm.startDate = "";
      searchForm.endDate = "";
      searchForm.status = "";
      Object.keys(searchForm.gameTypes).forEach(type => {
        searchForm.gameTypes[type] = false;
      });
      updateURL();
    };

    const updateURL = () => {
      const queryParams = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {
        if (key === 'gameTypes') {
          const selectedTypes = Object.entries(value)
            .filter(([_, checked]) => checked)
            .map(([type]) => type);
          if (selectedTypes.length) {
            queryParams.append(key, selectedTypes.join(','));
          }
        } else if (value) {
          queryParams.append(key, value);
        }
      });
      const newURL = `${window.location.pathname}?${queryParams.toString()}`;
      window.location.href = newURL;
    };

    const tableColumns = reactive([
      { key: "name", label: "名稱" },
      { key: "status", label: "狀態" },
      { key: "startDate", label: "開始時間" },
      { key: "endDate", label: "結束時間" },
      { key: "gameTypes", label: "適用種類" },
      { key: "remark", label: "備註" },
      { key: "actions", label: "編輯" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Mock data
        tableData.value = [
          {
            name: "新會員優惠",
            status: "啟用",
            startDate: "2024-01-01",
            endDate: "2024-12-31",
            gameTypes: "Slot, Live",
            remark: "新會員首存優惠活動",
            actions: '<button class="btn btn-primary btn-sm">編輯</button>'
          },
          {
            name: "VIP回饋", 
            status: "停用",
            startDate: "2024-02-01",
            endDate: "2024-06-30",
            gameTypes: "Arcard, Fishing",
            remark: "VIP會員專屬優惠",
            actions: '<button class="btn btn-primary btn-sm">編輯</button>'
          },
          {
            name: "週末加碼",
            status: "啟用", 
            startDate: "2024-03-01",
            endDate: "2024-12-31",
            gameTypes: "All Games",
            remark: "週末存款優惠活動",
            actions: '<button class="btn btn-primary btn-sm">編輯</button>'
          }
        ];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch turnover conditions:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#sourceUrlList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          render: column.key === 'actions' ? (data, type, row) => {
            return '<button class="btn btn-primary btn-sm">編輯</button>';
          } : null
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        fixedHeader: true,
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
        layout: {
          topEnd: {
            search: {
              placeholder: "搜索名稱",
            },
          },
        },
        aLengthMenu: [
          [10, 25, 50, 100, -1],
          [10, 25, 50, 100, "全部"],
        ],
        iDisplayLength: 10,
        language: {
          search: "",
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
        autoWidth: false
      });
    };

    const performSearch = () => {
      if (dataTable) {
        dataTable.ajax.reload();
        updateURL()
      }
    };

    onMounted(() => {
      initSearchForm();
      initializeDataTable();
    });

    return {
      tableData,
      tableColumns,
      searchForm,
      resetSearch,
      updateURL,
      performSearch,
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
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">流水條件配置</h6>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="name" class="form-label">名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="searchForm.name"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="startDate" class="form-label">開始時間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      v-model="searchForm.startDate"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="endDate" class="form-label">結束時間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      v-model="searchForm.endDate"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-12">
                    <label class="form-label">適用種類</label>
                    <div class="d-flex gap-4">
                      <div class="form-check" v-for="(value, type) in searchForm.gameTypes" :key="type">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          :id="type"
                          v-model="searchForm.gameTypes[type]"
                        />
                        <label class="form-check-label" :for="type">
                          {{ type }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div class="col-md-4">
                    <label for="status" class="form-label">狀態</label>
                    <select class="form-select" id="status" v-model="searchForm.status">
                      <option value="">全部</option>
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
                    </select>
                  </div>
                </div>

                <div class="mt-3">
                  <button type="submit" class="btn btn-primary me-2" @click="performSearch">
                    搜索
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="resetSearch"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">額度記錄 (戶內) 列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="sourceUrlList">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in tableData" :key="index">
                        <td v-for="column in tableColumns" :key="column.key" v-html="row[column.key]">
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
