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
      status: "",
      account: "",
      betMonth: "",
      betAmount: "",
      totalBetAmount: "",
      depositAmount: "",
      totalDepositAmount: "",
      processTime: "",
      originalLevel: "",
      newLevel: "",
      source: "",
      promotionBonus: "",
      recordNumber: "",
      remark: ""
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
      { key: "account", label: "帳號" },
      { key: "betAmount", label: "投注額" },
      { key: "totalBetAmount", label: "註冊總投注額" },
      { key: "depositAmount", label: "存款額" },
      { key: "totalDepositAmount", label: "註冊總存款額" },
      { key: "processTime", label: "處理時間" },
      { key: "originalLevel", label: "原級別" },
      { key: "newLevel", label: "新級別" },
      { key: "status", label: "狀態" },
      { key: "betMonth", label: "投注月份" },
      { key: "source", label: "申請來源" },
      { key: "promotionBonus", label: "已派發升級獎金" },
      { key: "recordNumber", label: "派發記錄編號" },
      { key: "remark", label: "備註" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          account: `user${Math.floor(Math.random() * 1000)}`,
          betAmount: Math.floor(Math.random() * 1000000),
          totalBetAmount: Math.floor(Math.random() * 5000000),
          depositAmount: Math.floor(Math.random() * 100000),
          totalDepositAmount: Math.floor(Math.random() * 500000),
          processTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          originalLevel: ["VIP1", "VIP2", "VIP3"][Math.floor(Math.random() * 3)],
          newLevel: ["VIP2", "VIP3", "VIP4"][Math.floor(Math.random() * 3)],
          status: ["待處理", "已完成", "已取消"][Math.floor(Math.random() * 3)],
          betMonth: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
          source: ["系統", "人工"][Math.floor(Math.random() * 2)],
          promotionBonus: Math.floor(Math.random() * 10000),
          recordNumber: `REC${Math.floor(Math.random() * 1000000)}`,
          remark: Math.random() > 0.5 ? "無" : "特殊情況"
        }));

        tableData.value = mockData;
        totalRecords.value = 100;
      } catch (error) {
        console.error("Failed to fetch level change records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#levelChangeList", {
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
              placeholder: "搜索",
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

    const showUpgradeStandard = () => {
      alert("功能未開放");
    };

    const showManualUpgrade = () => {
      alert("功能未開放");
    };

    const showBatchUpgrade = () => {
      alert("功能未開放");
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
      showUpgradeStandard,
      showManualUpgrade,
      showBatchUpgrade
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
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h6 class="card-title">玩家升降級搜索</h6>
                  <div>
                    <button class="btn btn-primary me-2" @click="showManualUpgrade">
                      手動補入升級紀錄
                    </button>
                    <button class="btn btn-primary me-2" @click="showBatchUpgrade">
                      執行批量升降級
                    </button>
                    <button class="btn btn-primary" @click="showUpgradeStandard">
                      設置晉級標準
                    </button>
                  </div>
                </div>

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
                    <label for="betMonth" class="form-label">投注月份</label>
                    <input
                      type="month"
                      class="form-control"
                      id="betMonth"
                      v-model="searchForm.betMonth"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="searchForm.status"
                    >
                      <option value="">全部</option>
                      <option value="pending">待處理</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="source" class="form-label">申請來源</label>
                    <select
                      class="form-select"
                      id="source"
                      v-model="searchForm.source"
                    >
                      <option value="">全部</option>
                      <option value="system">系統</option>
                      <option value="manual">人工</option>
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
                <h6 class="card-title">玩家升降級列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="levelChangeList">
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
