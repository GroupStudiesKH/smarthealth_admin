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
      transferType: "",
      proposalStatus: "",
      source: "",
      target: "",
      startDate: "",
      endDate: "",
      account: "",
      playerCurrency: "",
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
      { key: "transferId", label: "轉帳編號" },
      { key: "account", label: "帳號" },
      { key: "playerCurrency", label: "玩家幣別" },
      { key: "recordStatus", label: "紀錄狀態" },
      { key: "source", label: "來源" },
      { key: "target", label: "目標" },
      { key: "amountChange", label: "額度變動" },
      { key: "balanceBefore", label: "改變前額度" },
      { key: "balanceAfter", label: "改變後額度" },
      { key: "createdAt", label: "加入時間" },
      { key: "remarks", label: "備註" },
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      // 假資料 JSON
      const fakeData = [
        {
          transferId: "TRF001",
          account: "user1",
          playerCurrency: "USD",
          recordStatus: "完成",
          source: "銀行",
          target: "遊戲帳戶",
          amountChange: 1000,
          balanceBefore: 500,
          balanceAfter: 1500,
          createdAt: "2023-05-01 10:00:00",
          remarks: "首次充值"
        },
        {
          transferId: "TRF002",
          account: "user2",
          playerCurrency: "EUR",
          recordStatus: "處理中",
          source: "遊戲帳戶",
          target: "銀行",
          amountChange: -500,
          balanceBefore: 2000,
          balanceAfter: 1500,
          createdAt: "2023-05-02 15:30:00",
          remarks: "提款申請"
        },
        // 可以繼續添加更多假資料...
      ];

      tableData.value = fakeData;
      totalRecords.value = fakeData.length;

      // 註解掉的原始 API 調用
      /*
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
      */
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
              placeholder: "搜索轉帳紀錄",
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
                <h6 class="card-title">本地轉帳紀錄查詢</h6>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="transferType" class="form-label">轉入/轉出</label>
                    <select
                      class="form-select"
                      id="transferType"
                      v-model="searchForm.transferType"
                    >
                      <option value="">全部</option>
                      <option value="in">轉入</option>
                      <option value="out">轉出</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="proposalStatus" class="form-label">提案狀態</label>
                    <select
                      class="form-select"
                      id="proposalStatus"
                      v-model="searchForm.proposalStatus"
                    >
                      <option value="">全部</option>
                      <option value="pending">待處理</option>
                      <option value="approved">已批准</option>
                      <option value="rejected">已拒絕</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="source" class="form-label">來源</label>
                    <input
                      type="text"
                      class="form-control"
                      id="source"
                      v-model="searchForm.source"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="target" class="form-label">目標</label>
                    <input
                      type="text"
                      class="form-control"
                      id="target"
                      v-model="searchForm.target"
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
                    <label for="account" class="form-label">帳號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="account"
                      v-model="searchForm.account"
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
                  <div class="col-md-3 mb-3">
                    <label for="pageSize" class="form-label">每頁</label>
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
                <h6 class="card-title">本地轉帳紀錄列表</h6>
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
