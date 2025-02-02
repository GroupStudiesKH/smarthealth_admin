<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const chapter = ref({
  id: 1,
  title: '第一章：健康管理概論',
  content: '',
  files: [
    {
      id: 1,
      name: '健康管理導論.pdf',
      type: 'pdf',
      url: '#'
    },
    {
      id: 2,
      name: '課程介紹.mp4',
      type: 'video',
      url: '#'
    }
  ]
});

const uploadFile = () => {
  // 這裡實作檔案上傳邏輯
  console.log('上傳檔案');
};

const removeFile = (fileId) => {
  if (confirm('確定要刪除此檔案嗎？')) {
    chapter.value.files = chapter.value.files.filter(file => file.id !== fileId);
  }
};

const previewFile = (file) => {
  // 這裡實作檔案預覽邏輯
  console.log('預覽檔案', file);
};

const saveChapter = () => {
  // 這裡實作儲存章節的邏輯
  console.log('儲存章節', chapter.value);
  router.push('/course/list');
};

onMounted(() => {
  // 這裡載入章節資料
  console.log('載入章節資料');
});
</script>

<template>
  <div class="page-wrapper">
    <div class="page-header">
      <h3 class="page-title">章節內容管理</h3>
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="#">課程管理</a></li>
          <li class="breadcrumb-item active" aria-current="page">章節內容管理</li>
        </ol>
      </nav>
    </div>

    <div class="row">
      <div class="col-md-12 grid-margin stretch-card">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="saveChapter">
              <!-- 章節基本資訊 -->
              <div class="mb-4">
                <h5 class="card-title">{{ chapter.title }}</h5>
              </div>

              <!-- 檔案上傳區域 -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <label class="form-label mb-0">課程檔案</label>
                  <button type="button" class="btn btn-primary btn-sm" @click="uploadFile">
                    上傳檔案
                  </button>
                </div>

                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>檔案名稱</th>
                        <th>類型</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="file in chapter.files" :key="file.id">
                        <td>{{ file.name }}</td>
                        <td>
                          <span class="badge" :class="{
                            'bg-info': file.type === 'pdf',
                            'bg-success': file.type === 'video',
                            'bg-primary': file.type === 'image'
                          }">
                            {{ file.type.toUpperCase() }}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-primary me-2"
                            @click="previewFile(file)"
                          >
                            預覽
                          </button>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger"
                            @click="removeFile(file.id)"
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 章節內容編輯器 -->
              <div class="mb-4">
                <label class="form-label">章節內容</label>
                <div class="editor-container">
                  <!-- 這裡整合 WYSIWYG 編輯器 -->
                  <textarea
                    class="form-control"
                    v-model="chapter.content"
                    rows="10"
                  ></textarea>
                </div>
              </div>

              <!-- 預覽區域 -->
              <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <label class="form-label mb-0">內容預覽</label>
                </div>
                <div class="preview-container p-3 border rounded">
                  <!-- 這裡顯示內容預覽 -->
                  <div v-html="chapter.content"></div>
                </div>
              </div>

              <!-- 提交按鈕 -->
              <div class="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="router.push('/course/list')"
                >
                  取消
                </button>
                <button type="submit" class="btn btn-primary">儲存</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 1.5rem;
}

.editor-container {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}

.preview-container {
  min-height: 200px;
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4em 0.8em;
}
</style>