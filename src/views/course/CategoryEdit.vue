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
    const categoryName = ref("");

    onMounted(() => {
      // 這裡之後可以加入 API 呼叫來獲取分類資料
      // 目前先使用模擬資料
      const categoryId = route.params.id;
      console.log('載入分類:', categoryId);
      categoryName.value = '模擬分類名稱';
    });

    const handleSubmit = () => {
      // 這裡之後可以加入 API 呼叫
      console.log('更新分類:', route.params.id, categoryName.value);
      router.push('/course/category');
    };

    return {
      categoryName,
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
                <h6 class="card-title">編輯課程分類</h6>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label for="categoryName" class="form-label">分類名稱</label>
                    <input
                      type="text"
                      class="form-control"
                      id="categoryName"
                      v-model="categoryName"
                      required
                    />
                  </div>

                  <div class="d-flex justify-content-end">
                    <button
                      type="button"
                      class="btn btn-secondary me-2"
                      @click="router.push('/course/category')"
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