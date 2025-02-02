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
      warningLevel: "",
      playerLevel: "", 
      loginInterval: "",
      timeInterval: "",
      btag: "",
      startTime: "",
      endTime: "",
      firstDepositStartTime: "",
      firstDepositEndTime: ""
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
      { key: "account", label: "帳號" },
      { key: "warningLevel", label: "警告級別" },
      { key: "playerLevel", label: "玩家等級" },
      { key: "loginInterval", label: "未登錄間隔" },
      { key: "timeInterval", label: "時間間隔（天）" },
      { key: "btag", label: "Btag" },
      { key: "startTime", label: "開始時間" },
      { key: "endTime", label: "結束時間" },
      { key: "firstDepositStartTime", label: "首存開始時間" },
      { key: "firstDepositEndTime", label: "首存結束時間" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          account: `player${index + 1}`,
          warningLevel: Math.floor(Math.random() * 3),
          playerLevel: Math.floor(Math.random() * 100),
          loginInterval: Math.floor(Math.random() * 30),
          timeInterval: Math.floor(Math.random() * 365),
          btag: `BT${Math.random().toString(36).substring(7)}`,
          startTime: new Date(Date.now() - Math.random() * 31536000000).toLocaleString(),
          endTime: new Date(Date.now() - Math.random() * 31536000000).toLocaleString(),
          firstDepositStartTime: new Date(Date.now() - Math.random() * 31536000000).toLocaleString(),
          firstDepositEndTime: new Date(Date.now() - Math.random() * 31536000000).toLocaleString()
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch player records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#playerWinLossAnalysis", {
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
              placeholder: "搜索紀錄",
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
                <h6 class="card-title">玩家歷史輸贏搜索</h6>

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
                    <label for="warningLevel" class="form-label">警告級別</label>
                    <input
                      type="number"
                      class="form-control"
                      id="warningLevel"
                      v-model="searchForm.warningLevel"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerLevel" class="form-label">玩家等級</label>
                    <input
                      type="number"
                      class="form-control"
                      id="playerLevel"
                      v-model="searchForm.playerLevel"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="loginInterval" class="form-label">未登錄間隔</label>
                    <input
                      type="number"
                      class="form-control"
                      id="loginInterval"
                      v-model="searchForm.loginInterval"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="timeInterval" class="form-label">時間間隔（天）</label>
                    <input
                      type="number"
                      class="form-control"
                      id="timeInterval"
                      v-model="searchForm.timeInterval"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="btag" class="form-label">Btag</label>
                    <input
                      type="text"
                      class="form-control"
                      id="btag"
                      v-model="searchForm.btag"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="startTime" class="form-label">開始時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="startTime"
                      v-model="searchForm.startTime"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="endTime" class="form-label">結束時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="endTime"
                      v-model="searchForm.endTime"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="firstDepositStartTime" class="form-label">首存開始時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="firstDepositStartTime"
                      v-model="searchForm.firstDepositStartTime"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="firstDepositEndTime" class="form-label">首存結束時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="firstDepositEndTime"
                      v-model="searchForm.firstDepositEndTime"
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
                <h6 class="card-title">玩家歷史輸贏分析</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="playerWinLossAnalysis">
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
