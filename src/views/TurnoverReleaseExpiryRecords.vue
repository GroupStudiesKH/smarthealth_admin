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
      account: "",
      platform: "",
      startDate: "",
      endDate: ""
    });

    // Initialize searchForm from URL parameters
    const initSearchForm = () => {
      Object.keys(searchForm).forEach(key => {
        if (route.query[key]) {
          searchForm[key] = route.query[key];
        }
      });
    };

    const resetSearch = () => {
      Object.keys(searchForm).forEach((key) => {
        searchForm[key] = "";
      });
      updateURL();
    };

    const updateURL = () => {
      const queryParams = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      const newURL = `${window.location.pathname}?${queryParams.toString()}`;
      window.location.href = newURL;
    };

    const tableColumns = reactive([
      { key: "platform", label: "遊戲平台" },
      { key: "account", label: "帳號" },
      { key: "currency", label: "幣別" },
      { key: "playerTurnover", label: "玩家流水" },
      { key: "remainingTurnover", label: "還差流水" },
      { key: "updateTime", label: "更新時間" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          platform: ["AG真人", "BBIN電競", "PG電子"][Math.floor(Math.random() * 3)],
          account: `user${Math.floor(Math.random() * 1000)}`,
          currency: ["CNY", "USD", "EUR"][Math.floor(Math.random() * 3)],
          playerTurnover: (Math.random() * 10000).toFixed(2),
          remainingTurnover: (Math.random() * 5000).toFixed(2),
          updateTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
        }));

        tableData.value = mockData;
        totalRecords.value = 100;
      } catch (error) {
        console.error("Failed to fetch turnover release records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#turnoverReleaseList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        fixedHeader: true,
        fixedColumns: {
          leftColumns: 2
        },
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
              placeholder: "搜索",
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
      performSearch
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
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title">流水解除失敗記錄</h6>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="account" class="form-label">帳號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="account"
                      v-model="searchForm.account"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="platform" class="form-label">遊戲平台</label>
                    <select
                      class="form-select"
                      id="platform"
                      v-model="searchForm.platform"
                    >
                      <option value="">全部</option>
                      <option value="platformA">平台A</option>
                      <option value="platformB">平台B</option>
                      <option value="platformC">平台C</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="startDate" class="form-label">開始時間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      v-model="searchForm.startDate"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="endDate" class="form-label">結束時間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      v-model="searchForm.endDate"
                    />
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
                <h6 class="card-title">流水解除失敗記錄列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="turnoverReleaseList">
                    <thead>
                      <tr>
                        <th v-for="column in tableColumns" :key="column.key">
                          {{ column.label }}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in tableData" :key="index">
                        <td v-for="column in tableColumns" :key="column.key">
                          {{ row[column.key] }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="card-footer">
                <p>玩家流水: 玩家申請優惠當下 , 當天已經投注的額度。</p>
                <p>本頁紀錄只有在玩家有鎖流水的狀態下 , 操作轉帳 解除流水失敗才會有紀錄。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
