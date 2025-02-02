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
      event: "",
      startDate: "",
      endDate: "", 
      account: "",
      remarks: "",
      ip: ""
    });

    const eventOptions = [
      { value: "", label: "全部" },
      { value: "LOGIN", label: "登入" },
      { value: "MODIFY_PWD", label: "修改密碼" },
      { value: "MODIFY_CUS_INFO", label: "修改玩家資料" },
      { value: "WRONG_PWD", label: "密碼錯誤" },
      { value: "CREDIT_RECORD", label: "額度錯誤" },
      { value: "PWD_RETRIEVE", label: "密碼找回" },
      { value: "PWD_ERROR_5", label: "5次密碼錯誤帳戶禁用" },
      { value: "MODIFY_DW_PWD", label: "修改支付密碼" },
      { value: "RESET_DW_PWD", label: "重置支付密碼" },
      { value: "RESET_DW_PWD_GET_EMAIL_VERIFY_CODE", label: "重置支付密碼 - 獲取郵箱驗證碼" },
      { value: "RESET_DW_PWD_EMAIL_VALIDATE_SUCCESS", label: "重置支付密碼 - 電子郵箱驗證成功" },
      { value: "ADD_DW_PWD", label: "綁定支付密碼" },
      { value: "SYSTEM_SAFETY_LEVEL", label: "系統調整安全級別" },
      { value: "GET_PHONE_VALIDATE", label: "獲取手機驗證碼" },
      { value: "PHONE_VALIDATE_FAIL", label: "手機驗證碼錯誤" },
      { value: "MOBILE_REGISTER", label: "手機驗證成功" },
      { value: "DEPOSIT_FAILED", label: "存款失敗" },
      { value: "WITHDRAW_FAILED", label: "提款失敗" },
      { value: "ADD_KYC", label: "新增KYC文件" },
      { value: "ADD_CREDITCARD", label: "新增信用卡文件" },
      { value: "CHANGE_GBS_STATUS", label: "更改站內信狀態" }
    ];

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
      { key: "event", label: "事件" },
      { key: "timestamp", label: "發生時間" },
      { key: "remarks", label: "備註" },
      { key: "ip", label: "IP" }
    ]);

    let dataTable;

    const generateMockData = () => {
      const mockEvents = eventOptions.filter(opt => opt.value); // Remove empty option
      const mockData = Array(30).fill(null).map((_, index) => {
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        return {
          account: `player${Math.floor(Math.random() * 1000)}`,
          event: randomEvent.label,
          eventCode: randomEvent.value,
          timestamp: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
          remarks: `${randomEvent.label}操作`,
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        };
      });
      return mockData;
    };

    const mockDataset = ref(generateMockData());

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        let filteredData = [...mockDataset.value];
        
        // Apply filters
        if (searchForm.event) {
          filteredData = filteredData.filter(item => item.eventCode === searchForm.event);
        }
        if (searchForm.account) {
          filteredData = filteredData.filter(item => item.account.includes(searchForm.account));
        }
        if (searchForm.remarks) {
          filteredData = filteredData.filter(item => item.remarks.includes(searchForm.remarks));
        }
        if (searchForm.ip) {
          filteredData = filteredData.filter(item => item.ip.includes(searchForm.ip));
        }

        tableData.value = filteredData;
        totalRecords.value = filteredData.length;
      } catch (error) {
        console.error("Failed to fetch event records:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#eventsRecordsList", {
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
      eventOptions,
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
                <h6 class="card-title">玩家事件記錄搜索</h6>

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="event" class="form-label">事件</label>
                    <select
                      class="form-select"
                      id="event"
                      v-model="searchForm.event"
                    >
                      <option 
                        v-for="option in eventOptions" 
                        :key="option.value" 
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
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
                    <label for="remarks" class="form-label">備註</label>
                    <input
                      type="text" 
                      class="form-control"
                      id="remarks"
                      v-model="searchForm.remarks"
                    />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="ip" class="form-label">IP</label>
                    <input
                      type="text"
                      class="form-control" 
                      id="ip"
                      v-model="searchForm.ip"
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
                <h6 class="card-title">玩家事件紀錄列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="eventsRecordsList">
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
