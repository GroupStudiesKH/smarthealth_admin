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
    const activeTab = ref('dataOverview');
    const tableData = ref([]);
    const totalRecords = ref(0);
    const searchForm = reactive({
      startDate: "",
      endDate: "",
      gamePlatform: "",
      gameType: "",
    });

    const gamePlatforms = [
      { value: "PragmaticPlay", label: "Pragmatic Play" }
    ];

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

    const tableColumns = reactive({
      dataOverview: [
        { key: "date", label: "日期" },
        { key: "registrations", label: "註冊" },
        { key: "dailyLogins", label: "當日登入人數" },
        { key: "firstDeposits", label: "首存人數" },
        { key: "dailyRegistrationDeposits", label: "當日註冊暫存" },
        { key: "firstDepositAmount", label: "首存金額" },
        { key: "depositCount", label: "存款人數" },
        { key: "requestedDepositAmount", label: "申請存款金額" },
        { key: "actualDepositAmount", label: "實際存款金額" },
        { key: "actualWithdrawalCount", label: "實際提款人數" },
        { key: "requestedWithdrawalAmount", label: "申請提款金額" },
        { key: "actualWithdrawalAmount", label: "實際提款金額" },
        { key: "depositWithdrawalDifference", label: "存提差" },
        { key: "manualAdjustment", label: "手動調整額度" },
        { key: "totalRequestedAmount", label: "金流平台總申請金額" },
        { key: "totalPlayerBalance", label: "玩家主帳戶總餘額" },
        { key: "actualBettors", label: "實際投注人數" },
        { key: "repeatedBettors", label: "重複的投注人數" },
        { key: "totalValidBets", label: "總有效投注額" },
      ],
      gameStatistics: [
        { key: "date", label: "日期" },
        { key: "playerCount", label: "玩家數量" },
        {
          key: "live",
          label: "Live",
          subColumns: [
            { key: "BNG", label: "BNG" },
            { key: "EVO", label: "EVO" },
            { key: "HB", label: "HB" },
            { key: "MG", label: "MG" },
            { key: "PG", label: "PG" },
            { key: "PNG", label: "PNG" },
            { key: "PP", label: "PP" },
            { key: "PT", label: "PT" },
            { key: "RG", label: "RG" },
            { key: "SG", label: "SG" },
            { key: "AUX", label: "AUX" },
          ],
        },
        {
          key: "slot",
          label: "Slot",
          subColumns: [
            { key: "BNG", label: "BNG" },
            { key: "BTG", label: "BTG" },
            { key: "HB", label: "HB" },
            { key: "HS", label: "HS" },
            { key: "MG", label: "MG" },
            { key: "MP", label: "MP" },
            { key: "NLC", label: "NLC" },
            { key: "NT", label: "NT" },
            { key: "PAS", label: "PAS" },
            { key: "PG", label: "PG" },
            { key: "PNG", label: "PNG" },
            { key: "PP", label: "PP" },
            { key: "PT", label: "PT" },
            { key: "QS", label: "QS" },
            { key: "RG", label: "RG" },
            { key: "RT", label: "RT" },
          ],
        },
      ],
      promotionStatistics: [
        { key: "promotionName", label: "優惠名稱" },
        { key: "participantsCount", label: "參與人數" },
        { key: "totalBonus", label: "總優惠金額" },
      ],
    });

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Mock data for all tabs
        const mockData = {
          dataOverview: [
            {
              date: "2023-05-01",
              registrations: 100,
              dailyLogins: 500,
              firstDeposits: 50,
              dailyRegistrationDeposits: 2000,
              firstDepositAmount: 10000,
              depositCount: 200,
              requestedDepositAmount: 50000,
              actualDepositAmount: 48000,
              actualWithdrawalCount: 150,
              requestedWithdrawalAmount: 30000,
              actualWithdrawalAmount: 28000,
              depositWithdrawalDifference: 20000,
              manualAdjustment: 1000,
              totalRequestedAmount: 80000,
              totalPlayerBalance: 100000,
              actualBettors: 300,
              repeatedBettors: 50,
              totalValidBets: 200000,
            },
            {
              date: "2023-05-02",
              registrations: 120,
              dailyLogins: 550,
              firstDeposits: 60,
              dailyRegistrationDeposits: 2500,
              firstDepositAmount: 12000,
              depositCount: 220,
              requestedDepositAmount: 55000,
              actualDepositAmount: 52000,
              actualWithdrawalCount: 170,
              requestedWithdrawalAmount: 35000,
              actualWithdrawalAmount: 32000,
              depositWithdrawalDifference: 20000,
              manualAdjustment: 1200,
              totalRequestedAmount: 90000,
              totalPlayerBalance: 110000,
              actualBettors: 320,
              repeatedBettors: 55,
              totalValidBets: 220000,
            },
          ],
          gameStatistics: [
            {
              date: "2023-05-01",
              playerCount: 1000,
              gamePlatforms: {
                LIVE: {
                  EVO: 100,
                  PP: 150,
                },
                SLOT: {
                  PG: 200,
                  CQ9: 180,
                },
              },
              gameStatistics: {
                playerCount: 1000,
                LIVE: {
                  playerCount: 250,
                  validBets: 50000,
                  totalProfit: 5000,
                  platformFee: 1000,
                  RTP: 90,
                },
                SLOT: {
                  playerCount: 380,
                  validBets: 76000,
                  totalProfit: 7600,
                  platformFee: 1520,
                  RTP: 92,
                },
              },
            },
            // ... more dates
          ],
          promotionStatistics: [
            {
              promotionName: "Promo1",
              participantsCount: 50,
              totalBonus: 1000,
            },
            {
              promotionName: "Promo2",
              participantsCount: 100,
              totalBonus: 2000,
            },
          ],
        };

        tableData.value = mockData[activeTab.value];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#dataTable", {
        data: tableData.value,
        columns: tableColumns[activeTab.value].flatMap((column) => {
          if (column.subColumns) {
            return column.subColumns.flatMap(subColumn => [
              { data: `${column.key}.${subColumn.key}.players`, title: `${subColumn.label} 遊戲人數` },
              { data: `${column.key}.${subColumn.key}.validBets`, title: `${subColumn.label} 有效投注額` },
              { data: `${column.key}.${subColumn.key}.winAmount`, title: `${subColumn.label} 贏得金額` },
              { data: `${column.key}.${subColumn.key}.avgBet`, title: `${subColumn.label} 平均投注` },
              { data: `${column.key}.${subColumn.key}.rtp`, title: `${subColumn.label} RTP%` },
            ]);
          }
          return { data: column.key, title: column.label };
        }),
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
        // ... (rest of the DataTable options remain the same)
      });
    };

    const performSearch = () => {
      if (dataTable) {
        dataTable.ajax.reload();
        updateURL()
      }
    };

    const changeTab = (tab) => {
      activeTab.value = tab;
      if (dataTable) {
        dataTable.destroy();
      }
      initializeDataTable();
    };

    onMounted(() => {
      initSearchForm();
      initializeDataTable();
    });

    return {
      activeTab,
      tableData,
      tableColumns,
      searchForm,
      resetSearch,
      updateURL,
      performSearch,
      changeTab,
      gamePlatforms,
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
                <h6 class="card-title">報表查詢</h6>

                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeTab === 'dataOverview' }" @click="changeTab('dataOverview')" href="#" role="tab">數據總表</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeTab === 'gameStatistics' }" @click="changeTab('gameStatistics')" href="#" role="tab">遊戲統計</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeTab === 'promotionStatistics' }" @click="changeTab('promotionStatistics')" href="#" role="tab">優惠統計</a>
                  </li>
                </ul>

                <div class="tab-content mt-3">
                  <div class="tab-pane fade show active">
                    <div class="row" v-if="activeTab === 'dataOverview'">
                      <div class="col-md-6 mb-3">
                        <label for="startDate" class="form-label">開始時間</label>
                        <input type="date" class="form-control" id="startDate" v-model="searchForm.startDate" />
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="endDate" class="form-label">結束時間</label>
                        <input type="date" class="form-control" id="endDate" v-model="searchForm.endDate" />
                      </div>
                    </div>
                    <div class="row" v-else-if="activeTab === 'gameStatistics'">
                      <div class="col-md-3 mb-3">
                        <label for="startDate" class="form-label">開始時間</label>
                        <input type="date" class="form-control" id="startDate" v-model="searchForm.startDate" />
                      </div>
                      <div class="col-md-3 mb-3">
                        <label for="endDate" class="form-label">結束時間</label>
                        <input type="date" class="form-control" id="endDate" v-model="searchForm.endDate" />
                      </div>
                      <div class="col-md-3 mb-3">
                        <label for="gamePlatform" class="form-label">遊戲平台</label>
                        <select class="form-select" id="gamePlatform" v-model="searchForm.gamePlatform">
                          <option value="">請選擇</option>
                          <option v-for="platform in gamePlatforms" :key="platform.value" :value="platform.value">
                            {{ platform.label }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-3 mb-3">
                        <label for="gameType" class="form-label">遊戲類型</label>
                        <input type="text" class="form-control" id="gameType" v-model="searchForm.gameType" />
                      </div>
                    </div>
                    <div class="row" v-else-if="activeTab === 'promotionStatistics'">
                      <!-- Add promotion statistics specific filters here -->
                      <div class="col-md-4 mb-3">
                        <label for="promotionName" class="form-label">優惠名稱</label>
                        <input type="text" class="form-control" id="promotionName" v-model="searchForm.promotionName" />
                      </div>
                      <div class="col-md-4 mb-3">
                        <label for="startDate" class="form-label">開始時間</label>
                        <input type="date" class="form-control" id="startDate" v-model="searchForm.startDate" />
                      </div>
                      <div class="col-md-4 mb-3">
                        <label for="endDate" class="form-label">結束時間</label>
                        <input type="date" class="form-control" id="endDate" v-model="searchForm.endDate" />
                      </div>
                    </div>
                    <div class="mt-3">
                      <button type="submit" class="btn btn-primary me-2" @click="performSearch">
                        搜索
                      </button>
                      <button type="button" class="btn btn-secondary" @click="resetSearch">
                        重置
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">{{ activeTab === 'dataOverview' ? '數據總表' : activeTab === 'gameStatistics' ? '遊戲統計' : '優惠統計' }}</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="dataTable">
                    <thead>
                      <tr>
                        <template v-for="column in tableColumns[activeTab]" :key="column.key">
                          <th v-if="!column.subColumns">{{ column.label }}</th>
                          <template v-else>
                            <th v-for="subColumn in column.subColumns" :key="`${column.key}-${subColumn.key}`">
                              {{ `${column.label} - ${subColumn.label}` }}
                            </th>
                          </template>
                        </template>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, index) in tableData" :key="index">
                        <template v-for="column in tableColumns[activeTab]" :key="column.key">
                          <td v-if="!column.subColumns">{{ row[column.key] }}</td>
                          <template v-else>
                            <td v-for="subColumn in column.subColumns" :key="`${column.key}-${subColumn.key}`">
                              {{ row[column.key]?.[subColumn.key] }}
                            </td>
                          </template>
                        </template>
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
