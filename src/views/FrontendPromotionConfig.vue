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
      name: "",
      startTime: "",
      endTime: "",
      status: ""
    });

    const showModal = ref(false);
    const showBonusModal = ref(false);
    const showNewConditionModal = ref(false);

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
      { key: "name", label: "名稱" },
      { key: "status", label: "狀態" },
      { key: "startTime", label: "開始時間" },
      { key: "endTime", label: "結束時間" },
      { key: "type", label: "適用種類" },
      { key: "note", label: "備註" },
      { key: "actions", label: "編輯" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Simulated data for demonstration
        const mockData = Array(10).fill(null).map((_, index) => ({
          name: `額度記錄${Math.floor(Math.random() * 1000)}`,
          status: ["啟用", "停用"][Math.floor(Math.random() * 2)],
          startTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          endTime: new Date(Date.now() + Math.random() * 10000000000).toLocaleString(),
          type: ["存款", "提款", "轉帳"][Math.floor(Math.random() * 3)],
          note: `備註說明${Math.floor(Math.random() * 100)}`,
          actions: ''
        }));

        tableData.value = mockData;
        totalRecords.value = 100;
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    const openBonusModal = () => {
      showBonusModal.value = true;
    };

    const openNewConditionModal = () => {
      showNewConditionModal.value = true;
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#promotionConfigList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          render: column.key === 'actions' ? (data, type, row) => {
            return '';
          } : null
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
        language: {
          search: "",
          sEmptyTable: "暫無資料",
          paginate: {
            previous: "上一頁",
            next: "下一頁",
          },
          info: "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
          lengthMenu: "顯示 _MENU_ 項結果",
        }
      });
    };

    const performSearch = () => {
      if (dataTable) {
        dataTable.ajax.reload();
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
      showModal,
      showBonusModal,
      showNewConditionModal,
      resetSearch,
      updateURL,
      performSearch,
      openBonusModal,
      openNewConditionModal
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
                  <h6 class="card-title">額度記錄 (戶內) 列表</h6>
                  <div>
                    <button class="btn btn-primary me-2" @click="openBonusModal">
                      獎金帳戶的流水條件
                    </button>
                    <button class="btn btn-primary" @click="openNewConditionModal">
                      新增條件設定
                    </button>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="name" class="form-label">名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="searchForm.name"
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
                    <label for="status" class="form-label">狀態</label>
                    <select
                      class="form-select"
                      id="status"
                      v-model="searchForm.status"
                    >
                      <option value="">全部</option>
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
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
                <div class="table-responsive w-100">
                  <table class="table w-100" id="promotionConfigList">
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
                          <span v-if="column.key !== 'actions'">{{ row[column.key] }}</span>
                          <button v-else class="btn btn-sm btn-primary">編輯</button>
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

    <!-- Bonus Account Modal -->
    <div class="modal" :class="{ 'd-block': showBonusModal }" tabindex="-1" v-if="showBonusModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">獎金帳戶的流水條件</h5>
            <button type="button" class="btn-close" @click="showBonusModal = false"></button>
          </div>
          <div class="modal-body">
            <p>尚未開放</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showBonusModal = false">關閉</button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Condition Modal -->
    <div class="modal" :class="{ 'd-block': showNewConditionModal }" tabindex="-1" v-if="showNewConditionModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">新增條件設定</h5>
            <button type="button" class="btn-close" @click="showNewConditionModal = false"></button>
          </div>
          <div class="modal-body">
            <p>尚未開放</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showNewConditionModal = false">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
