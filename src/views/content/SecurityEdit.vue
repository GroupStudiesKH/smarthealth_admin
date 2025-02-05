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
    const content = ref(`<h2>資訊安全政策</h2>
<p>智慧健康管理平台致力於保護所有使用者的資訊安全，我們採用最高標準的安全措施，確保您的資料受到完善的保護。</p>

<h3>資訊安全管理架構</h3>
<p>本平台建立完整的資訊安全管理制度：</p>
<ul>
    <li>設立資訊安全委員會</li>
    <li>定期進行資安風險評估</li>
    <li>制定資安事件應變計畫</li>
    <li>執行持續性的資安監控</li>
</ul>

<h3>系統安全防護</h3>
<p>我們採用多層次的安全防護機制：</p>
<ol>
    <li>防火牆系統
        <ul>
            <li>建置多重防火牆</li>
            <li>即時入侵偵測</li>
            <li>異常流量監控</li>
        </ul>
    </li>
    <li>加密機制
        <ul>
            <li>SSL/TLS 加密傳輸</li>
            <li>資料庫加密存儲</li>
            <li>端對端加密通訊</li>
        </ul>
    </li>
</ol>

<h3>存取控制</h3>
<p>嚴格的存取權限管理：</p>
<ul>
    <li>角色基礎存取控制（RBAC）</li>
    <li>最小權限原則</li>
    <li>定期權限稽核</li>
    <li>異常登入監控</li>
</ul>

<h3>資料備份</h3>
<p>完整的資料備份機制：</p>
<ul>
    <li>即時資料鏡像</li>
    <li>定期完整備份</li>
    <li>異地備援機制</li>
    <li>災難復原演練</li>
</ul>

<h3>安全認證與稽核</h3>
<p>本平台通過多項安全認證：</p>
<ul>
    <li>ISO 27001資訊安全認證</li>
    <li>HIPAA合規認證</li>
    <li>定期第三方資安稽核</li>
    <li>滲透測試與弱點掃描</li>
</ul>`);
    const editor = ClassicEditor;
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
      editor.value = await ClassicEditor
        .create(document.querySelector('#editor'))
        .catch(error => {
          console.error(error);
        });
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
                <h6 class="card-title">資安政策編輯</h6>
                <div class="mt-3">
                  <div class="mb-3">
                    <label class="form-label">內容</label>
                    <textarea
                      id="editor"
                      v-model="content"
                    ></textarea>
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