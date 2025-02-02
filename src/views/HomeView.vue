<script>
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import apiService from "@/service/api-service.js";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const router = useRouter();

    const dailyStats = ref({
      newUsers: 245,
      totalBets: 12879,
      totalWagers: 987650,
      totalWinnings: 876543
    });

    const revenueData = ref([
      { month: '一月', revenue: 1250000, profit: 375000 },
      { month: '二月', revenue: 1380000, profit: 414000 },
      { month: '三月', revenue: 1420000, profit: 426000 },
      { month: '四月', revenue: 1650000, profit: 495000 }
    ]);

    const popularGames = ref([
      { name: '水果機', bets: 5689, revenue: 234567 },
      { name: '老虎機', bets: 3421, revenue: 156789 },
      { name: '捕魚機', bets: 2876, revenue: 98765 },
      { name: '麻將機', bets: 2345, revenue: 87654 },
      { name: '拉霸機', bets: 1987, revenue: 76543 }
    ]);

    const recentTransactions = ref([
      { id: 1, user: "player123", type: "存款", amount: 50000, time: "2024-01-15 14:30" },
      { id: 2, user: "vip888", type: "提款", amount: -30000, time: "2024-01-15 15:45" },
      { id: 3, user: "lucky777", type: "下注", amount: -10000, time: "2024-01-15 16:20" },
      { id: 4, user: "master66", type: "贏分", amount: 25000, time: "2024-01-15 17:15" },
      { id: 5, user: "golden99", type: "存款", amount: 100000, time: "2024-01-15 18:00" }
    ]);

    onMounted(() => {
      // 這裡可以加入初始化圖表的程式碼
    });

    return {
      dailyStats,
      revenueData,
      popularGames,
      recentTransactions
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
        <div class="row">
          <div class="col-12 col-xl-12 stretch-card">
            <div class="row flex-grow-1">
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">今日新增會員</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ dailyStats.newUsers }}</h3>
                        <div class="d-flex align-items-baseline">
                          <p class="text-success">
                            <span>+5.4%</span>
                            <i data-feather="arrow-up" class="icon-sm mb-1"></i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">今日投注次數</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ dailyStats.totalBets }}</h3>
                        <div class="d-flex align-items-baseline">
                          <p class="text-success">
                            <span>+2.8%</span>
                            <i data-feather="arrow-up" class="icon-sm mb-1"></i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">今日投注金額</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ dailyStats.totalWagers }}</h3>
                        <div class="d-flex align-items-baseline">
                          <p class="text-danger">
                            <span>-1.2%</span>
                            <i data-feather="arrow-down" class="icon-sm mb-1"></i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-3 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">今日派彩金額</h6>
                    <div class="row">
                      <div class="col-12">
                        <h3 class="mb-2">{{ dailyStats.totalWinnings }}</h3>
                        <div class="d-flex align-items-baseline">
                          <p class="text-success">
                            <span>+3.1%</span>
                            <i data-feather="arrow-up" class="icon-sm mb-1"></i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-lg-7 col-xl-8 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">營收趨勢</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>月份</th>
                        <th>營收</th>
                        <th>利潤</th>
                        <th>成長率</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="data in revenueData" :key="data.month">
                        <td>{{ data.month }}</td>
                        <td>{{ data.revenue }}</td>
                        <td>{{ data.profit }}</td>
                        <td>
                          <span class="badge bg-success">+{{ Math.floor(Math.random() * 10) }}%</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-5 col-xl-4 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">熱門遊戲排行</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>遊戲名稱</th>
                        <th>投注次數</th>
                        <th>營收</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="game in popularGames" :key="game.name">
                        <td>{{ game.name }}</td>
                        <td>{{ game.bets }}</td>
                        <td>{{ game.revenue }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">最近交易紀錄</h6>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>交易ID</th>
                        <th>用戶</th>
                        <th>類型</th>
                        <th>金額</th>
                        <th>時間</th>
                        <th>狀態</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="trans in recentTransactions" :key="trans.id">
                        <td>{{ trans.id }}</td>
                        <td>{{ trans.user }}</td>
                        <td>{{ trans.type }}</td>
                        <td :class="trans.amount >= 0 ? 'text-success' : 'text-danger'">
                          {{ trans.amount }}
                        </td>
                        <td>{{ trans.time }}</td>
                        <td><span class="badge bg-success">成功</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer/>
    </div>
  </div>
</template>
