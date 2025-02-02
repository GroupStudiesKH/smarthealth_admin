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
      startTime: "",
      endTime: "",
      orderStatus: "",
      reviewStatus: "",
      account: "",
      orderNumber: "",
      playerName: "",
      playerType: "",
      playerLevel: "",
      withdrawalAccount: "",
      btag: "",
      withdrawalChannel: "",
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
        searchForm[key] = "";
        if (key === 'excludeDisabled') {
          searchForm[key] = false;
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
      { key: "orderNumber", label: "訂單號" },
      { key: "withdrawalChannel", label: "提款通道" },
      { key: "account", label: "帳號" },
      { key: "playerLevel", label: "玩家等級" },
      { key: "btag", label: "BTag" },
      { key: "playerName", label: "玩家姓名" },
      { key: "playerCurrency", label: "玩家幣別" },
      { key: "requestAmount", label: "申請取款金額" },
      { key: "actualAmount", label: "實際提款金額" },
      { key: "thirdPartyFee", label: "第三方費用" },
      { key: "cryptoCurrency", label: "虛擬幣幣別" },
      { key: "exchangeRate", label: "匯率" },
      { key: "status", label: "狀態" },
      { key: "thirdPartyOrderId", label: "第三方交易編號" },
      { key: "withdrawalAccount", label: "提款帳號" },
      { key: "withdrawalCardNumber", label: "提款卡號" },
      { key: "createdAt", label: "創建時間" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          orderNumber: `WD${String(index + 1).padStart(8, '0')}`,
          withdrawalChannel: ['銀行卡', '支付寶', '微信'][Math.floor(Math.random() * 3)],
          account: `user${index + 1}@example.com`,
          playerLevel: ['VIP1', 'VIP2', 'VIP3'][Math.floor(Math.random() * 3)],
          btag: `BT${String(index + 1).padStart(6, '0')}`,
          playerName: `玩家${index + 1}`,
          playerCurrency: ['CNY', 'USD', 'EUR'][Math.floor(Math.random() * 3)],
          requestAmount: (Math.random() * 10000).toFixed(2),
          actualAmount: (Math.random() * 9000).toFixed(2),
          thirdPartyFee: (Math.random() * 100).toFixed(2),
          cryptoCurrency: ['BTC', 'ETH', 'USDT'][Math.floor(Math.random() * 3)],
          exchangeRate: (Math.random() * 10 + 20).toFixed(4),
          status: ['處理中', '已完成', '已拒絕'][Math.floor(Math.random() * 3)],
          thirdPartyOrderId: `TP${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
          withdrawalAccount: `6222********${String(index + 1).padStart(4, '0')}`,
          withdrawalCardNumber: `4242********${String(index + 1).padStart(4, '0')}`,
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleString()
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#withdrawalRecords", {
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
                <h6 class="card-title">提款記錄搜索</h6>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="orderStatus" class="form-label">訂單狀態</label>
                    <select
                      class="form-select"
                      id="orderStatus"
                      v-model="searchForm.orderStatus"
                    >
                      <option value="">請選擇</option>
                      <option value="pending">待處理</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="reviewStatus" class="form-label">審核狀態</label>
                    <select
                      class="form-select"
                      id="reviewStatus"
                      v-model="searchForm.reviewStatus"
                    >
                      <option value="">請選擇</option>
                      <option value="pending">待審核</option>
                      <option value="approved">已通過</option>
                      <option value="rejected">已拒絕</option>
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
                    <label for="orderNumber" class="form-label">訂單號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="orderNumber"
                      v-model="searchForm.orderNumber"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerName" class="form-label">玩家姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      id="playerName"
                      v-model="searchForm.playerName"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerType" class="form-label">玩家類型</label>
                    <select
                      class="form-select"
                      id="playerType"
                      v-model="searchForm.playerType"
                    >
                      <option value="">請選擇</option>
                      <option value="vip">VIP</option>
                      <option value="normal">一般會員</option>
                      <option value="agent">代理</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="playerLevel" class="form-label">玩家等級</label>
                    <select
                      class="form-select"
                      id="playerLevel"
                      v-model="searchForm.playerLevel"
                    >
                      <option value="">請選擇</option>
                      <option value="level1">Level 1</option>
                      <option value="level2">Level 2</option>
                      <option value="level3">Level 3</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="withdrawalAccount" class="form-label">提款帳號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="withdrawalAccount"
                      v-model="searchForm.withdrawalAccount"
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
                    <label for="withdrawalChannel" class="form-label">提款通道</label>
                    <input
                      type="text"
                      class="form-control"
                      id="withdrawalChannel"
                      v-model="searchForm.withdrawalChannel"
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
                <h6 class="card-title">提款記錄列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="withdrawalRecords">
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
