<script>
import { ref, reactive } from "vue";
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
    const showModal = ref(false);

    const form = reactive({
      playerType: "",
      account: "",
      currency: "",
      amount: "",
      remarks: ""
    });

    const playerTypes = [
      { value: "vip", label: "VIP玩家" },
      { value: "normal", label: "一般玩家" },
      { value: "new", label: "新進玩家" }
    ];

    const handleSubmit = () => {
      showModal.value = true;
    };

    return {
      form,
      playerTypes,
      showModal,
      handleSubmit
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
                <h6 class="card-title">生日禮金</h6>
                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label class="form-label">玩家類別</label>
                    <select class="form-select" v-model="form.playerType">
                      <option value="">請選擇玩家類別</option>
                      <option v-for="type in playerTypes" 
                              :key="type.value" 
                              :value="type.value">
                        {{ type.label }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">帳號</label>
                    <input type="text" 
                           class="form-control" 
                           v-model="form.account">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">幣別</label>
                    <input type="text" 
                           class="form-control" 
                           v-model="form.currency">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">申請生日禮金金額</label>
                    <input type="number" 
                           class="form-control" 
                           v-model="form.amount">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">備註</label>
                    <textarea class="form-control" 
                             rows="3"
                             v-model="form.remarks"></textarea>
                  </div>

                  <div class="btn btn-primary" @click="handleSubmit()">送出</div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div class="modal" :class="{ 'd-block': showModal }" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">提示</h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body">
              <p>未開放</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">關閉</button>
            </div>
          </div>
        </div>
      </div>


      <Footer />
    </div>
  </div>
</template>
