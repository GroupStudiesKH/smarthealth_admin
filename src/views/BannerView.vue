<script>
import { onMounted, ref, reactive } from "vue";
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
    const tableData = ref([
      {
        id: 1,
        title: "夏季健康特惠活動",
        subtitle_1: "早鳥優惠",
        subtitle_2: "限時折扣",
        content: "立即註冊即可享受專業健康諮詢服務",
        status: "active",
        img_url: "https://picsum.photos/800/400",
        action_link_href: "#",
        action_link_text: "立即報名",
        sort: 1
      },
      {
        id: 2,
        title: "健康講座系列",
        subtitle_1: "專家分享",
        subtitle_2: "健康生活",
        content: "每週線上健康講座，名額有限",
        status: "active",
        img_url: "https://picsum.photos/800/400",
        action_link_href: "#",
        action_link_text: "查看詳情",
        sort: 2
      },
      {
        id: 3,
        title: "會員專屬優惠",
        subtitle_1: "限時特價",
        subtitle_2: "會員獨享",
        content: "會員專屬健康課程優惠",
        status: "inactive",
        img_url: "https://picsum.photos/800/400",
        action_link_href: "#",
        action_link_text: "了解更多",
        sort: 3
      }
    ]);

    const tableColumns = reactive([
      { key: "id", label: "編號" },
      { key: "title", label: "主要標題" },
      { key: "status", label: "狀態" },
      { key: "img_url", label: "圖片" },
      { key: "actions", label: "操作" },
    ]);

    const fetchTableData = async () => {
      // 使用假資料，不需要實際呼叫 API
      console.log("Using mock data instead of API call");
    };

    const deleteBanner = async (bannerId) => {
      if (confirm("確定要刪除這個 Banner 嗎？")) {
        // 模擬刪除操作
        tableData.value = tableData.value.filter(item => item.id !== bannerId);
        console.log(`Banner ${bannerId} deleted`);
      }
    };

    onMounted(() => {
      fetchTableData();
    });

    return {
      tableData,
      tableColumns,
      deleteBanner,
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
        <div class="row mb-3">
          <div class="col-12 text-end">
            <router-link to="/layout/banner/add" class="btn btn-primary">新增Banner</router-link>
          </div>
        </div>
        <div class="row">
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">Banner列表</h6>
                <div class="table-responsive">
                  <table class="table">
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
                          <template v-if="column.key === 'img_url'">
                            <img :src="row.img_url" alt="Banner Image" class="img-fluid rounded-0" style="max-width: 100px;">
                          </template>
                          <template v-else-if="column.key === 'actions'">
                            <a :href="`/layout/banner/edit/${row.id}`" class="btn btn-link p-0 me-2">
                              <i class="material-icons">edit</i>
                            </a>
                            <button @click="deleteBanner(row.id)" class="btn btn-link p-0">
                              <i class="material-icons">delete</i>
                            </button>
                          </template>
                          <template v-else-if="column.key === 'status'">
                            {{ row.status === 'active' ? '啟用' : '未啟用' }}
                          </template>
                          <template v-else>
                            {{ row[column.key] }}
                          </template>
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
