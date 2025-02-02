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
    const playerData = ref({
      email: "",
      name: "",
      currency: "",
      warningLevel: "",
      playerLevel: "",
      bTag: "",
      sourceUrl: "",
      wallet_amount: 0,
      bonusBalance: 0,
      type: "",
      address: "",
      registrationTime: "",
      lastLoginTime: "",
      status: "",
      remarks: ""
    })

    const errors = ref({});
    const showModal = ref(false);
    const modalMessage = ref('');

    const route = useRoute();
    const playerId = route.params.id;

    const fetchPlayerData = async () => {
      try {
        const response = await apiService.getPlayer(playerId);
        playerData.value = response
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    const updatePlayer = async () => {
      try {
        errors.value = {};
        const response = await apiService.updatePlayer(playerId, playerData.value);
        if (response) {
          console.log('Player updated successfully');
          router.push('/players')
        } else {
          console.error('Failed to update player');
          showModalMessage('更新失敗', '無法更新玩家資料，請稍後再試。');
        }
      } catch (error) {
        console.error('Error updating player:', error);
        if (error.response && error.response.data) {
          errors.value = error.response.data.content || {};
        }
        showModalMessage('更新錯誤', '更新玩家資料時發生錯誤，請檢查輸入並重試。');
      }
    };

    const goBack = () => {
      router.push('/players')
    };

    const showModalMessage = (title, message) => {
      modalMessage.value = message;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      fetchPlayerData()
    });

    return {
        playerData,
        updatePlayer,
        goBack,
        errors,
        showModal,
        modalMessage,
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
        <div class="row mb-4">
          <div class="col-12 col-lg-8 mx-auto stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯玩家資料</h6>
                <form @submit.prevent="updatePlayer">
                  <div class="mb-3">
                    <label for="email" class="form-label">帳號</label>
                    <input type="email" class="form-control" id="email" v-model="playerData.email" disabled :class="{ 'is-invalid': errors.email }">
                    <div v-if="errors.email" class="invalid-feedback">{{ errors.email[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="name" class="form-label">真實姓名 <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="name" v-model="playerData.name" :class="{ 'is-invalid': errors.name }">
                    <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="currency" class="form-label">幣別 <span class="text-danger">*</span></label>
                    <select class="form-select" id="currency" v-model="playerData.currency" :class="{ 'is-invalid': errors.currency }">
                      <option value="USD">USD</option>
                      <option value="JPY">JPY</option>
                      <option value="CNY">CNY</option>
                      <option value="BTC">BTC</option>
                      <option value="TWD">TWD</option>
                    </select>
                    <div v-if="errors.currency" class="invalid-feedback">{{ errors.currency[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="warningLevel" class="form-label">警告級別 <span class="text-danger">*</span></label>
                    <select class="form-select" id="warningLevel" v-model="playerData.warningLevel" :class="{ 'is-invalid': errors.warningLevel }">
                      <option value="none">無警告</option>
                      <option value="Low">一級警告</option>
                      <option value="Medium">二級警告</option>
                      <option value="High">三級警告</option>
                    </select>
                    <div v-if="errors.warningLevel" class="invalid-feedback">{{ errors.warningLevel[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="playerLevel" class="form-label">玩家級別 <span class="text-danger">*</span></label>
                    <select class="form-select" id="playerLevel" v-model="playerData.playerLevel" :class="{ 'is-invalid': errors.playerLevel }">
                      <option value="Beginner">新手</option>
                      <option value="Intermediate">中級</option>
                      <option value="Advanced">進階</option>
                      <option value="Expert">專家</option>
                    </select>
                    <div v-if="errors.playerLevel" class="invalid-feedback">{{ errors.playerLevel[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="bTag" class="form-label">BTag</label>
                    <input type="text" class="form-control" id="bTag" v-model="playerData.bTag" :class="{ 'is-invalid': errors.bTag }">
                    <div v-if="errors.bTag" class="invalid-feedback">{{ errors.bTag[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="sourceUrl" class="form-label">來源網址</label>
                    <input type="text" class="form-control" id="sourceUrl" v-model="playerData.sourceUrl" :class="{ 'is-invalid': errors.sourceUrl }">
                    <div v-if="errors.sourceUrl" class="invalid-feedback">{{ errors.sourceUrl[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="wallet_amount" class="form-label">額度</label>
                    <input type="number" class="form-control" id="wallet_amount" v-model="playerData.wallet_amount" :class="{ 'is-invalid': errors.wallet_amount }">
                    <div v-if="errors.wallet_amount" class="invalid-feedback">{{ errors.wallet_amount[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="bonusBalance" class="form-label">獎金帳戶額度</label>
                    <input type="number" class="form-control" id="bonusBalance" v-model="playerData.bonusBalance" :class="{ 'is-invalid': errors.bonusBalance }">
                    <div v-if="errors.bonusBalance" class="invalid-feedback">{{ errors.bonusBalance[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="type" class="form-label">類型</label>
                    <select class="form-select" id="type" v-model="playerData.type" :class="{ 'is-invalid': errors.type }">
                      <option value="normal">一般</option>
                      <option value="vip">VIP</option>
                    </select>
                    <div v-if="errors.type" class="invalid-feedback">{{ errors.type[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="address" class="form-label">地址</label>
                    <input type="text" class="form-control" id="address" v-model="playerData.address" :class="{ 'is-invalid': errors.address }">
                    <div v-if="errors.address" class="invalid-feedback">{{ errors.address[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="status" class="form-label">狀態</label>
                    <select class="form-select" id="status" v-model="playerData.status" :class="{ 'is-invalid': errors.status }">
                      <option value="active">啟用</option>
                      <option value="inactive">停用</option>
                      <option value="suspended">暫停</option>
                    </select>
                    <div v-if="errors.status" class="invalid-feedback">{{ errors.status[0] }}</div>
                  </div>
                  <div class="mb-3">
                    <label for="remarks" class="form-label">備註</label>
                    <textarea class="form-control" id="remarks" v-model="playerData.remarks" :class="{ 'is-invalid': errors.remarks }"></textarea>
                    <div v-if="errors.remarks" class="invalid-feedback">{{ errors.remarks[0] }}</div>
                  </div>
                  <button type="submit" class="btn btn-primary me-2">更新</button>
                  <button type="button" class="btn btn-secondary" @click="goBack">取消</button>
                </form>

              </div>
            </div>
          </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" :class="{ 'show': showModal }" tabindex="-1" style="display: block;" v-if="showModal">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">錯誤通知</h5>
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

        <!-- row -->
      </div>
      <Footer />
    </div>
  </div>
</template>
