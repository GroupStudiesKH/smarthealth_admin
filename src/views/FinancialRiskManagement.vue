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
    const activeTab = ref('profile');
    const activeProfileTab = ref('deposit');
    const activeFrontendTab = ref('deposit');
    const activeBackendTab = ref('deposit');

    const profileForm = reactive({
      minAge: '',
      maxAge: '',
      blacklistCountries: [],
      riskLevels: []
    });

    const depositForm = reactive({
      name: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      email: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      phoneVerified: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      birthday: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      address: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      kycVerified: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      }
    });

    const withdrawalForm = reactive({
      name: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      email: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      phoneVerified: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      birthday: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      address: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      },
      kycVerified: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false
      }
    });

    const frontendForm = reactive({
      deposit: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      }
    });

    const backendDepositForm = reactive({
      noReviewThreshold: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      },
      allowSameStaff: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false,
        creditCard: false
      }
    });

    const backendWithdrawalForm = reactive({
      allowSameStaff: {
        thirdParty: false,
        bankCard: false,
        eWallet: false,
        crypto: false,
        creditCard: false
      },
      superAdminThreshold: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      },
      autoApproveThreshold: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      },
      autoApproveMaxDaily: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      },
      autoExecuteThreshold: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      },
      autoExecuteMaxDaily: {
        thirdParty: '',
        bankCard: '',
        eWallet: '',
        crypto: '',
        creditCard: ''
      }
    });

    const handleSubmit = async (formType) => {
      try {
        let formData;
        switch(formType) {
          case 'profile':
            formData = profileForm;
            break;
          case 'frontend':
            formData = frontendForm;
            break;
          case 'backendDeposit':
            formData = backendDepositForm;
            break;
          case 'backendWithdrawal':
            formData = backendWithdrawalForm;
            break;
          case 'deposit':
            formData = depositForm;
            break;
          case 'withdrawal':
            formData = withdrawalForm;
            break;
        }
        console.log(`${formType} form submitted:`, formData);
        alert("設定已保存");
      } catch (error) {
        console.error("Failed to submit form:", error);
        alert("設定保存失敗");
      }
    };

    return {
      activeTab,
      activeProfileTab,
      activeFrontendTab,
      activeBackendTab,
      profileForm,
      depositForm,
      withdrawalForm,
      frontendForm,
      backendDepositForm,
      backendWithdrawalForm,
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
          <div class="col-md-12 stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">金流風險管理</h6>

                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a 
                      class="nav-link" 
                      :class="{ active: activeTab === 'profile' }"
                      @click="activeTab = 'profile'"
                      href="#"
                    >個人資料檢核</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeTab === 'frontend' }"
                      @click="activeTab = 'frontend'"
                      href="#"
                    >前台申請檢核</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeTab === 'backend' }"
                      @click="activeTab = 'backend'"
                      href="#"
                    >後台審核設定</a>
                  </li>
                </ul>

                <div class="tab-content mt-3">
                  <!-- 個人資料檢核 -->
                  <div v-show="activeTab === 'profile'">
                    <ul class="nav nav-tabs" role="tablist">
                      <li class="nav-item">
                        <a 
                          class="nav-link" 
                          :class="{ active: activeProfileTab === 'deposit' }"
                          @click="activeProfileTab = 'deposit'"
                          href="#"
                        >存款檢核</a>
                      </li>
                      <li class="nav-item">
                        <a 
                          class="nav-link"
                          :class="{ active: activeProfileTab === 'withdrawal' }"
                          @click="activeProfileTab = 'withdrawal'"
                          href="#"
                        >提款檢核</a>
                      </li>
                    </ul>

                    <div class="tab-content mt-3">
                      <!-- 存款檢核 -->
                      <div v-show="activeProfileTab === 'deposit'">
                        <form @submit.prevent="handleSubmit('deposit')">
                          <div class="table-responsive mb-5">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>第三方支付</th>
                                  <th>銀行卡</th>
                                  <th>電子錢包</th>
                                  <th>虛擬幣</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(field, key) in ['name', 'email', 'phoneVerified', 'birthday', 'address', 'kycVerified']" :key="field">
                                  <td>{{ 
                                    {
                                      'name': '姓名',
                                      'email': 'Email',
                                      'phoneVerified': '手機號驗證成功',
                                      'birthday': '生日',
                                      'address': '地址',
                                      'kycVerified': 'KYC驗證成功'
                                    }[field] 
                                  }}</td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="depositForm[field].thirdParty">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="depositForm[field].bankCard">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="depositForm[field].eWallet">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="depositForm[field].crypto">
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="submit" class="btn btn-primary">保存設定</button>
                        </form>
                      </div>

                      <!-- 提款檢核 -->
                      <div v-show="activeProfileTab === 'withdrawal'">
                        <form @submit.prevent="handleSubmit('withdrawal')">
                          <div class="table-responsive mb-5">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>第三方支付</th>
                                  <th>銀行卡</th>
                                  <th>電子錢包</th>
                                  <th>虛擬幣</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="(field, key) in ['name', 'email', 'phoneVerified', 'birthday', 'address', 'kycVerified']" :key="field">
                                  <td>{{ 
                                    {
                                      'name': '姓名',
                                      'email': 'Email',
                                      'phoneVerified': '手機號驗證成功',
                                      'birthday': '生日',
                                      'address': '地址',
                                      'kycVerified': 'KYC驗證成功'
                                    }[field] 
                                  }}</td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="withdrawalForm[field].thirdParty">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="withdrawalForm[field].bankCard">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="withdrawalForm[field].eWallet">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="withdrawalForm[field].crypto">
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="submit" class="btn btn-primary">保存設定</button>
                        </form>
                      </div>
                    </div>
                  </div>

                  <!-- 前台申請檢核 -->
                  <div v-show="activeTab === 'frontend'">
                    <ul class="nav nav-tabs" role="tablist">
                      <li class="nav-item">
                        <a 
                          class="nav-link" 
                          :class="{ active: activeFrontendTab === 'deposit' }"
                          @click="activeFrontendTab = 'deposit'"
                          href="#"
                        >存款檢核</a>
                      </li>
                      <li class="nav-item">
                        <a 
                          class="nav-link"
                          :class="{ active: activeFrontendTab === 'withdrawal' }"
                          @click="activeFrontendTab = 'withdrawal'"
                          href="#"
                        >提款檢核</a>
                      </li>
                    </ul>

                    <div class="tab-content mt-3">
                      <!-- 存款檢核 -->
                      <div v-show="activeFrontendTab === 'deposit'">
                        <form @submit.prevent="handleSubmit('frontend')">
                          <div class="table-responsive mb-5">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th>設定的秒數內不允許重複申請</th>
                                  <th>第三方支付</th>
                                  <th>銀行卡</th>
                                  <th>電子錢包</th>
                                  <th>虛擬幣</th>
                                  <th>信用卡</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>秒數</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="frontendForm.deposit.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="frontendForm.deposit.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="frontendForm.deposit.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="frontendForm.deposit.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="frontendForm.deposit.creditCard">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="submit" class="btn btn-primary">保存設定</button>
                        </form>
                      </div>

                      <!-- 提款檢核 -->
                      <div v-show="activeFrontendTab === 'withdrawal'">
                        <div class="alert alert-info">
                          未開放
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 後台審核設定 -->
                  <div v-show="activeTab === 'backend'">
                    <ul class="nav nav-tabs" role="tablist">
                      <li class="nav-item">
                        <a 
                          class="nav-link" 
                          :class="{ active: activeBackendTab === 'deposit' }"
                          @click="activeBackendTab = 'deposit'"
                          href="#"
                        >存款檢核</a>
                      </li>
                      <li class="nav-item">
                        <a 
                          class="nav-link"
                          :class="{ active: activeBackendTab === 'withdrawal' }"
                          @click="activeBackendTab = 'withdrawal'"
                          href="#"
                        >提款檢核</a>
                      </li>
                    </ul>

                    <div class="tab-content mt-3">
                      <!-- 存款檢核 -->
                      <div v-show="activeBackendTab === 'deposit'">
                        <form @submit.prevent="handleSubmit('backendDeposit')">
                          <div class="table-responsive mb-5">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>第三方支付</th>
                                  <th>銀行卡</th>
                                  <th>電子錢包</th>
                                  <th>虛擬幣</th>
                                  <th>信用卡</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>補入存款訂單時存款額低於設定值，則無需審核步驟</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendDepositForm.noReviewThreshold.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendDepositForm.noReviewThreshold.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendDepositForm.noReviewThreshold.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendDepositForm.noReviewThreshold.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendDepositForm.noReviewThreshold.creditCard">
                                  </td>
                                </tr>
                                <tr>
                                  <td>允許相同員工帳號進行補單／審核</td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendDepositForm.allowSameStaff.thirdParty">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendDepositForm.allowSameStaff.bankCard">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendDepositForm.allowSameStaff.eWallet">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendDepositForm.allowSameStaff.crypto">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendDepositForm.allowSameStaff.creditCard">
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="submit" class="btn btn-primary">保存設定</button>
                        </form>
                      </div>

                      <!-- 提款檢核 -->
                      <div v-show="activeBackendTab === 'withdrawal'">
                        <form @submit.prevent="handleSubmit('backendWithdrawal')">
                          <div class="table-responsive mb-5">
                            <table class="table">
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>第三方支付</th>
                                  <th>銀行卡</th>
                                  <th>電子錢包</th>
                                  <th>虛擬幣</th>
                                  <th>信用卡</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>允許相同員工帳號進行審核/執行提款</td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendWithdrawalForm.allowSameStaff.thirdParty">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendWithdrawalForm.allowSameStaff.bankCard">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendWithdrawalForm.allowSameStaff.eWallet">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendWithdrawalForm.allowSameStaff.crypto">
                                    </div>
                                  </td>
                                  <td>
                                    <div class="form-check form-switch">
                                      <input class="form-check-input" type="checkbox" v-model="backendWithdrawalForm.allowSameStaff.creditCard">
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td>提款經過設定金額須擁有超級管理員權限的用戶進行審核</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.superAdminThreshold.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.superAdminThreshold.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.superAdminThreshold.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.superAdminThreshold.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.superAdminThreshold.creditCard">
                                  </td>
                                </tr>
                                <tr>
                                  <td>低於設定金額自動審核</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveThreshold.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveThreshold.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveThreshold.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveThreshold.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveThreshold.creditCard">
                                  </td>
                                </tr>
                                <tr>
                                  <td>每日自動審核最高次數</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveMaxDaily.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveMaxDaily.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveMaxDaily.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveMaxDaily.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoApproveMaxDaily.creditCard">
                                  </td>
                                </tr>
                                <tr>
                                  <td>低於設定金額自動執行</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteThreshold.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteThreshold.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteThreshold.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteThreshold.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteThreshold.creditCard">
                                  </td>
                                </tr>
                                <tr>
                                  <td>每日自動執行最高次數</td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteMaxDaily.thirdParty">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteMaxDaily.bankCard">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteMaxDaily.eWallet">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteMaxDaily.crypto">
                                  </td>
                                  <td>
                                    <input type="number" class="form-control" v-model="backendWithdrawalForm.autoExecuteMaxDaily.creditCard">
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <button type="submit" class="btn btn-primary">保存設定</button>
                        </form>
                      </div>
                    </div>
                  </div>
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
