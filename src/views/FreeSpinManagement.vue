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
      gameProvider: "",
      orderNumber: "",
      name: "",
      player: "",
      status: "",
      startDate: "",
      endDate: ""
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
      searchForm.gameProvider = "";
      searchForm.orderNumber = "";
      searchForm.name = "";
      searchForm.player = "";
      searchForm.status = "";
      searchForm.startDate = "";
      searchForm.endDate = "";
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
      { key: "name", label: "名稱" },
      { key: "game", label: "遊戲" },
      { key: "player", label: "玩家" },
      { key: "status", label: "狀態" },
      { key: "remainingRounds", label: "剩餘回合數" },
      { key: "startTime", label: "開始時間" },
      { key: "endTime", label: "結束時間" },
      { key: "denomination", label: "面額" },
      { key: "details", label: "詳情" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Mock data
        tableData.value = [
          {
            orderNumber: "FS20240101001",
            name: "新年免費旋轉",
            game: "PragmaticPlay - Sweet Bonanza",
            player: "player001",
            status: "進行中",
            remainingRounds: "25",
            startTime: "2024-01-01 00:00:00",
            endTime: "2024-01-31 23:59:59",
            denomination: "1.00",
            details: "<button class='btn btn-info btn-sm'>詳情</button>"
          },
          {
            orderNumber: "FS20240102001",
            name: "週末狂歡",
            game: "BNG - Book of Gold",
            player: "player002",
            status: "未開始",
            remainingRounds: "50",
            startTime: "2024-01-05 00:00:00",
            endTime: "2024-01-07 23:59:59",
            denomination: "2.00",
            details: "<button class='btn btn-info btn-sm'>詳情</button>"
          }
        ];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#sourceUrlList", {
        data: tableData.value,
        columns: tableColumns.map((column) => ({
          data: column.key,
          title: column.label
        })),
        responsive: true,
        serverSide: true,
        processing: true,
        fixedHeader: true,
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
                <h6 class="card-title">免費旋轉管理</h6>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="gameProvider" class="form-label">遊戲廠商</label>
                    <select class="form-select" id="gameProvider" v-model="searchForm.gameProvider">
                      <option value="">全部</option>
                      <option value="PragmaticPlay">PragmaticPlay</option>
                      <option value="BNG">BNG</option>
                      <option value="Evolution">Evolution</option>
                      <option value="Microgaming">Microgaming</option>
                      <option value="NetEnt">NetEnt</option>
                    </select>
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="orderNumber" class="form-label">單號</label>
                    <input
                      type="text"
                      class="form-control"
                      id="orderNumber"
                      v-model="searchForm.orderNumber"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="name" class="form-label">名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="searchForm.name"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="player" class="form-label">玩家</label>
                    <input
                      type="text"
                      class="form-control"
                      id="player"
                      v-model="searchForm.player"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <select class="form-select" id="status" v-model="searchForm.status">
                      <option value="">全部</option>
                      <option value="pending">未開始</option>
                      <option value="active">進行中</option>
                      <option value="completed">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="startDate" class="form-label">開始時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="startDate"
                      v-model="searchForm.startDate"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="endDate" class="form-label">結束時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="endDate"
                      v-model="searchForm.endDate"
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
                <div class="table-responsive w-100">
                  <table class="table w-100" id="sourceUrlList">
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
