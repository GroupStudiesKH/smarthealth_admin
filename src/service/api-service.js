import axios from "axios";

const currentHost = window.location.hostname;

let apiUrl, apiWithoutPath, homeUrl;

if (currentHost === 'localhost') {
  apiUrl = "http://localhost:8000/api/";
  apiWithoutPath = "http://localhost:8000";
  homeUrl = "http://localhost:5173/";
} else if (currentHost.endsWith('.hanyuan.info')) {
  apiUrl = "https://api.smarthealth.hanyuan.info/api/";
  apiWithoutPath = "https://api.smarthealth.hanyuan.info";
  homeUrl = "https://admin.smarthealth.hanyuan.info/";
} else {
  apiUrl = "http://localhost:8000/api/";
  apiWithoutPath = "http://localhost:8000";
  homeUrl = "http://localhost:5173/";
}


//Cookie ExpireDate
let expire = new Date();
expire.setTime(expire.getTime() + 7 * 24 * 60 * 60 * 1000);
let expireString = "expires=" + expire.toGMTString();


const getServerToken = () => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token') || null;
};

const scGet = (url) => {
  return {
    url: url,
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
  };
};

const scPost = (url, params, isJson = true) => {
  let reqPost =  {
    url: url,
    method: "POST",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
    data: params,
  };

  if(isJson){
    reqPost.headers['Content-type'] = "application/json"
  }

  return reqPost
};

const scPatch = (url, params) => {
  return {
    url: url,
    method: "PATCH",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
    data: params,
  };
};

const scPut = (url, params) => {
  return {
    url: url,
    method: "PUT",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
    data: params,
  };
};

const scDelete = (url, params) => {
  return {
    url: url,
    method: "DELETE",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
    data: params,
  };
};

const scOption = (url, params) => {
  return {
    url: url,
    method: "OPTION",
    headers: {
      "Cache-Control": "no-cache",
      ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
    },
    data: params,
  };
};

const checkServerResponse = (responseData) => {
  // 檢查是否為401未授權狀態
  if (responseData.status === 401) {
    // 清除本地儲存的token
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    // 重定向到登入頁面
    window.location.href = homeUrl + 'login';
    throw '請重新登入';

  }else if (responseData.data.status == 'success' || responseData.status == 200) {
    // Error response
    return responseData.data.content;
  }

  throw responseData.data.message;
};

const adminLogin = async (inputData) => {

  const requestConfig = scPost(`${apiUrl}admin/login`, inputData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }

}

