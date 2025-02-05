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
    const content = ref(`<h2>智慧健康管理平台計劃緣起</h2>
<p>隨著科技的快速發展和人口高齡化的趨勢，智慧健康管理已成為現代醫療照護體系中不可或缺的一環。本計劃旨在建立一個整合性的智慧健康管理平台，結合最新的資訊科技與醫療專業知識，為使用者提供全方位的健康管理服務。</p>

<h3>計劃目標</h3>
<ul>
    <li>建立個人化健康管理系統</li>
    <li>提供即時健康數據分析</li>
    <li>促進醫療資源有效利用</li>
    <li>提升整體醫療照護品質</li>
</ul>

<h3>預期效益</h3>
<p>透過本平台的建置，我們期望能：</p>
<ol>
    <li>提升民眾自主健康管理意識</li>
    <li>降低醫療資源使用成本</li>
    <li>建立完整的健康管理生態系統</li>
    <li>促進產業創新與發展</li>
</ol>

<h3>實施策略</h3>
<p>本計劃將分階段實施，包含：</p>
<ul>
    <li>第一階段：基礎平台建置</li>
    <li>第二階段：功能擴充與優化</li>
    <li>第三階段：生態系統整合</li>
    <li>第四階段：永續營運規劃</li>
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
                <h6 class="card-title">計劃緣起編輯</h6>
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