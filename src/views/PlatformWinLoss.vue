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
      gamePlatform: "",
      account: "",
      startDate: "",
      endDate: "",
      pageSize: 10,
      btag: "",
      gameType: "",
      playerCurrency: "",
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
      { key: "recordNumber", label: "紀錄號" },
      { key: "account", label: "帳號" },
      { key: "playerLevel", label: "玩家等級" },
      { key: "gameAdjustment", label: "遊戲調整" },
      { key: "bTag", label: "BTag" },
      { key: "playerCurrency", label: "玩家幣別" },
      { key: "playerBetAmount", label: "玩家投注額" },
      { key: "companyWinLoss", label: "公司輸贏值" },
      { key: "sportsBetAmount", label: "體育投注額" },
      { key: "freeSpinBonus", label: "免費轉獎金" },
      { key: "gamePromoBonus", label: "遊戲優惠獎金" },
      { key: "executive", label: "執行人員" },
      { key: "dataDate", label: "數據日" },
      { key: "remarks", label: "備註" },
    ]);

    let dataTable;

    // Commented out the API call part
    /*
    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        const response = await apiService.getPlayers({
          page,
          pageSize,
          search,
          ...searchForm
        });

        if (response && response.data) {
          console.log(response);
          tableData.value = response.data;
        } else {
          console.error("Invalid response structure:", response);
          tableData.value = [];
        }
        totalRecords.value = response.recordsTotal;
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };
    */

    // Adding fake data
    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      const fakeData = [
        {
          recordNumber: "001",
          account: "player1",
          playerLevel: "新手",
          gameAdjustment: "調整1",
          bTag: "B001",
          playerCurrency: "TWD",
          playerBetAmount: 1000,
          companyWinLoss: 200,
          sportsBetAmount: 500,
          freeSpinBonus: 50,
          gamePromoBonus: 100,
          executive: "Admin",
          dataDate: "2023-01-01",
          remarks: "備註1",
        },
        {
          recordNumber: "002",
          account: "player2",
          playerLevel: "中級",
          gameAdjustment: "調整2",
          bTag: "B002",
          playerCurrency: "USD",
          playerBetAmount: 2000,
          companyWinLoss: -100,
          sportsBetAmount: 1000,
          freeSpinBonus: 100,
          gamePromoBonus: 200,
          executive: "Admin",
          dataDate: "2023-01-02",
          remarks: "備註2",
        },
      ];
      tableData.value = fakeData;
      totalRecords.value = fakeData.length;
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
                <h6 class="card-title">遊戲平台輸贏</h6>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="gamePlatform" class="form-label">遊戲平台</label>
                    <select
                      class="form-select"
                      id="gamePlatform"
                      v-model="searchForm.gamePlatform"
                    >
                      <option value="">全部</option>
                      <option value="PragmaticPlay">Pragmatic Play</option>
                    </select>
                  </div>
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
                    <label for="pageSize" class="form-label">每頁記錄</label>
                    <input
                      type="number"
                      class="form-control"
                      id="pageSize"
                      v-model="searchForm.pageSize"
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
                    <label for="gameType" class="form-label">遊戲類型</label>
                    <input
                      type="text"
                      class="form-control"
                      id="gameType"
                      v-model="searchForm.gameType"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerCurrency" class="form-label">玩家幣別</label>
                    <input
                      type="text"
                      class="form-control"
                      id="playerCurrency"
                      v-model="searchForm.playerCurrency"
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
