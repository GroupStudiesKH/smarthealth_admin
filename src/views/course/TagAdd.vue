<script>
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import apiService from "@/service/api-service.js";


export default {
  components: {
    Footer,
    Navbar,
    Sidebar
  },
  setup() {
    const router = useRouter();
    const tagName = ref("");

    const loading = ref(false);
    const error = ref(null);

    const handleSubmit = async () => {
      loading.value = true;
      error.value = null;
      try {
        await apiService.addTag({
          name: tagName.value,
          type: 'tag'
        });
        router.push('/course/tag');
      } catch (err) {
        console.error('新增失敗:', err);
        error.value = '新增標籤時發生錯誤，請稍後再試';
      } finally {
        loading.value = false;
      }
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
                <h6 class="card-title">新增標籤</h6>

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
                    <router-link
                      class="btn btn-secondary me-2"
                      :to="{name: 'tagList'}"
                    >
                      取消
                    </router-link>
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