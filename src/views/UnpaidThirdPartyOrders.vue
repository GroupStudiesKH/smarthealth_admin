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
      merchant: "",
      paymentOrderNumber: "",
      account: "",
      description: "",
      manualReview: "",
      orderStatus: "",
      currency: ""
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
      { key: "paymentOrderNumber", label: "支付單號" },
      { key: "paymentPlatform", label: "支付平台" },
      { key: "frontendDisplayName", label: "前台顯示名稱" },
      { key: "depositBank", label: "存款銀行" },
      { key: "depositBankCard", label: "存款銀行卡" },
      { key: "playerBank", label: "玩家使用銀行" },
      { key: "receivingBank", label: "收款銀行" },
      { key: "receivingBankAccount", label: "收款銀行卡號" },
      { key: "playerName", label: "玩家姓名" },
      { key: "playerCurrency", label: "玩家幣別" },
      { key: "transferAmount", label: "轉帳金額" },
      { key: "playerAmount", label: "玩家金額" },
      { key: "mainCurrency", label: "主幣別" },
      { key: "mainCurrencyAmount", label: "主貨幣實際金額" },
      { key: "exchangeRate", label: "匯率" },
      { key: "account", label: "帳號" },
      { key: "creditCardNumber", label: "信用卡號" },
      { key: "cardFirstName", label: "卡號名字" },
      { key: "cardLastName", label: "卡號姓氏" },
      { key: "applicationTime", label: "前台申請時間" },
      { key: "status", label: "狀態" },
      { key: "remarks", label: "備註" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          paymentOrderNumber: `PAY${String(index + 1).padStart(8, '0')}`,
          paymentPlatform: ['支付寶', '微信支付', '銀聯'][Math.floor(Math.random() * 3)],
          frontendDisplayName: `前台名稱${index + 1}`,
          depositBank: ['中國銀行', '工商銀行', '建設銀行'][Math.floor(Math.random() * 3)],
          depositBankCard: `6222********${String(index + 1).padStart(4, '0')}`,
          playerBank: ['招商銀行', '農業銀行', '交通銀行'][Math.floor(Math.random() * 3)],
          receivingBank: ['民生銀行', '浦發銀行', '興業銀行'][Math.floor(Math.random() * 3)],
          receivingBankAccount: `6225********${String(index + 1).padStart(4, '0')}`,
          playerName: `玩家${index + 1}`,
          playerCurrency: ['CNY', 'USD', 'EUR'][Math.floor(Math.random() * 3)],
          transferAmount: (Math.random() * 10000).toFixed(2),
          playerAmount: (Math.random() * 10000).toFixed(2),
          mainCurrency: 'CNY',
          mainCurrencyAmount: (Math.random() * 10000).toFixed(2),
          exchangeRate: (6 + Math.random()).toFixed(4),
          account: `user${index + 1}@example.com`,
          creditCardNumber: `4532********${String(index + 1).padStart(4, '0')}`,
          cardFirstName: `John${index + 1}`,
          cardLastName: `Doe${index + 1}`,
          applicationTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          status: ['待處理', '已完成', '已取消'][Math.floor(Math.random() * 3)],
          remarks: `備註說明${index + 1}`
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#depositRecords", {
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
                <h6 class="card-title">未支付第三方訂單</h6>

                <div class="row">
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
                    <label for="merchant" class="form-label">商戶</label>
                    <input
                      type="text"
                      class="form-control"
                      id="merchant"
                      v-model="searchForm.merchant"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="paymentOrderNumber" class="form-label">支付單號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="paymentOrderNumber"
                      v-model="searchForm.paymentOrderNumber"
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
                    <label for="description" class="form-label">備註</label>
                    <input
                      type="text"
                      class="form-control"
                      id="description"
                      v-model="searchForm.description"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="manualReview" class="form-label">人工審核</label>
                    <select
                      class="form-select"
                      id="manualReview"
                      v-model="searchForm.manualReview"
                    >
                      <option value="">請選擇</option>
                      <option value="yes">是</option>
                      <option value="no">否</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="orderStatus" class="form-label">訂單狀態</label>
                    <select
                      class="form-select"
                      id="orderStatus"
                      v-model="searchForm.orderStatus"
                    >
                      <option value="">請選擇</option>
                      <option value="success">成功</option>
                      <option value="failed">失敗</option>
                      <option value="processing">處理中</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="currency" class="form-label">幣別</label>
                    <select
                      class="form-select"
                      id="currency"
                      v-model="searchForm.currency"
                    >
                      <option value="">請選擇</option>
                      <option value="CNY">CNY</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
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
                <h6 class="card-title">未支付第三方訂單</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="depositRecords">
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
