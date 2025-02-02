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
      proposalType: "",
      proposalStatus: "",
      playerType: "",
      account: "",
      proposer: "",
      proposalNumber: "",
      platform: "",
      securityLevel: "",
      startDate: "",
      endDate: "",
      isOvertime: "",
      remarks: "",
      promotionTitle: "",
      btag: "",
      currency: "",
      excludeDisabled: false
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
        if(key === 'excludeDisabled') {
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
        if (value) {
          queryParams.append(key, value);
        }
      });
      const newURL = `${window.location.pathname}?${queryParams.toString()}`;
      window.location.href = newURL;
    };

    const tableColumns = reactive([
      { key: "proposalNumber", label: "提案號" },
      { key: "proposer", label: "提案人" },
      { key: "playerType", label: "玩家類型" },
      { key: "proposalType", label: "提案類型" },
      { key: "proposalStatus", label: "提案狀態" },
      { key: "account", label: "帳號" },
      { key: "securityLevel", label: "安全等級" },
      { key: "btag", label: "BTag" },
      { key: "playerCurrency", label: "玩家幣別" },
      { key: "mediaName", label: "媒體名稱" },
      { key: "playerAmount", label: "玩家金額" },
      { key: "mainCurrency", label: "主幣別" },
      { key: "mainCurrencyAmount", label: "主貨幣實際金額" },
      { key: "platform", label: "提案平台" },
      { key: "gameType", label: "遊戲類型" },
      { key: "addTime", label: "加入時間" },
      { key: "executeTime", label: "執行時間" },
      { key: "executeDuration", label: "執行用時" },
      { key: "isInstantPay", label: "是否秒付" },
      { key: "isSuccess", label: "是否成功" },
      { key: "playerLevel", label: "玩家等級" },
      { key: "isVerifiedAndInstant", label: "審核且秒付" },
      { key: "remarks", label: "備註" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          proposalNumber: `P${index + 1}`,
          proposer: `提案人${index + 1}`,
          playerType: `VIP${index + 1}`,
          proposalType: `優惠類型${index + 1}`,
          proposalStatus: index % 2 ? '已完成' : '處理中',
          account: `player${index + 1}`,
          securityLevel: `Level ${index + 1}`,
          btag: `btag${index + 1}`,
          playerCurrency: ['USD', 'EUR', 'CNY'][index % 3],
          mediaName: `媒體${index + 1}`,
          playerAmount: (1000 * (index + 1)).toFixed(2),
          mainCurrency: 'USD',
          mainCurrencyAmount: (800 * (index + 1)).toFixed(2),
          platform: `平台${index + 1}`,
          gameType: ['老虎機', '真人', '體育'][index % 3],
          addTime: new Date(Date.now() - index * 86400000).toLocaleString(),
          executeTime: new Date(Date.now() - index * 3600000).toLocaleString(),
          executeDuration: `${index + 1}分鐘`,
          isInstantPay: index % 2 ? '是' : '否',
          isSuccess: index % 3 ? '是' : '否',
          playerLevel: index + 1,
          isVerifiedAndInstant: index % 2 ? '是' : '否',
          remarks: `備註${index + 1}`
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch promotion records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#promotionRecordsList", {
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
                <h6 class="card-title">優惠記錄搜索</h6>

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
                    <label for="platform" class="form-label">提案平台</label>
                    <input
                      type="text"
                      class="form-control"
                      id="platform"
                      v-model="searchForm.platform"
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
                        id="excludeDisabled"
                        v-model="searchForm.excludeDisabled"
                      />
                      <label class="form-check-label" for="excludeDisabled">
                        排除禁用玩家
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
                <h6 class="card-title">優惠記錄列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="promotionRecordsList">
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
