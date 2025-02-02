<script>
import { onMounted, ref } from "vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
    apexchart: VueApexCharts,
  },
  setup() {
    const depositChartOptions = ref(null);
    const withdrawalChartOptions = ref(null);
    const visitsChartOptions = ref(null);
    const registrationsChartOptions = ref(null);

    onMounted(() => {
      initDepositChart();
      initWithdrawalChart();
      initVisitsChart();
      initRegistrationsChart();
    });

    const initDepositChart = () => {
      depositChartOptions.value = {
        series: [{
          name: '第三方支付',
          data: [31, 40, 28, 51, 42, 109, 100]
        }, {
          name: '虛擬貨幣',
          data: [11, 32, 45, 32, 34, 52, 41]
        }, {
          name: '電子錢包',
          data: [15, 11, 32, 18, 9, 24, 11]
        }],
        chart: {
          height: 350,
          type: 'bar',
          stacked: true
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ["2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05", "2023-07-06", "2023-07-07"],
        },
        yaxis: {
          title: {
            text: '金額'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val
            }
          }
        },
        title: {
          text: '存款額圖表',
          align: 'left'
        },
      };
    };

    const initWithdrawalChart = () => {
      withdrawalChartOptions.value = {
        series: [{
          name: '電子錢包',
          data: [30, 40, 35, 50, 49, 60, 70]
        }],
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        xaxis: {
          categories: ["2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05", "2023-07-06", "2023-07-07"]
        },
        yaxis: {
          title: {
            text: '金額'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: "vertical",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          },
        },
        title: {
          text: '提款額圖表',
          align: 'left'
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val
            }
          }
        }
      };
    };

    const initVisitsChart = () => {
      visitsChartOptions.value = {
        series: [{
          name: '人次量',
          data: [120, 150, 180, 200, 170, 190, 210]
        }],
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        xaxis: {
          categories: ["2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05", "2023-07-06", "2023-07-07"]
        },
        yaxis: {
          title: {
            text: '人數'
          }
        },
        fill: {
          opacity: 1
        },
        title: {
          text: '人次量圖表',
          align: 'left'
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " 人"
            }
          }
        }
      };
    };

    const initRegistrationsChart = () => {
      registrationsChartOptions.value = {
        series: [{
          name: '註冊量',
          data: [20, 25, 30, 35, 28, 32, 40]
        }],
        chart: {
          height: 350,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            columnWidth: '50%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        xaxis: {
          categories: ["2023-07-01", "2023-07-02", "2023-07-03", "2023-07-04", "2023-07-05", "2023-07-06", "2023-07-07"]
        },
        yaxis: {
          title: {
            text: '人數'
          }
        },
        fill: {
          opacity: 1
        },
        title: {
          text: '註冊量圖表',
          align: 'left'
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " 人"
            }
          }
        }
      };
    };

    return {
      depositChartOptions,
      withdrawalChartOptions,
      visitsChartOptions,
      registrationsChartOptions
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
          <div class="col-12 col-xl-6 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <apexchart v-if="depositChartOptions && depositChartOptions.series" type="bar" height="350" :options="depositChartOptions" :series="depositChartOptions.series"></apexchart>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <apexchart v-if="withdrawalChartOptions && withdrawalChartOptions.series" type="bar" height="350" :options="withdrawalChartOptions" :series="withdrawalChartOptions.series"></apexchart>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <apexchart v-if="visitsChartOptions && visitsChartOptions.series" type="bar" height="350" :options="visitsChartOptions" :series="visitsChartOptions.series"></apexchart>
              </div>
            </div>
          </div>
          <div class="col-12 col-xl-6 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <apexchart v-if="registrationsChartOptions && registrationsChartOptions.series" type="bar" height="350" :options="registrationsChartOptions" :series="registrationsChartOptions.series"></apexchart>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>
