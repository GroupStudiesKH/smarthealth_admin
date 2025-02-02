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
      couponType: "",
      title: "",
      platform: "",
      promotionCode: "",
      status: "",
      tag: "",
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
      searchForm.couponType = "";
      searchForm.title = "";
      searchForm.platform = "";
      searchForm.promotionCode = "";
      searchForm.status = "";
      searchForm.tag = "";
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
      { key: "title", label: "標題" },
      { key: "promotionCode", label: "優惠活動代碼" },
      { key: "couponType", label: "優惠券類型" },
      { key: "platform", label: "平台" },
      { key: "depositPercent", label: "存送百分比" },
      { key: "flowMultiple", label: "流水倍數" },
      { key: "flowCondition", label: "流水條件" },
      { key: "depositLimit", label: "存款限制條件" },
      { key: "openLevel", label: "開放等級" },
      { key: "securityLevel", label: "安全等級" },
      { key: "maxBonus", label: "最高優惠" },
      { key: "minTransfer", label: "最低轉帳" },
      { key: "tag", label: "標籤" },
      { key: "validPeriod", label: "有效期" },
      { key: "createTime", label: "建立時間" },
      { key: "creator", label: "建立人" },
      { key: "updateTime", label: "修改時間" },
      { key: "updater", label: "修改人" },
      { key: "actions", label: "操作" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Mock data
        tableData.value = [
          {
            title: "新會員首存優惠",
            promotionCode: "NEW001",
            couponType: "首存優惠",
            platform: "全平台",
            depositPercent: "100%",
            flowMultiple: "20",
            flowCondition: "真人/電子",
            depositLimit: "最低100",
            openLevel: "VIP1",
            securityLevel: "中",
            maxBonus: "1000",
            minTransfer: "100",
            tag: "新會員專屬",
            validPeriod: "2024-01-01 ~ 2024-12-31",
            createTime: "2024-01-01 10:00:00",
            creator: "admin",
            updateTime: "2024-01-01 10:00:00",
            updater: "admin",
            actions: "<button class='btn btn-primary btn-sm'>編輯</button>"
          },
          {
            title: "老會員回饋金",
            promotionCode: "OLD001", 
            couponType: "回饋優惠",
            platform: "電子遊戲",
            depositPercent: "50%",
            flowMultiple: "15",
            flowCondition: "電子遊戲",
            depositLimit: "最低500",
            openLevel: "VIP2",
            securityLevel: "高",
            maxBonus: "2000",
            minTransfer: "500",
            tag: "老會員專屬",
            validPeriod: "2024-02-01 ~ 2024-12-31",
            createTime: "2024-01-15 14:30:00",
            creator: "admin",
            updateTime: "2024-01-15 14:30:00",
            updater: "admin",
            actions: "<button class='btn btn-primary btn-sm'>編輯</button>"
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
                <h6 class="card-title">優惠券管理</h6>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="couponType" class="form-label">優惠券類型</label>
                    <input
                      type="text"
                      class="form-control"
                      id="couponType"
                      v-model="searchForm.couponType"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      v-model="searchForm.title"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="platform" class="form-label">平台</label>
                    <input
                      type="text"
                      class="form-control"
                      id="platform"
                      v-model="searchForm.platform"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="promotionCode" class="form-label">優惠活動代碼</label>
                    <input
                      type="text"
                      class="form-control"
                      id="promotionCode"
                      v-model="searchForm.promotionCode"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <input
                      type="text"
                      class="form-control"
                      id="status"
                      v-model="searchForm.status"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="tag" class="form-label">標籤</label>
                    <input
                      type="text"
                      class="form-control"
                      id="tag"
                      v-model="searchForm.tag"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4 mb-3">
                    <label for="startDate" class="form-label">有效期間開始</label>
                    <input
                      type="date"
                      class="form-control"
                      id="startDate"
                      v-model="searchForm.startDate"
                    />
                  </div>
                  <div class="col-md-4 mb-3">
                    <label for="endDate" class="form-label">有效期間結束</label>
                    <input
                      type="date"
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