const adminMe = async () => {
  const requestConfig = scGet(`${apiUrl}admin/me`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const adminLogout = async () => {
  const requestConfig = scGet(`${apiUrl}admin/logout`);

  try {
    const response = await axios(requestConfig);
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPlayers = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/players?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPlayer = async (playerId) => {
  const requestConfig = scGet(`${apiUrl}admin/players/${playerId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const updatePlayer = async (playerId, playerData) => {
  const requestConfig = scPut(`${apiUrl}admin/players/${playerId}`, playerData);


  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPermissionOptions = async () => {
  const requestConfig = scGet(`${apiUrl}admin/permission/options`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}


const getPermissions = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/permission?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPermission = async (permissionId) => {
  const requestConfig = scGet(`${apiUrl}admin/permission/${permissionId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const updatePermission = async (permissionId, permissionData) => {
  const requestConfig = scPut(`${apiUrl}admin/permission/${permissionId}`, permissionData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const addPermission = async (permissionData) => {
  const requestConfig = scPost(`${apiUrl}admin/permission`, permissionData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}


const adminEdit = async (userData) => {
  const requestConfig = scPost(`${apiUrl}admin/edit`, userData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const listBanners = async () => {
  const requestConfig = scGet(`${apiUrl}admin/banner`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const addBanner = async (bannerData) => {
  const requestConfig = scPost(`${apiUrl}admin/banner`, bannerData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const editBanner = async (bannerId, bannerData) => {
  const requestConfig = scPost(`${apiUrl}admin/banner/${bannerId}`, bannerData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const bannerShow = async (bannerId) => {
  const requestConfig = scGet(`${apiUrl}admin/banner/${bannerId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const deleteBanner = async (bannerId) => {
  const requestConfig = scDelete(`${apiUrl}admin/banner/${bannerId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPosts = async (params = {}) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/posts?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getPost = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/posts/show?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const createPost = async (postData) => {
  const requestConfig = scPost(`${apiUrl}admin/posts`, postData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const updatePost = async (postId, postData) => {
  const requestConfig = scPut(`${apiUrl}admin/posts/${postId}`, postData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const deletePost = async (postId) => {
  const requestConfig = scDelete(`${apiUrl}admin/posts/${postId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('upload', imageFile);


  try {
    const response = await axios.post(`${apiUrl}admin/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
      },
    });

    if (response.status === 200 && response.data && response.data.url) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

const courseImgUpload = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);


  try {
    const response = await axios.post(`${apiUrl}admin/course/img-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
      },
    });

    if (response.status === 200 && response.data && response.data.url) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}



const chapterPDFUpload = async (pdfFile) => {
  const formData = new FormData();
  formData.append('file', pdfFile);

  try {
    const response = await axios.post(`${apiUrl}admin/course/chapter/pdf-upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...getServerToken() ? { 'Authorization': `Bearer ${getServerToken()}` } : {},
      },
    });

    if (response.status === 200 && response.data && response.data.content) {
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

const getAdmins = async () => {
  const requestConfig = scGet(`${apiUrl}admin/list`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
}

const updateAdmin = async (adminData) => {
  const requestConfig = scPut(`${apiUrl}admin/update`, adminData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
}

const registerAdmin = async (adminData) => {
  const requestConfig = scPost(`${apiUrl}admin/register`, adminData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}



const getAdmin = async (adminId) => {
  const requestConfig = scGet(`${apiUrl}admin/detail/${adminId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error fetching admin details:', error);
    throw error;
  }
}


const deleteAdmin = async (adminId) => {
  const requestConfig = scDelete(`${apiUrl}admin/delete/${adminId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
}

const getStats = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/stats?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const downloadStatsExcel = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = {
    ...scGet(`${apiUrl}admin/stats/excel?${queryString}`),
    responseType: 'blob' // 設定回應類型為blob以處理檔案下載
  };

  try {
    const response = await axios(requestConfig);
    
    // 建立下載用的URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // 建立暫時的a標籤來觸發下載
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'stats.xlsx'); // 設定下載的檔案名稱
    document.body.appendChild(link);
    link.click();
    
    // 清理URL物件
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error;
  }
};


const objectToQueryString = (obj) => {
  const queryParams = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      queryParams.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParams.join('&');
}

const getChapters = async (courseId) => {
  const requestConfig = scGet(`${apiUrl}admin/course/${courseId}/chapter`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getChapter = async (courseId, chapterId) => {
  const requestConfig = scGet(`${apiUrl}admin/course/${courseId}/chapter/${chapterId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const updateChapter = async (courseId, chapterId, inputForm) => {
  const requestConfig = scPost(`${apiUrl}admin/course/${courseId}/chapter/${chapterId}`, inputForm);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const createChapter = async (courseId, inputForm) => {
  const requestConfig = scPost(`${apiUrl}admin/course/${courseId}/chapter`, inputForm);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getExamLists = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/exam?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getQuestionLists = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/exam/question?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getQuestion = async (questionID) => {
  const requestConfig = scGet(`${apiUrl}admin/exam/question/${questionID}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const delQuestion = async (questionID) => {
  const requestConfig = scDelete(`${apiUrl}admin/exam/question/${questionID}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const updateQuestion = async (questionId, formData) => {
  const requestConfig = scPost(`${apiUrl}admin/exam/question/${questionId}`, formData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const addQuestion = async (formData) => {
  const requestConfig = scPost(`${apiUrl}admin/exam/question`, formData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};


const getCourses = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/course?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getCourse = async (id) => {
  const requestConfig = scGet(`${apiUrl}admin/course/${id}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const updateCourse = async (id, inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/course/${id}`, inputData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const createCourse = async (inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/course`, inputData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getInstructors = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/instructor?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getInstructor = async (id) => {
  const requestConfig = scGet(`${apiUrl}admin/instructor/${id}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getInstructorsOption = async () => {
  const requestConfig = scGet(`${apiUrl}admin/instructor/listall`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const delInstructor = async (id) => {
  const requestConfig = scDelete(`${apiUrl}admin/instructor/${id}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const updateInstructor = async (id, inputData) => {

  const requestConfig = scPost(`${apiUrl}admin/instructor/${id}`, inputData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const addInstructor = async (inputData) => {

  const requestConfig = scPost(`${apiUrl}admin/instructor`, inputData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const getMembers = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/member?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getMember = async (memberID) => {
  const requestConfig = scGet(`${apiUrl}admin/member/${memberID}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const editMember = async (memberID, inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/member/${memberID}`, inputData, false);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const addMember = async (inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/member`, inputData, false);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const memberStatus = async (memberID) => {
  const requestConfig = scPut(`${apiUrl}admin/member/${memberID}/status`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const getTags = async (params) => {
  const queryString = objectToQueryString(params);
  const requestConfig = scGet(`${apiUrl}admin/tag?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getTag = async (id) => {
  const requestConfig = scGet(`${apiUrl}admin/tag/${id}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const delTag = async (id) => {
  const requestConfig = scDelete(`${apiUrl}admin/tag/${id}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const addTag = async (formData) => {
  const requestConfig = scPost(`${apiUrl}admin/tag`, formData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const editTag = async (id, formData) => {
  const requestConfig = scPost(`${apiUrl}admin/tag/${id}`, formData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const getTagsOption = async (type) => {
  const requestConfig = scGet(`${apiUrl}admin/tag/listall?type=${type}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getVimeoID = async (chapterID, inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/chapter/${chapterID}/vimeo-id`, inputData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const changeVimeoStatus = async (inputData) => {
  const requestConfig = scPost(`${apiUrl}admin/vimeo/status`, inputData);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const removeVimeo = async (inputData) => {
  const requestConfig = scDelete(`${apiUrl}admin/vimeo`, inputData);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error registering admin:', error);
    throw error;
  }
}

const getDashboard = async () => {
  const requestConfig = scGet(`${apiUrl}admin/dashboard`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getBrandSetting = async () => {
  const requestConfig = scGet(`${apiUrl}admin/site-meta/brand`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getSocialSetting = async () => {
  const requestConfig = scGet(`${apiUrl}admin/site-meta/social`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};


const updateSiteMetaBatch = async (inputData) => {
  // 建立 FormData 物件來處理多部分表單數據
  const formData = new FormData();
  
  // 遍歷輸入數據並添加到 FormData
  inputData.settings.forEach((setting, index) => {
    formData.append(`settings[${index}][meta_key]`, setting.meta_key);
    formData.append(`settings[${index}][meta_value][${setting.meta_key}]`, setting.meta_value[setting.meta_key]);
  });
  const requestConfig = scPost(`${apiUrl}admin/site-meta/batch-update`, formData, false);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    console.error('Error updating site meta:', error);
    throw error;
  }
}

const getCourseReport = async (courseId) => {
  const requestConfig = scGet(`${apiUrl}admin/stats/${courseId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getCourseReportExcel = async (courseId) => {
  const requestConfig = {
    ...scGet(`${apiUrl}admin/stats/export/${courseId}`),
    responseType: 'blob' // 設定回應類型為blob以處理檔案下載
  };

  try {
    const response = await axios(requestConfig);
    
    // 建立下載用的URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // 建立暫時的a標籤來觸發下載
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `course-${courseId}-report.xlsx`); // 設定下載的檔案名稱
    document.body.appendChild(link);
    link.click();
    
    // 清理URL物件
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error;
  }
};

const getCourseStudents = async (courseId, params = {}) => {
  // 將分頁參數加入到請求URL中
  const queryString = objectToQueryString({
    page: params.page || 1,
    ...params
  });
  
  const requestConfig = scGet(`${apiUrl}admin/stats/${courseId}/student?${queryString}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getCourseStudent = async (courseId, studentId) => {
  const requestConfig = scGet(`${apiUrl}admin/stats/${courseId}/student/${studentId}`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getStudentExamDetail = async (formData) => {
  const requestConfig = scPost(`${apiUrl}admin/exam/student/detail`, formData);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getStudentLearningRecord = async (studentId, params = {}) => {
  // 將分頁參數加入到請求URL中
  const queryString = objectToQueryString({
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    ...params
  });
  
  const requestConfig = scGet(`${apiUrl}admin/stats/${studentId}/course?${queryString}`);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getQuestionStatistics = async (formData) => {
  const requestConfig = scPost(`${apiUrl}admin/exam/statistics/course`, formData);
  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
};

const getCourseStudentExcel = async (courseId, studentId) => {
  const requestConfig = {
    ...scGet(`${apiUrl}admin/stats/${courseId}/student/${studentId}/export`),
    responseType: 'blob' // 設定回應類型為blob以處理檔案下載
  };

  try {
    const response = await axios(requestConfig);
    
    // 建立下載用的URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // 建立暫時的a標籤來觸發下載
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `course-student-report.xlsx`); // 設定下載的檔案名稱
    document.body.appendChild(link);
    link.click();
    
    // 清理URL物件
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error;
  }
};

const getCourseStudentCert = async (courseId, studentId) => {
  const requestConfig = {
    ...scGet(`${apiUrl}admin/stats/${courseId}/student/${studentId}/pdf`),
    responseType: 'blob' // 設定回應類型為blob以處理檔案下載
  };

  try {
    const response = await axios(requestConfig);
    
    // 建立下載用的URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // 建立暫時的a標籤來觸發下載
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `course-student-cert.pdf`); // 設定下載的檔案名稱
    document.body.appendChild(link);
    link.click();
    
    // 清理URL物件
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    throw error;
  }
};

export default {
  apiUrl,
  apiWithoutPath,
  getServerToken,
  adminLogin,
  adminLogout,
  adminMe,
  adminEdit,
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  getTagsOption,
  getPlayers,
  getPlayer,
  updatePlayer,
  getPermissions,
  getPermission,
  addPermission,
  updatePermission,
  getPermissionOptions,
  listBanners,
  addBanner,
  editBanner,
  deleteBanner,
  bannerShow,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  createPost,
  uploadImage,
  courseImgUpload,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  registerAdmin,
  getTags,
  getTag,
  addTag,
  editTag,
  delTag,
  getInstructors,
  getInstructor,
  delInstructor,
  getInstructorsOption,
  addInstructor,
  updateInstructor,
  getChapters,
  getChapter,
  chapterPDFUpload,
  updateChapter,
  createChapter,
  getVimeoID,
  changeVimeoStatus,
  removeVimeo,
  getMembers,
  getMember,
  editMember,
  addMember,
  memberStatus,
  getExamLists,
  getQuestionLists,
  getQuestion,
  delQuestion,
  updateQuestion,
  addQuestion,
  getDashboard,
  getBrandSetting,
  getSocialSetting,
  updateSiteMetaBatch,
  getStats,
  downloadStatsExcel,
  getCourseReport,
  getCourseStudents,
  getCourseReportExcel,
  getCourseStudent,
  getCourseStudentExcel,
  getStudentExamDetail,
  getQuestionStatistics,
  getStudentLearningRecord,
  getCourseStudentCert
};
