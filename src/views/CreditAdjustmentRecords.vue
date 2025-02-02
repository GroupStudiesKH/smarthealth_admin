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
      status: "",
      purpose: "",
      startTime: "",
      endTime: ""
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
      { key: "orderNumber", label: "單號" },
      { key: "account", label: "帳號" },
      { key: "status", label: "狀態" },
      { key: "currency", label: "幣別" },
      { key: "purpose", label: "用途" },
      { key: "beforeAmount", label: "操作前金額" },
      { key: "operationAmount", label: "操作金額" },
      { key: "afterAmount", label: "操作後金額" },
      { key: "createdAt", label: "加入時間" },
      { key: "proposer", label: "提案人" },
      { key: "remark", label: "備註" },
      { key: "reviewTime", label: "審核時間" },
      { key: "reviewRemark", label: "審核備註" },
      { key: "reviewer", label: "審核人" },
      { key: "actions", label: "操作" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          orderNumber: `ORD${String(index + 1).padStart(6, '0')}`,
          account: `player${index + 1}`,
          status: Math.random() > 0.5 ? "已完成" : "處理中",
          currency: ["USD", "EUR", "CNY"][Math.floor(Math.random() * 3)],
          purpose: ["提升額度", "降低額度", "凍結額度"][Math.floor(Math.random() * 3)],
          beforeAmount: Math.floor(Math.random() * 10000),
          operationAmount: Math.floor(Math.random() * 1000),
          afterAmount: Math.floor(Math.random() * 11000),
          createdAt: new Date(Date.now() - Math.random() * 31536000000).toLocaleString(),
          proposer: `admin${Math.floor(Math.random() * 5) + 1}`,
          remark: "一般調整",
          reviewTime: new Date(Date.now() - Math.random() * 31536000000).toLocaleString(),
          reviewRemark: "核准",
          reviewer: `reviewer${Math.floor(Math.random() * 3) + 1}`,
          actions: ''
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch credit adjustment records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#creditAdjustmentRecords", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          render: column.key === 'actions' ? (data) => data : null
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
                <h6 class="card-title">額度調整記錄搜索</h6>

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
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="searchForm.status"
                    >
                      <option value="">請選擇</option>
                      <option value="pending">處理中</option>
                      <option value="completed">已完成</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="purpose" class="form-label">用途</label>
                    <select
                      class="form-select"
                      id="purpose"
                      v-model="searchForm.purpose"
                    >
                      <option value="">請選擇</option>
                      <option value="increase">提升額度</option>
                      <option value="decrease">降低額度</option>
                      <option value="freeze">凍結額度</option>
                    </select>
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
                <h6 class="card-title">額度調整記錄列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="creditAdjustmentRecords">
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
