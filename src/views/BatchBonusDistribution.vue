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
    const tableData = ref([
      {
        account: "player123",
        currency: "CNY", 
        amount: 1000,
        importTime: "2023-12-01 10:00:00",
        distributeAccount: "admin1",
        status: "已完成",
        startTime: "2023-12-01",
        endTime: "2023-12-31",
        minDeposit: 500,
        actualDeposit: 800,
        minTurnover: 5000,
        actualTurnover: 6000,
        remarks: "新年活動獎金"
      },
      {
        account: "player456",
        currency: "USD",
        amount: 500,
        importTime: "2023-12-02 11:30:00", 
        distributeAccount: "admin2",
        status: "處理中",
        startTime: "2023-12-02",
        endTime: "2023-12-31",
        minDeposit: 300,
        actualDeposit: 400,
        minTurnover: 3000,
        actualTurnover: 3500,
        remarks: "聖誕活動獎金"
      },
      {
        account: "player789",
        currency: "EUR",
        amount: 750,
        importTime: "2023-12-03 14:20:00",
        distributeAccount: "admin3", 
        status: "待處理",
        startTime: "2023-12-03",
        endTime: "2023-12-31",
        minDeposit: 400,
        actualDeposit: 600,
        minTurnover: 4000,
        actualTurnover: 4200,
        remarks: "週年慶獎金"
      },
      {
        account: "player101",
        currency: "JPY",
        amount: 10000,
        importTime: "2023-12-04 09:15:00",
        distributeAccount: "admin1",
        status: "已完成",
        startTime: "2023-12-04", 
        endTime: "2023-12-31",
        minDeposit: 5000,
        actualDeposit: 7000,
        minTurnover: 50000,
        actualTurnover: 55000,
        remarks: "生日獎金"
      }
    ]);

    const totalRecords = ref(tableData.value.length);
    const searchForm = reactive({
      proposalType: "",
      proposalStatus: "",
      playerType: "",
      account: "",
      proposer: "",
      proposalNumber: "",
      proposalPlatform: "",
      securityLevel: "",
      startDate: "",
      endDate: "",
      isOvertime: "",
      remarks: "",
      promotionTitle: "",
      btag: "",
      currency: "",
      excludeDisabledPlayers: false
    });

    const showModal = ref(false);

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
      if(dataTable) {
        dataTable.clear().rows.add(tableData.value).draw();
      }
    };

    const updateURL = () => {
      const queryParams = new URLSearchParams();
      Object.entries(searchForm).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });
      router.push({ query: Object.fromEntries(queryParams) });
    };

    const handleFileUpload = () => {
      showModal.value = true;
    };

    const tableColumns = reactive([
      { key: "account", label: "帳號" },
      { key: "currency", label: "玩家幣別" },
      { key: "amount", label: "金額" },
      { key: "importTime", label: "導入時間" },
      { key: "distributeAccount", label: "派發帳戶" },
      { key: "status", label: "狀態" },
      { key: "startTime", label: "開始時間" },
      { key: "endTime", label: "結束時間" },
      { key: "minDeposit", label: "最低存款" },
      { key: "actualDeposit", label: "實際存款" },
      { key: "minTurnover", label: "最低流水" },
      { key: "actualTurnover", label: "實際流水" },
      { key: "remarks", label: "備註" }
    ]);

    let dataTable;

    const initializeDataTable = () => {
      const table = document.querySelector("#batchBonusList");
      if (!table) return;

      dataTable = new DataTable("#batchBonusList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label
        })),
        responsive: true,
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
        const filteredData = tableData.value.filter(row => {
          return Object.keys(searchForm).every(key => {
            if (!searchForm[key]) return true;
            if (key === 'startDate' && searchForm[key]) {
              return new Date(row.importTime) >= new Date(searchForm[key]);
            }
            if (key === 'endDate' && searchForm[key]) {
              return new Date(row.importTime) <= new Date(searchForm[key]);
            }
            if (typeof row[key] === 'string') {
              return row[key].toLowerCase().includes(searchForm[key].toLowerCase());
            }
            return true;
          });
        });
        
        dataTable.clear().rows.add(filteredData).draw();
        updateURL();
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
      handleFileUpload,
      showModal
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
        <!-- File Upload Section -->
        <div class="row mb-4">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">獎金批量派發</h6>
                <div class="row">
                  <div class="col-md-6">
                    <input type="file" class="form-control" />
                  </div>
                  <div class="col-md-2">
                    <button class="btn btn-primary" @click="handleFileUpload">
                      導入優惠
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Section -->
        <div class="row mb-4">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">獎金批量派發搜尋</h6>
                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="proposalType" class="form-label">提案類型</label>
                    <input
                      type="text"
                      class="form-control"
                      id="proposalType"
                      v-model="searchForm.proposalType"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="proposalStatus" class="form-label">提案狀態</label>
                    <input
                      type="text"
                      class="form-control"
                      id="proposalStatus"
                      v-model="searchForm.proposalStatus"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerType" class="form-label">玩家類型</label>
                    <input
                      type="text"
                      class="form-control"
                      id="playerType"
                      v-model="searchForm.playerType"
                    />
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
                    <label for="proposer" class="form-label">提案人</label>
                    <input
                      type="text"
                      class="form-control"
                      id="proposer"
                      v-model="searchForm.proposer"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="proposalNumber" class="form-label">提案號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="proposalNumber"
                      v-model="searchForm.proposalNumber"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="proposalPlatform" class="form-label">提案平台</label>
                    <input
                      type="text"
                      class="form-control"
                      id="proposalPlatform"
                      v-model="searchForm.proposalPlatform"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="securityLevel" class="form-label">安全等級</label>
                    <input
                      type="text"
                      class="form-control"
                      id="securityLevel"
                      v-model="searchForm.securityLevel"
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
                    <label for="isOvertime" class="form-label">是否超時</label>
                    <input
                      type="text"
                      class="form-control"
                      id="isOvertime"
                      v-model="searchForm.isOvertime"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="remarks" class="form-label">備註</label>
                    <input
                      type="text"
                      class="form-control"
                      id="remarks"
                      v-model="searchForm.remarks"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="promotionTitle" class="form-label">優惠標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="promotionTitle"
                      v-model="searchForm.promotionTitle"
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
                    <label for="currency" class="form-label">幣別</label>
                    <input
                      type="text"
                      class="form-control"
                      id="currency"
                      v-model="searchForm.currency"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <div class="form-check mt-4">
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

        <!-- Results Table -->
        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">獎金批量派發列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="batchBonusList">
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

      <!-- Modal -->
      <div class="modal fade" v-if="showModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">提示</h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body">
              <p>未開放</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">關閉</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>
