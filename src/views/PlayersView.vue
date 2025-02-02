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
      playerType: "",
      startDate: "",
      endDate: "",
      account: "",
      warningLevel: "",
      address: "",
      realName: "",
      email: "",
      btag: "",
      playerStatus: "",
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
      { key: "currency", label: "幣別" },
      { key: "account", label: "帳號" },
      { key: "warningLevel", label: "警告級別" },
      { key: "playerLevel", label: "玩家級別" },
      { key: "bTag", label: "BTag" },
      { key: "sourceUrl", label: "來源網址" },
      { key: "balance", label: "額度" },
      { key: "bonusBalance", label: "獎金帳戶額度" },
      { key: "type", label: "類型" },
      { key: "name", label: "真實姓名" },
      { key: "address", label: "地址" },
      { key: "registrationTime", label: "開戶時間" },
      { key: "lastLoginTime", label: "上次登陸時間" },
      { key: "actions", label: "操作" },
      { key: "status", label: "狀態" },
      { key: "remarks", label: "備註" },
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
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
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#gamerList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label,
          render: (data, type, row) => {
            if (column.key === "actions") {
              return `<a href="/players/${row.id}" class="btn btn-link p-0">
                        <i class="material-icons">edit</i>
                      </a>`;
            }
            if (column.key === "warningLevel") {
              const warningLevels = {
                none: "無警告",
                Low: "一級警告",
                Medium: "二級警告",
                High: "三級警告",
              };
              return warningLevels[data] || data;
            }
            if (column.key === "playerLevel") {
              const playerLevels = {
                Beginner: "新手",
                Intermediate: "中級",
                Advanced: "進階",
                Expert: "專家",
              };
              return playerLevels[data] || data;
            }
            if (column.key === "type") {
              const types = {
                normal: "一般",
                vip: "VIP",
              };
              return types[data] || data;
            }
            if (column.key === "status") {
              const statuses = {
                active: "啟用",
                inactive: "停用",
                suspended: "暫停",
              };
              return statuses[data] || data;
            }
            return data;
          },
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        fixedHeader: true,
        fixedColumns:   {
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
                <h6 class="card-title">玩家搜索</h6>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="playerType" class="form-label">玩家類型</label>
                    <select
                      class="form-select"
                      id="playerType"
                      v-model="searchForm.playerType"
                    >
                      <option value="">全部</option>
                      <option value="normal">一般</option>
                      <option value="vip">VIP</option>
                    </select>
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
                    <label for="warningLevel" class="form-label"
                      >警告級別</label
                    >
                    <select
                      class="form-select"
                      id="warningLevel"
                      v-model="searchForm.warningLevel"
                    >
                      <option value="">全部</option>
                      <option value="none">無警告</option>
                      <option value="Low">一級警告</option>
                      <option value="Medium">二級警告</option>
                      <option value="High">三級警告</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="address" class="form-label">地址</label>
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      v-model="searchForm.address"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="realName" class="form-label">真實姓名</label>
                    <input
                      type="text"
                      class="form-control"
                      id="realName"
                      v-model="searchForm.realName"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="email" class="form-label">信箱</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="searchForm.email"
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
                    <label for="playerStatus" class="form-label"
                      >玩家狀態</label
                    >
                    <select
                      class="form-select"
                      id="playerStatus"
                      v-model="searchForm.playerStatus"
                    >
                      <option value="">全部</option>
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
                      <option value="suspended">暫停</option>
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
                <h6 class="card-title">玩家列表</h6>
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
