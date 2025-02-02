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
      isEnabled: "",
      pageSize: 10,
      bonusType: "",
      bonusTitle: "",
      platform: "",
      createdAtStart: "",
      createdAtEnd: ""
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
      { key: "bonusType", label: "優惠類型" },
      { key: "platform", label: "遊戲平台" },
      { key: "groupId", label: "Group ID" },
      { key: "bonusTitle", label: "優惠標題" },
      { key: "percentage", label: "存送百分比" },
      { key: "multiplier", label: "存送流水倍數" },
      { key: "maxAmount", label: "最大額度" },
      { key: "startTime", label: "啟用開始時間" },
      { key: "endTime", label: "啟用結束時間" },
      { key: "frequency", label: "次數" },
      { key: "level", label: "等級" },
      { key: "warningLevel", label: "警告級別" },
      { key: "openBtag", label: "開放Btag" },
      { key: "status", label: "狀態" },
      { key: "createdAt", label: "創建時間" },
      { key: "operator", label: "操作人" },
      { key: "actions", label: "操作" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          bonusType: ["存款優惠", "首存優惠", "VIP優惠"][Math.floor(Math.random() * 3)],
          platform: ["AG", "BBIN", "WM", "PG"][Math.floor(Math.random() * 4)],
          groupId: `G${Math.floor(Math.random() * 1000)}`,
          bonusTitle: `優惠活動 ${index + 1}`,
          percentage: `${Math.floor(Math.random() * 50)}%`,
          multiplier: Math.floor(Math.random() * 20) + 5,
          maxAmount: Math.floor(Math.random() * 10000),
          startTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          endTime: new Date(Date.now() + Math.random() * 10000000000).toLocaleString(),
          frequency: `${Math.floor(Math.random() * 5)}次/天`,
          level: ["VIP1", "VIP2", "VIP3"][Math.floor(Math.random() * 3)],
          warningLevel: ["低", "中", "高"][Math.floor(Math.random() * 3)],
          openBtag: Math.random() > 0.5 ? "是" : "否",
          status: ["啟用", "停用"][Math.floor(Math.random() * 2)],
          createdAt: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          operator: ["admin1", "admin2", "admin3"][Math.floor(Math.random() * 3)],
          actions: ""
        }));

        tableData.value = mockData;
        totalRecords.value = 100; // Mock total records
      } catch (error) {
        console.error("Failed to fetch bonus records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#bonusRecordsList", {
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
              placeholder: "搜索優惠",
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

    const addNewBonus = () => {
      router.push('/add-bonus');
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
      addNewBonus
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
                  <h6 class="card-title">自助存送優惠搜索</h6>
                  <button class="btn btn-primary" @click="addNewBonus">
                    新增優惠配置
                  </button>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="isEnabled" class="form-label">是否開啟</label>
                    <select
                      class="form-select"
                      id="isEnabled"
                      v-model="searchForm.isEnabled"
                    >
                      <option value="">全部</option>
                      <option value="1">開啟</option>
                      <option value="0">關閉</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="bonusType" class="form-label">優惠類型</label>
                    <select
                      class="form-select"
                      id="bonusType"
                      v-model="searchForm.bonusType"
                    >
                      <option value="">全部</option>
                      <option value="deposit">存款優惠</option>
                      <option value="first">首存優惠</option>
                      <option value="vip">VIP優惠</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="bonusTitle" class="form-label">優惠標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="bonusTitle"
                      v-model="searchForm.bonusTitle"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="platform" class="form-label">遊戲平台</label>
                    <select
                      class="form-select"
                      id="platform"
                      v-model="searchForm.platform"
                    >
                      <option value="">全部</option>
                      <option value="AG">AG</option>
                      <option value="BBIN">BBIN</option>
                      <option value="WM">WM</option>
                      <option value="PG">PG</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">創建時間</label>
                    <div class="d-flex">
                      <input
                        type="datetime-local"
                        class="form-control me-2"
                        v-model="searchForm.createdAtStart"
                      />
                      <span class="align-self-center">至</span>
                      <input
                        type="datetime-local"
                        class="form-control ms-2"
                        v-model="searchForm.createdAtEnd"
                      />
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
                <h6 class="card-title">自助存送優惠列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="bonusRecordsList">
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
