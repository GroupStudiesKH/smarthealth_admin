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
    const route = useRoute();
    const showModal = ref(false);
    const modalMessage = ref('');

    const openModal = (message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    return {
      showModal,
      modalMessage,
      openModal,
      closeModal
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
                <div class="d-flex justify-content-around">
                  <button class="btn btn-primary" @click="openModal('未開放')">
                    刪除反水數據
                  </button>
                  <button class="btn btn-primary" @click="openModal('未開放')">
                    提交系統反水
                  </button>
                  <button class="btn btn-primary" @click="openModal('未開放')">
                    派發反水
                  </button>
                  <button class="btn btn-primary" @click="openModal('未開放')">
                    重算遊戲平台輸贏紀錄
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal" :class="{ 'd-block': showModal }" tabindex="-1" v-if="showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">系統訊息</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <p>{{ modalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">關閉</button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop fade show" v-if="showModal"></div>

      <Footer />
    </div>
  </div>
</template>
