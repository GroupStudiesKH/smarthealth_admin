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
    const activeTab = ref('EN');
    const showModal = ref(false);

    const popupForm = reactive({
      EN: {
        title: '',
        content: '',
        useCustomLink: false,
        link: '',
        enabled: false,
        pcImage: null,
        mobileImage: null
      },
      JA: {
        title: '',
        content: '',
        useCustomLink: false,
        link: '',
        enabled: false,
        pcImage: null,
        mobileImage: null
      },
      ZH: {
        title: '',
        content: '',
        useCustomLink: false,
        link: '',
        enabled: false,
        pcImage: null,
        mobileImage: null
      }
    });

    const handleSubmit = () => {
      alert('未啟用');
    };

    const handleFileUpload = (event, lang, type) => {
      const file = event.target.files[0];
      if (file) {
        popupForm[lang][`${type}Image`] = file;
      }
    };

    return {
      activeTab,
      popupForm,
      handleSubmit,
      handleFileUpload
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
                <h6 class="card-title">首頁彈窗</h6>

                <ul class="nav nav-tabs" role="tablist">
                  <li class="nav-item">
                    <a 
                      class="nav-link" 
                      :class="{ active: activeTab === 'EN' }"
                      @click="activeTab = 'EN'"
                      href="#"
                    >EN</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeTab === 'JA' }"
                      @click="activeTab = 'JA'"
                      href="#"
                    >JA</a>
                  </li>
                  <li class="nav-item">
                    <a 
                      class="nav-link"
                      :class="{ active: activeTab === 'ZH' }"
                      @click="activeTab = 'ZH'"
                      href="#"
                    >ZH</a>
                  </li>
                </ul>

                <div class="tab-content mt-3">
                  <div class="tab-pane" :class="{ active: activeTab === 'EN' }" v-show="activeTab === 'EN'">
                    <div class="mb-3">
                      <label class="form-label">標題</label>
                      <input type="text" class="form-control" v-model="popupForm.EN.title">
                    </div>

                    <div class="mb-3">
                      <label class="form-label">內容</label>
                      <textarea class="form-control" rows="3" v-model="popupForm.EN.content"></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label d-block">是否使用特定鏈結</label>
                      <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="useLinkEN" v-model="popupForm.EN.useCustomLink" :value="true">
                        <label class="form-check-label" for="useLinkEN">是</label>
                      </div>
                    </div>

                    <div class="mb-3" v-if="popupForm.EN.useCustomLink">
                      <label class="form-label">鏈結</label>
                      <input type="text" class="form-control" v-model="popupForm.EN.link">
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="enabledEN" v-model="popupForm.EN.enabled">
                        <label class="form-check-label" for="enabledEN">啟用</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">PC</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'EN', 'pc')"
                      >
                      <small class="text-muted">優惠首頁 - PC版</small>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Mobile</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'EN', 'mobile')"
                      >
                      <small class="text-muted">優惠首頁 - Mobile版</small>
                    </div>
                  </div>

                  <div class="tab-pane" :class="{ active: activeTab === 'JA' }" v-show="activeTab === 'JA'">
                    <div class="mb-3">
                      <label class="form-label">標題</label>
                      <input type="text" class="form-control" v-model="popupForm.JA.title">
                    </div>

                    <div class="mb-3">
                      <label class="form-label">內容</label>
                      <textarea class="form-control" rows="3" v-model="popupForm.JA.content"></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label d-block">是否使用特定鏈結</label>
                      <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="useLinkJA" v-model="popupForm.JA.useCustomLink" :value="true">
                        <label class="form-check-label" for="useLinkJA">是</label>
                      </div>
                    </div>

                    <div class="mb-3" v-if="popupForm.JA.useCustomLink">
                      <label class="form-label">鏈結</label>
                      <input type="text" class="form-control" v-model="popupForm.JA.link">
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="enabledJA" v-model="popupForm.JA.enabled">
                        <label class="form-check-label" for="enabledJA">啟用</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">PC</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'JA', 'pc')"
                      >
                      <small class="text-muted">優惠首頁 - PC版</small>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Mobile</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'JA', 'mobile')"
                      >
                      <small class="text-muted">優惠首頁 - Mobile版</small>
                    </div>
                  </div>

                  <div class="tab-pane" :class="{ active: activeTab === 'ZH' }" v-show="activeTab === 'ZH'">
                    <div class="mb-3">
                      <label class="form-label">標題</label>
                      <input type="text" class="form-control" v-model="popupForm.ZH.title">
                    </div>

                    <div class="mb-3">
                      <label class="form-label">內容</label>
                      <textarea class="form-control" rows="3" v-model="popupForm.ZH.content"></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label d-block">是否使用特定鏈結</label>
                      <div class="form-check form-check-inline">
                        <input type="radio" class="form-check-input" id="useLinkZH" v-model="popupForm.ZH.useCustomLink" :value="true">
                        <label class="form-check-label" for="useLinkZH">是</label>
                      </div>
                    </div>

                    <div class="mb-3" v-if="popupForm.ZH.useCustomLink">
                      <label class="form-label">鏈結</label>
                      <input type="text" class="form-control" v-model="popupForm.ZH.link">
                    </div>

                    <div class="mb-3">
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="enabledZH" v-model="popupForm.ZH.enabled">
                        <label class="form-check-label" for="enabledZH">啟用</label>
                      </div>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">PC</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'ZH', 'pc')"
                      >
                      <small class="text-muted">優惠首頁 - PC版</small>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Mobile</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        accept="image/*"
                        @change="(e) => handleFileUpload(e, 'ZH', 'mobile')"
                      >
                      <small class="text-muted">優惠首頁 - Mobile版</small>
                    </div>
                  </div>
                </div>

                <button type="button" class="btn btn-primary" @click="handleSubmit">
                  送出
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </div>
</template>
