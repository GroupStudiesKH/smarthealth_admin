import axios from "axios";

const currentHost = window.location.hostname;

let apiUrl, homeUrl;

if (currentHost === 'localhost') {
  apiUrl = "http://localhost:8000/api/";
  homeUrl = "http://localhost:5173/";
} else if (currentHost.endsWith('.hanyuan.info')) {
  apiUrl = "https://api.smarthealth.hanyuan.info/api/";
  homeUrl = "https://admin.smarthealth.hanyuan.info/";
} else {
  // Default fallback, you might want to adjust this
  apiUrl = "http://localhost:8000/api/";
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
  if (responseData.data.status != 'success' || responseData.status != 200) {
    // Error response
    throw responseData.data.message;
  }
  return responseData.data.content;
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

const getPost = async (postId) => {
  const requestConfig = scGet(`${apiUrl}admin/posts/${postId}`);

  try {
    const response = await axios(requestConfig);
    return checkServerResponse(response);
  } catch (error) {
    throw error;
  }
}

const getCategories = async () => {
  const requestConfig = scGet(`${apiUrl}admin/categories`);

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

export default {
  apiUrl,
  getServerToken,
  adminLogin,
  adminLogout,
  adminMe,
  adminEdit,
  getCourses,
  getCourse,
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
  getCategories,
  updatePost,
  deletePost,
  createPost,
  uploadImage,
  getAdmins,
  getAdmin,
  deleteAdmin,
  updateAdmin,
  registerAdmin,
  getTags,
  getTag,
  addTag,
  editTag
};
