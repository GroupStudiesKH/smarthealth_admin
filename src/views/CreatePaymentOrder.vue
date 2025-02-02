<script>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
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
    const form = reactive({
      account: '',
      playerCurrency: '',
      amount: '',
      type: '',
      paymentTime: '',
      remarks: ''
    });

    const accountExists = ref(false);
    const accountChecking = ref(false);

    const checkAccount = async () => {
      if (!form.account) return;
      
      accountChecking.value = true;
      try {
        // 模擬 API 呼叫
        await new Promise(resolve => setTimeout(resolve, 500));
        accountExists.value = Math.random() > 0.5;
      } catch (error) {
        console.error("Failed to check account:", error);
        accountExists.value = false;
      } finally {
        accountChecking.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        // 模擬表單提交
        console.log("Form submitted:", form);
        alert("補單創建成功");
        // 重置表單
        Object.keys(form).forEach(key => form[key] = '');
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("補單創建失敗");
      }
    };

    return {
      form,
      accountExists,
      accountChecking,
      checkAccount,
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
          <div class="col-md-8 mx-auto stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">創建支付補單</h6>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label for="account" class="form-label">帳號</label>
                    <div class="input-group">
                      <input
                        type="text"
                        class="form-control"
                        id="account"
                        v-model="form.account"
                        @blur="checkAccount"
                        :class="{'is-valid': accountExists, 'is-invalid': !accountExists && form.account}"
                        required
                      />
                      <span class="input-group-text" v-if="accountChecking">
                        <i class="spinner-border spinner-border-sm"></i>
                      </span>
                    </div>
                    <div class="valid-feedback" v-if="accountExists">
                      帳號存在
                    </div>
                    <div class="invalid-feedback" v-if="!accountExists && form.account">
                      帳號不存在
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="playerCurrency" class="form-label">玩家幣別</label>
                    <input
                      type="text"
                      class="form-control"
                      id="playerCurrency"
                      v-model="form.playerCurrency"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="amount" class="form-label">金額</label>
                    <input
                      type="number"
                      class="form-control"
                      id="amount"
                      v-model="form.amount"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="type" class="form-label">類型</label>
                    <select
                      class="form-select"
                      id="type"
                      v-model="form.type"
                      required
                    >
                      <option value="">請選擇</option>
                      <option value="deposit">存款</option>
                      <option value="withdrawal">提款</option>
                      <option value="adjustment">調整</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label for="paymentTime" class="form-label">支付時間</label>
                    <input
                      type="datetime-local"
                      class="form-control"
                      id="paymentTime"
                      v-model="form.paymentTime"
                      required
                    />
                  </div>

                  <div class="mb-3">
                    <label for="remarks" class="form-label">備註</label>
                    <textarea
                      class="form-control"
                      id="remarks"
                      v-model="form.remarks"
                      rows="3"
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary">
                    創建補單
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>
