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
    const form = reactive({
      account: '',
      currency: '',
      type: 'main', // 預設主帳戶
      amount: '',
      note: ''
    });

    const submitForm = () => {
      // TODO: 實作表單提交邏輯
    //   console.log('Form submitted:', form);
        alert(`未開放`)
    };

    return {
      form,
      submitForm
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
                <h6 class="card-title mb-4">特殊獎金派發</h6>

                <form @submit.prevent="submitForm">
                  <div class="mb-3">
                    <label class="form-label">帳號</label>
                    <input type="text" class="form-control" v-model="form.account">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">幣別</label>
                    <input type="text" class="form-control" v-model="form.currency">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">類型</label>
                    <select class="form-select" v-model="form.type">
                      <option value="main">主帳戶</option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">獎金額度</label>
                    <input type="number" class="form-control" v-model="form.amount">
                  </div>

                  <div class="mb-3">
                    <label class="form-label">備註</label>
                    <textarea class="form-control" rows="3" v-model="form.note"></textarea>
                  </div>

                  <div class="alert alert-info">
                    點擊「提交」後，無需審核，系統會直接派發獎金
                  </div>

                  <button type="submit" class="btn btn-primary">提交</button>
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
