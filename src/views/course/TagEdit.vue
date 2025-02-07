<script>
import { ref, onMounted } from 'vue';
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useRouter, useRoute } from "vue-router";

export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const tagName = ref("");

    onMounted(() => {
      // 這裡之後可以加入 API 呼叫來獲取標籤資料
      const tagId = route.params.id;
      console.log('載入標籤:', tagId);
      tagName.value = '模擬標籤名稱';
    });

    const handleSubmit = () => {
      // 這裡之後可以加入 API 呼叫
      console.log('更新標籤:', route.params.id, tagName.value);
      router.push('/course/tag');
    };

    return {
      tagName,
      handleSubmit
    };
  }
};
</script>

<template>
  <div class="main-wrapper">
    <Sidebar />
    <div class="page-wrapper">
      <Navbar />

      <div class="page-content">
        <div class="row mb-4">
          <div class="col-md-12 grid-margin stretch-card">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">編輯標籤</h6>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label for="tagName" class="form-label">標籤名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="tagName"
                      v-model="tagName"
                      required
                    />
                  </div>

                  <div class="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      @click="router.push('/course/tag')"
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

      <Footer />
    </div>
  </div>
</template>

<style scoped>
.page-content {
  padding: 2rem;
}
</style>