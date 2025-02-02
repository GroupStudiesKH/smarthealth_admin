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
      btag: "",
      excludeDisabledPlayers: false,
      onlyBettingAccounts: false,
      onlyAccountsWithData: false,
      onlyAccountsWithoutAgent: false,
    });

    // Initialize searchForm from URL parameters
    const initSearchForm = () => {
      Object.keys(searchForm).forEach(key => {
        if (route.query[key]) {
          if (typeof searchForm[key] === 'boolean') {
            searchForm[key] = route.query[key] === 'true';
          } else {
            searchForm[key] = route.query[key];
          }
        }
      });
    };

    const resetSearch = () => {
      Object.keys(searchForm).forEach((key) => {
        if (typeof searchForm[key] === 'boolean') {
          searchForm[key] = false;
        } else {
          searchForm[key] = "";
        }
      });
      updateURL();
    };

    const updateURL = () => {
      const queryParams = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {
        if (value !== "" && value !== false) {
          queryParams.append(key, value);
        }
      });
      const newURL = `${window.location.pathname}?${queryParams.toString()}`;
      window.location.href = newURL;
    };

    const tableColumns = reactive([
      { key: "account", label: "帳號" },
      { key: "playerLevel", label: "玩家等級" },
      { key: "registrationDate", label: "註冊日期" },
      { key: "depositAmount", label: "存款額" },
      { key: "withdrawalAmount", label: "提款額" },
      { key: "depositWithdrawalDifference", label: "存提差" },
      { key: "totalValidBetAmount", label: "總有效投注額" },
      { key: "totalPayoutValue", label: "總派彩值" },
      { key: "ggr", label: "GGR" },
      { key: "platformPromotion", label: "站台優惠" },
      { key: "freeSpinBonus", label: "免費轉獎金" },
      { key: "platformFee", label: "平台費" },
      { key: "paymentProcessingFee", label: "金流手續費" },
      { key: "ngr", label: "NGR" },
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Mock data (replace with actual API call)
        tableData.value = [
          {
            account: "player1",
            playerLevel: "VIP",
            registrationDate: "2023-05-01",
            depositAmount: 10000,
            withdrawalAmount: 8000,
            depositWithdrawalDifference: 2000,
            totalValidBetAmount: 50000,
            totalPayoutValue: 48000,
            ggr: 2000,
            platformPromotion: 500,
            freeSpinBonus: 200,
            platformFee: 100,
            paymentProcessingFee: 50,
            ngr: 1150,
          },
          {
            account: "player2",
            playerLevel: "Silver",
            registrationDate: "2023-04-15",
            depositAmount: 5000,
            withdrawalAmount: 4500,
            depositWithdrawalDifference: 500,
            totalValidBetAmount: 25000,
            totalPayoutValue: 24000,
            ggr: 1000,
            platformPromotion: 300,
            freeSpinBonus: 100,
            platformFee: 50,
            paymentProcessingFee: 25,
            ngr: 525,
          },
        ];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch player data:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#salesReportTable", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
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
                <h6 class="card-title">銷售報表</h6>

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
                    <label for="startDate" class="form-label">開始期間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      v-model="searchForm.startDate"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="endDate" class="form-label">結束期間</label>
                    <input
                      type="date"
                      class="form-control"
                      id="endDate"
                      v-model="searchForm.endDate"
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
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="excludeDisabledPlayers"
                        v-model="searchForm.excludeDisabledPlayers"
                      />
                      <label class="form-check-label" for="excludeDisabledPlayers">
                        排除禁用玩家
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="onlyBettingAccounts"
                        v-model="searchForm.onlyBettingAccounts"
                      />
                      <label class="form-check-label" for="onlyBettingAccounts">
                        僅查詢有投注帳號
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="onlyAccountsWithData"
                        v-model="searchForm.onlyAccountsWithData"
                      />
                      <label class="form-check-label" for="onlyAccountsWithData">
                        僅查詢有數據帳號
                      </label>
                    </div>
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="onlyAccountsWithoutAgent"
                        v-model="searchForm.onlyAccountsWithoutAgent"
                      />
                      <label class="form-check-label" for="onlyAccountsWithoutAgent">
                        僅查詢沒有代理的帳號
                      </label>
                    </div>
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
                <h6 class="card-title">銷售報表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="salesReportTable">
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
