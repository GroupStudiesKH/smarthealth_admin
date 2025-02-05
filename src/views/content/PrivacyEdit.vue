<script>
import { ref, onMounted } from "vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  components: {
    Footer,
    Navbar,
    Sidebar,
  },
  setup() {
    const content = ref(`<h2>隱私權政策</h2>
<p>智慧健康管理平台（以下簡稱「本平台」）非常重視您的隱私權保護，為了讓您能夠安心的使用本平台的各項服務，特此向您說明本平台的隱私權保護政策。</p>

<h3>個人資料蒐集</h3>
<p>當您使用本平台服務時，我們可能會收集以下個人資料：</p>
<ul>
    <li>基本資料：姓名、出生年月日、性別、聯絡方式等</li>
    <li>健康資料：身高、體重、血壓、血糖等健康指標</li>
    <li>醫療紀錄：就醫紀錄、用藥紀錄、過敏史等</li>
    <li>使用紀錄：登入時間、使用功能、瀏覽紀錄等</li>
</ul>

<h3>個人資料使用目的</h3>
<p>您的個人資料將用於：</p>
<ol>
    <li>提供個人化健康管理服務</li>
    <li>健康風險評估與預警</li>
    <li>醫療諮詢服務</li>
    <li>系統功能優化與改善</li>
    <li>統計分析（去識別化後）</li>
</ol>

<h3>資料保護措施</h3>
<p>為保護您的個人資料，本平台採取以下措施：</p>
<ul>
    <li>資料加密儲存與傳輸</li>
    <li>存取權限控管</li>
    <li>定期資安稽核</li>
    <li>人員保密訓練</li>
</ul>

<h3>資料保存期限</h3>
<p>除法律另有規定外，您的個人資料將於會員服務終止後保存5年。期限屆滿後，本平台將主動刪除或匿名化處理相關資料。</p>

<h3>您的權利</h3>
<p>依據個人資料保護法，您就您的個人資料享有以下權利：</p>
<ul>
    <li>查詢或請求閱覽</li>
    <li>請求製給複製本</li>
    <li>請求補充或更正</li>
    <li>請求停止蒐集、處理或利用</li>
    <li>請求刪除</li>
</ul>`);
    const editor = ref(null);
    const isLoading = ref(false);

    const saveContent = async () => {
      isLoading.value = true;
      try {
        // 這裡添加保存內容的邏輯
        console.log('保存內容:', content.value);
      } catch (error) {
        console.error('保存失敗:', error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      try {
        editor.value = await ClassicEditor
          .create(document.querySelector('#editor'))
          .then(editor => {
            editor.setData(content.value);
            editor.model.document.on('change:data', () => {
              content.value = editor.getData();
            });
            return editor;
          })
      } catch (error) {
        console.error('編輯器初始化失敗:', error);
      }
    });

    return {
      content,
      editor,
      isLoading,
      saveContent
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <Navbar />
    <Sidebar />
    <div class="page-wrapper">
      <div class="page-content">
        <div class="row">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">隱私權政策編輯</h6>
                <div class="mt-3">
                  <div class="mb-3">
                    <label class="form-label">內容</label>
                    <textarea id="editor"></textarea>
                  </div>
                  <div class="d-flex justify-content-end">
                    <button class="btn btn-primary" @click="saveContent" :disabled="isLoading">
                      {{ isLoading ? '儲存中...' : '儲存' }}
                    </button>
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