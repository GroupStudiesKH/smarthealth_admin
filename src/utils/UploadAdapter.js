import apiService from '@/service/api-service.js';

export default class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = `${apiService.apiUrl}admin/course/img-upload`;
  }

  async upload() {
    const file = await this.loader.file;
    const csrfToken = document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") || '';

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          Authorization: `Bearer ${apiService.getServerToken()}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "上傳失敗");

      return {
        default: data.url,
      };
    } catch (error) {
      console.error("上傳錯誤:", error);
      throw error;
    }
  }
}