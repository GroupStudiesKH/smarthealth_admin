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
    const showModal = ref(false);
    const showRedPacketModal = ref(false);
    const couponForm = reactive({
      useTag: false,
      couponType: '',
      currency: 'USD',
      title: '',
      btag: '',
      percentage: '',
      flowMultiplier: '',
      flowCondition: '',
      maxAmount: '',
      minTransfer: '',
      validFrom: '',
      validTo: '',
      quantity: '',
      depositLimit: 'no_limit',
      playerList: '',
      language: '',
      template: '',
      messageContent: '尊敬的客戶，恭喜您獲得{{Percent}}%存送優惠券"{{Title}}"。優惠券：{{Shippingcode}}，最低存款金額：{{LowestTransfer}}，最高贈送金額：{{LimitMoney}}，提款流水倍數：{{BetMultiples}}，有效期至：{{Endtime}}，請您到優惠券專區進行使用，謝謝！',
      notes: '',
      tags: ''
    });

    const redPacketForm = reactive({
      useTag: false,
      couponType: '',
      currency: 'USD',
      title: '',
      btag: '',
      flowMultiplier: '',
      flowCondition: '',
      bonusAmount: '',
      validFrom: '',
      validTo: '',
      quantity: '',
      depositLimit: 'no_limit',
      playerList: '',
      language: '',
      template: '',
      messageContent: '尊敬的客戶，恭喜您獲得紅包優惠券"{{Title}}"。優惠券：{{Shippingcode}}，贈送金額：{{LimitMoney}}，提款流水倍數：{{BetMultiples}}，有效期至：{{Endtime}}，請您到優惠券專區進行使用，謝謝！',
      notes: '',
      tags: ''
    });

    const searchForm = reactive({
      isReceived: "",
      couponType: "",
      title: "",
      account: "",
      createTimeStart: "",
      createTimeEnd: "",
      distributeTimeStart: "", 
      distributeTimeEnd: "",
      receiveTimeStart: "",
      receiveTimeEnd: "",
      tags: "",
      pageSize: 10,
    });

    const closeModal = () => {
      showModal.value = false;
    };

    const closeRedPacketModal = () => {
      showRedPacketModal.value = false;
    };

    const submitCouponForm = () => {
      // Handle form submission
      console.log(couponForm);
      closeModal();
    };

    const submitRedPacketForm = () => {
      // Handle red packet form submission
      console.log(redPacketForm);
      closeRedPacketModal();
    };

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
      searchForm.pageSize = 10;
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
      { key: "couponType", label: "優惠券類型" },
      { key: "account", label: "帳號" },
      { key: "depositPercent", label: "存送百分比" },
      { key: "flowMultiplier", label: "流水倍數" },
      { key: "flowCondition", label: "流水條件" },
      { key: "depositLimit", label: "存款限制條件" },
      { key: "maxBonus", label: "最高優惠" },
      { key: "minTransfer", label: "最低轉帳" },
      { key: "validPeriod", label: "有效期" },
      { key: "couponInfo", label: "優惠券信息" },
      { key: "createTime", label: "創建時間" },
      { key: "distributor", label: "派發人" },
      { key: "distributeTime", label: "派發時間" },
      { key: "receiveTime", label: "領取時間" },
      { key: "actions", label: "維護" }
    ]);

    let dataTable;

    const fetchTableData = async (page = 1, pageSize = 10, search = "") => {
      try {
        // Fake data for now
        tableData.value = [
          {
            title: "新年存送優惠",
            couponType: "存送優惠券",
            account: "user123",
            depositPercent: "20%",
            flowMultiplier: "15倍",
            flowCondition: "真人視訊",
            depositLimit: "最低1000",
            maxBonus: "5000",
            minTransfer: "500",
            validPeriod: "7天",
            couponInfo: "新年特別優惠活動",
            createTime: "2024-01-01 10:00:00",
            distributor: "admin01",
            distributeTime: "2024-01-02 10:00:00",
            receiveTime: "2024-01-03 10:00:00",
            actions: ""
          },
          {
            title: "VIP專屬優惠",
            couponType: "紅包優惠券",
            account: "vip888",
            depositPercent: "30%",
            flowMultiplier: "20倍",
            flowCondition: "電子遊戲",
            depositLimit: "最低2000",
            maxBonus: "10000",
            minTransfer: "1000",
            validPeriod: "15天",
            couponInfo: "VIP會員專屬",
            createTime: "2024-01-05 14:00:00",
            distributor: "admin02", 
            distributeTime: "2024-01-06 09:00:00",
            receiveTime: "2024-01-06 10:30:00",
            actions: ""
          }
        ];
        totalRecords.value = tableData.value.length;
      } catch (error) {
        console.error("Failed to fetch coupon data:", error);
      }
    };

    const initializeDataTable = () => {
      dataTable = new DataTable("#couponList", {
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
              placeholder: "搜索優惠券",
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

    const addNewCoupon = () => {
      showModal.value = true;
    };

    const addNewRedPacket = () => {
      showRedPacketModal.value = true;
    };

    const viewDistributionHistory = () => {
      alert('功能尚未開放');
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
      addNewCoupon,
      addNewRedPacket,
      viewDistributionHistory,
      showModal,
      showRedPacketModal,
      couponForm,
      redPacketForm,
      closeModal,
      closeRedPacketModal,
      submitCouponForm,
      submitRedPacketForm
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
                  <h6 class="card-title">單一優惠券搜索</h6>
                  <div>
                    <button class="btn btn-primary me-2" @click="addNewCoupon">
                      新增優惠券
                    </button>
                    <button class="btn btn-danger me-2" @click="addNewRedPacket">
                      新增紅包優惠券
                    </button>
                    <button class="btn btn-info" @click="viewDistributionHistory">
                      優惠券批次派送紀錄
                    </button>
                  </div>
                </div>

                <!-- Coupon Modal -->
                <div class="modal-backdrop fade show" v-if="showModal"></div>
                <div class="modal" :class="{ 'd-block': showModal, 'show': showModal }" tabindex="-1" role="dialog">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">新增優惠券</h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="submitCouponForm">
                          <div class="mb-3">
                            <div class="d-flex justify-content-between mb-3">
                              <button type="button" class="btn btn-secondary" @click="closeModal">返回列表</button>
                              <button type="button" class="btn btn-primary">批量上傳</button>
                            </div>
                            
                            <div class="form-check mb-3">
                              <input class="form-check-input" type="checkbox" v-model="couponForm.useTag" id="useTag">
                              <label class="form-check-label" for="useTag">
                                是否以標籤派發優惠券
                              </label>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">優惠券類型</label>
                              <select class="form-select" v-model="couponForm.couponType" required>
                                <option value="">請選擇</option>
                                <option value="normal">一般優惠券</option>
                                <option value="redPacket">紅包優惠券</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">幣別</label>
                              <input type="text" class="form-control" v-model="couponForm.currency" readonly>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">標題 (英文逗號隔開，最多10組)</label>
                              <input type="text" class="form-control" v-model="couponForm.title" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">Btag</label>
                              <input type="text" class="form-control" v-model="couponForm.btag">
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">百分比 (%)</label>
                              <input type="number" class="form-control" v-model="couponForm.percentage" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">流水倍數</label>
                              <input type="number" class="form-control" v-model="couponForm.flowMultiplier" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">流水條件</label>
                              <select class="form-select" v-model="couponForm.flowCondition">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">最大額度</label>
                              <input type="number" class="form-control" v-model="couponForm.maxAmount" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">最低轉帳金額</label>
                              <input type="number" class="form-control" v-model="couponForm.minTransfer" required>
                            </div>

                            <div class="row mb-3">
                              <label class="form-label required">有效期</label>
                              <div class="col">
                                <input type="datetime-local" class="form-control" v-model="couponForm.validFrom" required>
                              </div>
                              <div class="col-auto">～</div>
                              <div class="col">
                                <input type="datetime-local" class="form-control" v-model="couponForm.validTo" required>
                              </div>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">數量</label>
                              <input type="number" class="form-control" v-model="couponForm.quantity" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">存款限制條件</label>
                              <select class="form-select" v-model="couponForm.depositLimit">
                                <option value="no_limit">無任何限制</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">玩家名單 (英文逗號分隔)</label>
                              <input type="text" class="form-control" v-model="couponForm.playerList">
                            </div>

                            <div class="mb-3">
                              <label class="form-label">語系</label>
                              <select class="form-select" v-model="couponForm.language">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">模板 (站內信模板查詢)</label>
                              <select class="form-select" v-model="couponForm.template">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">站內信內容</label>
                              <textarea class="form-control" v-model="couponForm.messageContent" rows="4"></textarea>
                              <small class="text-muted">以下括號請勿變動： {{Title}}為標題。 {{Percent}}為存送百分比。 {{Shippingcode}}為優惠卷代號。 {{LowestTransfer}}為最低存款金額。 {{LimitMoney}}為最大額度。 {{BetMultiples}}為流水倍數。 {{Endtime}}為到期日。</small>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">備註</label>
                              <textarea class="form-control" v-model="couponForm.notes" rows="3"></textarea>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">標籤 (英文逗號隔開，最多10組)</label>
                              <input type="text" class="form-control" v-model="couponForm.tags">
                            </div>
                          </div>

                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                            <button type="submit" class="btn btn-primary">提交</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- End Coupon Modal -->

                <!-- Red Packet Modal -->
                <div class="modal-backdrop fade show" v-if="showRedPacketModal"></div>
                <div class="modal" :class="{ 'd-block': showRedPacketModal, 'show': showRedPacketModal }" tabindex="-1" role="dialog">
                  <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">新增紅包優惠券</h5>
                        <button type="button" class="btn-close" @click="closeRedPacketModal"></button>
                      </div>
                      <div class="modal-body">
                        <form @submit.prevent="submitRedPacketForm">
                          <div class="mb-3">
                            <div class="d-flex justify-content-between mb-3">
                              <button type="button" class="btn btn-secondary" @click="closeRedPacketModal">返回列表</button>
                              <button type="button" class="btn btn-primary">批量上傳</button>
                            </div>
                            
                            <div class="form-check mb-3">
                              <input class="form-check-input" type="checkbox" v-model="redPacketForm.useTag" id="redPacketUseTag">
                              <label class="form-check-label" for="redPacketUseTag">
                                是否以標籤派發優惠券
                              </label>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">優惠券類型</label>
                              <select class="form-select" v-model="redPacketForm.couponType" required>
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">幣別</label>
                              <input type="text" class="form-control" v-model="redPacketForm.currency" readonly>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">標題 (英文逗號隔開，最多10組)</label>
                              <input type="text" class="form-control" v-model="redPacketForm.title" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">Btag</label>
                              <input type="text" class="form-control" v-model="redPacketForm.btag">
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">流水倍數</label>
                              <input type="number" class="form-control" v-model="redPacketForm.flowMultiplier" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">流水條件</label>
                              <select class="form-select" v-model="redPacketForm.flowCondition">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">贈送金額</label>
                              <input type="number" class="form-control" v-model="redPacketForm.bonusAmount" required>
                            </div>

                            <div class="row mb-3">
                              <label class="form-label required">有效期</label>
                              <div class="col">
                                <input type="datetime-local" class="form-control" v-model="redPacketForm.validFrom" required>
                              </div>
                              <div class="col-auto">～</div>
                              <div class="col">
                                <input type="datetime-local" class="form-control" v-model="redPacketForm.validTo" required>
                              </div>
                            </div>

                            <div class="mb-3">
                              <label class="form-label required">數量</label>
                              <input type="number" class="form-control" v-model="redPacketForm.quantity" required>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">存款限制條件</label>
                              <select class="form-select" v-model="redPacketForm.depositLimit">
                                <option value="no_limit">無任何限制</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">玩家名單 (英文逗號分隔)</label>
                              <input type="text" class="form-control" v-model="redPacketForm.playerList">
                            </div>

                            <div class="mb-3">
                              <label class="form-label">語系</label>
                              <select class="form-select" v-model="redPacketForm.language">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">模板 (站內信模板查詢)</label>
                              <select class="form-select" v-model="redPacketForm.template">
                                <option value="">請選擇</option>
                              </select>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">站內信內容</label>
                              <textarea class="form-control" v-model="redPacketForm.messageContent" rows="4"></textarea>
                              <small class="text-muted">以下括號請勿變動： {{Title}}為標題。 {{Shippingcode}}為優惠卷代號。 {{LimitMoney}}為贈送金額。 {{BetMultiples}}為流水倍數。 {{Endtime}}為到期日。</small>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">備註</label>
                              <textarea class="form-control" v-model="redPacketForm.notes" rows="3"></textarea>
                            </div>

                            <div class="mb-3">
                              <label class="form-label">標籤 (英文逗號隔開，最多10組)</label>
                              <input type="text" class="form-control" v-model="redPacketForm.tags">
                            </div>
                          </div>

                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeRedPacketModal">取消</button>
                            <button type="submit" class="btn btn-primary">提交</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- End Red Packet Modal -->

                <div class="row">
                  <div class="col-md-3 mb-3">
                    <label for="isReceived" class="form-label">是否領取</label>
                    <select class="form-select" id="isReceived" v-model="searchForm.isReceived">
                      <option value="">全部</option>
                      <option value="1">是</option>
                      <option value="0">否</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="couponType" class="form-label">優惠券類型</label>
                    <select class="form-select" id="couponType" v-model="searchForm.couponType">
                      <option value="">全部</option>
                      <option value="normal">一般優惠券</option>
                      <option value="redPacket">紅包優惠券</option>
                    </select>
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="title" class="form-label">標題</label>
                    <input type="text" class="form-control" id="title" v-model="searchForm.title" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="account" class="form-label">帳號</label>
                    <input type="text" class="form-control" id="account" v-model="searchForm.account" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="createTimeStart" class="form-label">創建時間(起)</label>
                    <input type="datetime-local" class="form-control" id="createTimeStart" v-model="searchForm.createTimeStart" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="createTimeEnd" class="form-label">創建時間(迄)</label>
                    <input type="datetime-local" class="form-control" id="createTimeEnd" v-model="searchForm.createTimeEnd" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="distributeTimeStart" class="form-label">派發時間(起)</label>
                    <input type="datetime-local" class="form-control" id="distributeTimeStart" v-model="searchForm.distributeTimeStart" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="distributeTimeEnd" class="form-label">派發時間(迄)</label>
                    <input type="datetime-local" class="form-control" id="distributeTimeEnd" v-model="searchForm.distributeTimeEnd" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="receiveTimeStart" class="form-label">領取時間(起)</label>
                    <input type="datetime-local" class="form-control" id="receiveTimeStart" v-model="searchForm.receiveTimeStart" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="receiveTimeEnd" class="form-label">領取時間(迄)</label>
                    <input type="datetime-local" class="form-control" id="receiveTimeEnd" v-model="searchForm.receiveTimeEnd" />
                  </div>
                  <div class="col-md-3 mb-3">
                    <label for="tags" class="form-label">標籤</label>
                    <input type="text" class="form-control" id="tags" v-model="searchForm.tags" />
                  </div>
                </div>
                <div class="mt-3">
                  <button type="submit" class="btn btn-primary me-2" @click="performSearch">
                    搜索
                  </button>
                  <button type="button" class="btn btn-secondary" @click="resetSearch">
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
                <h6 class="card-title">單一優惠券列表</h6>
                <div class="table-responsive w-100">
                  <table class="table w-100" id="couponList">
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
