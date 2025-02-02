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
      agentAccount: "",
      startDate: "",
      endDate: "",
      gamePlatform: "PragmaticPlay",
      gameType: "",
      btag: "",
      pageSize: 10,
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
      searchForm.gamePlatform = "PragmaticPlay"; // Reset gamePlatform to default value
      searchForm.pageSize = 10; // Reset pageSize to default value
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
      { key: "gamePlatform", label: "遊戲平台" },
      { key: "gameType", label: "遊戲類型" },
      { key: "account", label: "帳號" },
      { key: "totalBetAmount", label: "玩家總投注額" },
      { key: "companyWinLoss", label: "公司總輸贏值" },
      { key: "freeSpinBonus", label: "免費轉獎金" },
      { key: "gamePromoBonus", label: "遊戲優惠獎金" },
      { key: "jackpotContribution", label: "獎池貢獻金" },
      { key: "jackpotPrize", label: "講持彩金" },
      { key: "startTime", label: "開始時間" },
      { key: "endTime", label: "結束時間" },
      { key: "updateTime", label: "更新時間" },
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

        // Fake data for now
        tableData.value = [
          {
            gamePlatform: "PragmaticPlay",
            gameType: "Slot",
            account: "player1",
            totalBetAmount: 1000,
            companyWinLoss: -200,
            freeSpinBonus: 50,
            gamePromoBonus: 30,
            jackpotContribution: 10,
            jackpotPrize: 500,
            startTime: "2022-01-01 10:00:00",
            endTime: "2022-01-01 11:00:00",
            updateTime: "2022-01-01 12:00:00",
          },
          {
            gamePlatform: "PragmaticPlay",
            gameType: "Roulette",
            account: "player2",
            totalBetAmount: 2000,
            companyWinLoss: 300,
            freeSpinBonus: 0,
            gamePromoBonus: 20,
            jackpotContribution: 15,
            jackpotPrize: 0,
            startTime: "2022-01-02 10:00:00",
            endTime: "2022-01-02 11:00:00",
            updateTime: "2022-01-02 12:00:00",
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
                <h6 class="card-title">玩家投注記錄列表</h6>

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
                    <label for="agentAccount" class="form-label">代理帳號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="agentAccount"
                      v-model="searchForm.agentAccount"
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
                    <label for="gamePlatform" class="form-label">遊戲平台</label>
                    <select
                      class="form-select"
                      id="gamePlatform"
                      v-model="searchForm.gamePlatform"
                      disabled
                    >
                      <option value="PragmaticPlay">Pragmatic Play</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="gameType" class="form-label">遊戲類型</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gameType"
                      v-model="searchForm.gameType"
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
                    <label for="pageSize" class="form-label">查詢筆數</label>
                    <input
                      type="number"
                      class="form-control"
                      id="pageSize"
                      v-model="searchForm.pageSize"
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
                <h6 class="card-title">玩家列表</h6>
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
