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
    const content = ref("");
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