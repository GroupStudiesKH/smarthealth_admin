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
      startDate: "",
      endDate: "",
      timeZone: "UTC +08:00",
      gamePlatform: "",
      dataStatus: "",
      gameName: "",
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
      searchForm.timeZone = "UTC +08:00"; // Reset timeZone to default value
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
      { key: "gameWallet", label: "遊戲錢包" },
      { key: "gamePlatform", label: "遊戲平台" },
      { key: "gameType", label: "遊戲類型" },
      { key: "account", label: "帳號" },
      { key: "totalBetAmount", label: "玩家總投注額" },
      { key: "totalWinLoss", label: "玩家總輸贏值" },
      { key: "details", label: "明細" },
      { key: "export", label: "匯出" },
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // const response = await apiService.getPlayers({
        //   page,
        //   pageSize,
        //   search,
        //   ...searchForm
        // });

        // if (response && response.data) {
        //   console.log(response);
        //   tableData.value = response.data;
        // } else {
        //   console.error("Invalid response structure:", response);
        //   tableData.value = [];
        // }
        // totalRecords.value = response.recordsTotal;

        // Mock data
        tableData.value = [
          {
            gameWallet: "Wallet1",
            gamePlatform: "Platform1",
            gameType: "Type1",
            account: "Account1",
            totalBetAmount: 1000,
            totalWinLoss: 200,
            details: "Details1",
            export: "Export1",
          },
          {
            gameWallet: "Wallet2",
            gamePlatform: "Platform2",
            gameType: "Type2",
            account: "Account2",
            totalBetAmount: 2000,
            totalWinLoss: 400,
            details: "Details2",
            export: "Export2",
          },
        ];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#gamerList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          render: (data, type, row) => {
            if (column.key === "details") {
              return `<button class="btn btn-link p-0">明細</button>`;
            }
            if (column.key === "export") {
              return `<button class="btn btn-link p-0">匯出</button>`;
            }
            return data;
          },
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        fixedHeader: true,
        fixedColumns:   {
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
              placeholder: "搜索玩家",
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
                <h6 class="card-title">玩家投注細單查詢</h6>

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
                  <div class="col-md-3 mb-3">
                    <label for="timeZone" class="form-label">時區</label>
                    <input
                      type="text"
                      class="form-control"
                      id="timeZone"
                      v-model="searchForm.timeZone"
                      readonly
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="gamePlatform" class="form-label">遊戲平台</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gamePlatform"
                      v-model="searchForm.gamePlatform"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="dataStatus" class="form-label">資料狀態</label>
                    <input
                      type="text"
                      class="form-control"
                      id="dataStatus"
                      v-model="searchForm.dataStatus"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="gameName" class="form-label">遊戲名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gameName"
                      v-model="searchForm.gameName"
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
                <h6 class="card-title">玩家投注細單查詢</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="gamerList">
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
