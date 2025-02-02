<script>
import { onMounted, ref, reactive } from "vue";
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
    const activeVipTab = ref('NEW');
    const activeLangTab = ref('EN');
    const showModal = ref(false);

    const vipLevels = [
      { id: 'NEW', label: '新規會員' },
      { id: 'VIP1', label: 'VIP1' },
      { id: 'VIP2', label: 'VIP2' }, 
      { id: 'VIP3', label: 'VIP3' },
      { id: 'VIP4', label: 'VIP4' },
      { id: 'VIP5', label: 'VIP5' },
      { id: 'VIP6', label: 'VIP6' },
      { id: 'VVIP', label: 'VVIP' },
      { id: 'VVVIP', label: 'VVVIP' }
    ];

    const mockData = reactive({
      NEW: {
        EN: [
          { id: 1, pcTitle: 'New Member Benefits', mobileTitle: 'New Benefits', highlight: true, order: 1 },
          { id: 2, pcTitle: 'Welcome Bonus', mobileTitle: 'Welcome', highlight: false, order: 2 }
        ],
        JA: [
          { id: 3, pcTitle: '新規特典', mobileTitle: '特典', highlight: true, order: 1 },
          { id: 4, pcTitle: 'ウェルカムボーナス', mobileTitle: 'ボーナス', highlight: false, order: 2 }
        ],
        ZH: [
          { id: 5, pcTitle: '新會員優惠', mobileTitle: '新優惠', highlight: true, order: 1 },
          { id: 6, pcTitle: '歡迎禮金', mobileTitle: '禮金', highlight: false, order: 2 }
        ]
      },
      VIP1: {
        EN: [
          { id: 7, pcTitle: 'VIP1 Privileges', mobileTitle: 'VIP1', highlight: true, order: 1 }
        ],
        JA: [
          { id: 8, pcTitle: 'VIP1特典', mobileTitle: 'VIP1', highlight: true, order: 1 }
        ],
        ZH: [
          { id: 9, pcTitle: 'VIP1優惠', mobileTitle: 'VIP1', highlight: true, order: 1 }
        ]
      }
      // ... other VIP levels would follow same pattern
    });

    const handleEdit = (item) => {
        alert('尚未開放')
      console.log('Edit item:', item);
    };

    const handleDelete = (item) => {
      if(confirm('確定要刪除嗎？')) {
        console.log('Delete item:', item);
      }
    };

    const handleAdd = () => {
        alert('尚未開放')

      showModal.value = true;
    };

    return {
      activeVipTab,
      activeLangTab,
      vipLevels,
      mockData,
      handleEdit,
      handleDelete,
      handleAdd,
      showModal
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
          <div class="col-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h6 class="card-title">VIP會員規則文案內容</h6>
                  <button type="button" class="btn btn-primary" @click="handleAdd">
                    新增
                  </button>
                </div>

                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item" v-for="level in vipLevels" :key="level.id">
                    <a 
                      class="nav-link" 
                      :class="{ active: activeVipTab === level.id }"
                      @click="activeVipTab = level.id"
                      href="#"
                    >{{ level.label }}</a>
                  </li>
                </ul>

                <ul class="nav nav-tabs mt-3" role="tablist">
                  <li class="nav-item">
                    <a 
                      class="nav-link" 
                      :class="{ active: activeLangTab === 'EN' }"
                      @click="activeLangTab = 'EN'"
                      href="#"
                    >EN</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeLangTab === 'JA' }"
                      @click="activeLangTab = 'JA'"
                      href="#"
                    >JA</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeLangTab === 'ZH' }"
                      @click="activeLangTab = 'ZH'"
                      href="#"
                    >ZH</a>
                  </li>
                </ul>

                <div class="table-responsive mt-3">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>PC標題</th>
                        <th>Mobile標題</th>
                        <th>Highlight</th>
                        <th>排序</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in mockData[activeVipTab]?.[activeLangTab]" :key="item.id">
                        <td>{{ item.pcTitle }}</td>
                        <td>{{ item.mobileTitle }}</td>
                        <td>
                          <span class="badge" :class="item.highlight ? 'bg-success' : 'bg-secondary'">
                            {{ item.highlight ? '是' : '否' }}
                          </span>
                        </td>
                        <td>{{ item.order }}</td>
                        <td>
                          <button class="btn btn-sm btn-outline-primary me-2" @click="handleEdit(item)">
                            編輯
                          </button>
                          <button class="btn btn-sm btn-outline-danger" @click="handleDelete(item)">
                            刪除
                          </button>
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
