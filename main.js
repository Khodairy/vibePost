let baseUrl = "https://tarmeezacademy.com/api/v1/";
let mainPosts = document.querySelector(".posts");

setUpUI();

// ============= handle Pagination scroll ==============
let currentPage = 1;
let isLoading = false;
let lastPage = 1;
getPosts(true, currentPage);

window.addEventListener("scroll", () => {
  let endPoint =
    window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
  if (endPoint && !isLoading && currentPage < lastPage) {
    currentPage++;
    getPosts(false, currentPage);
  }
});

// ============= get post =============
function getPosts(reload = true, currentPage) {
  if (isLoading) return;
  isLoading = true;

  // Show spinner
  document.getElementById("loading").style.display = "block";

  if (reload) {
    document.querySelector(".posts").innerHTML = "";
  }

  axios({
    method: "get",
    url: `${baseUrl}posts?limit=2&page=${currentPage}`,
  })
    .then(function (response) {
      let posts = response.data.data;
      lastPage = response.data.meta.last_page;
      for (i = 0; i < posts.length; i++) {
        let userName = posts[i].author.username;
        let userProfileImage = posts[i].author.profile_image;
        let postImage = posts[i].image;
        let timing = posts[i].created_at;
        let postComment = posts[i].comments_count;
        let postId = posts[i].id;
        let postTitle = "";
        let postBody = "";
        let userId = posts[i].author.id;
        console.log(userId);

        if (posts[i].title != null) {
          postTitle = posts[i].title;
        }

        if (posts[i].body != null) {
          postBody = posts[i].body;
        }

        if (!userProfileImage || typeof userProfileImage !== "string") {
          userProfileImage = "./profile-pic/mainPic.avif";
        }
        if (!postImage || typeof postImage !== "string") {
          postImage = "./placeholder/default-image.webp";
        }

        let user = getCurrentUser();
        console.log(user);
        let isMyPost =
          user && user.id != null && posts[i].author.id === user.id;
        let displayEditButton = isMyPost ? "inline-block" : "none";

        let postJson = JSON.stringify(posts[i]);
        let escapedPost = postJson
          .replace(/&/g, "&amp;")
          .replace(/'/g, "&#39;")
          .replace(/\"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/\n/g, "\\n");

        let post = `
        <div class="card mb-4 shadow my-5" style="cursor: pointer;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                <div onClick="openProfileDetails(${userId})">
                  <img class="profile-pic rounded-circle border border-2"
                  src="${userProfileImage}" alt="">
                  <span>${userName}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                  <button type="button" class="btn btn-secondary edit-btn" style="width: 80px; float: right ;display: ${displayEditButton}" data-post='${escapedPost}' onClick="editPost(event, this)">Edit</button>
                  <button type="button" class="btn btn-danger edit-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" style="width: 80px; float: right ;display: ${displayEditButton}" data-post='${escapedPost}' onClick="deletePost(event, this)">Delete</button>
                </div>
            </div>
            <div class="card-body" onClick="postClicked(${postId})">
                <img class="postPic w-100 rounded" src="${postImage}" style="height: 500px;" alt="">
                <h6 class="card-title mt-1" style="color: rgb(186, 184, 184);">${timing}</h6>
                <h5>${postTitle}</h5>
                <p class="card-text">${postBody}
                </p>
                <hr>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-pen" viewBox="0 0 16 16">
                        <path
                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z" />
                    </svg> <span>(${postComment}) comment</span>
                </div>
            </div>
        </div>
    `;
        mainPosts.innerHTML += post;
      }
    })
    .finally(() => {
      isLoading = false; // 👈 أهم سطر

      // Hide spinner
      document.getElementById("loading").style.display = "none";
    });
}

// ============== log in ===============
let btnLogin = document.querySelector(".btnLogin");
btnLogin.addEventListener("click", () => {
  let userName = document.querySelector(".userNameInput");
  let password = document.querySelector(".passwordInput");
  let profileName = document.getElementById("profileName");
  let profilePhotoHTML = document.getElementById("profilePhoto");

  const url = `${baseUrl}login`;
  const params = { username: userName.value, password: password.value };
  axios
    .post(url, params)
    .then(function (response) {
      console.log(response);
      console.log(response.data.user);
      let token = response.data.token;
      let user = response.data.user;
      let profilePhotoData = response.data.user.profile_image;

      // Normalize profile photo: API may return string URL or an object.
      let profilePhotoString = "./profile-pic/mainPic.avif";
      if (typeof profilePhotoData === "string") {
        profilePhotoString = profilePhotoData;
      } else if (profilePhotoData && typeof profilePhotoData === "object") {
        profilePhotoString =
          profilePhotoData.url ||
          profilePhotoData.path ||
          profilePhotoData.file ||
          profilePhotoString;
      }

      localStorage.setItem("profilePhoto", profilePhotoString);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      const storedUser = JSON.parse(localStorage.getItem("user"));
      profileName.textContent = storedUser.username;
      profilePhotoHTML.src =
        localStorage.getItem("profilePhoto") || "./profile-pic/mainPic.avif";

      showAlert("Nice, you login successfully", "success");
      let modal = bootstrap.Modal.getInstance(
        document.getElementById("exampleModal")
      );
      modal.hide();
      setUpUI();
    })
    .catch(function (error) {
      console.log(error);
      showAlert("Login failed, please try again", "danger");
    });
});

// ============== Register ===============
let btnRegister = document.querySelector(".btnRegister");
btnRegister.addEventListener("click", () => {
  let userName = document.getElementById("userForRegister");
  let password = document.getElementById("passwordForRegister");
  let nickName = document.getElementById("nicknameForRegister");
  let email = document.getElementById("emailForRegister");
  let image = document.getElementById("imageForRegister");

  if (!image.files[0]) {
    showAlert("Please select an image", "warning");
    return;
  }

  const url = `${baseUrl}register`;
  let formData = new FormData();
  formData.append("username", userName.value);
  formData.append("password", password.value);
  formData.append("name", nickName.value);
  formData.append("email", email.value);
  formData.append("image", image.files[0]);

  axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then(function (response) {
      let token = response.data.token;
      let user = response.data.user.username;
      let profilePhoto = response.data.user.profile_image;

      // Normalize profile photo before storing (avoid storing [object Object])
      let profilePhotoString = "./profile-pic/mainPic.avif";
      if (typeof profilePhoto === "string") {
        profilePhotoString = profilePhoto;
      } else if (profilePhoto && typeof profilePhoto === "object") {
        profilePhotoString =
          profilePhoto.url ||
          profilePhoto.path ||
          profilePhoto.file ||
          profilePhotoString;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("profilePhoto", profilePhotoString);
      localStorage.setItem("user", JSON.stringify(user));
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Registered User:", storedUser);
      showAlert("New User Registered Successfully", "success");

      let modal = bootstrap.Modal.getInstance(
        document.getElementById("registerModal")
      );
      modal.hide();

      setUpUI();
    })
    .catch(function (error) {
      console.log(error.response.data.message);
      showAlert(error.response.data.message, "danger");
    });
});

// ============== Create Post ============
let btnCreatePost = document.querySelector(".btnCreatePost");
function createPost() {
  btnCreatePost.addEventListener("click", () => {
    let postId = document.getElementById("inputValueId").value;
    let isCreate = true;
    isCreate = postId === "" || postId === null || postId === undefined;

    let title = document.querySelector(".titlePostInput");
    let body = document.querySelector("#bodyPostInput");
    let imagePostInput = document.querySelector(".imagePostInput");

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("body", body.value);

    if (imagePostInput.files[0]) {
      formData.append("image", imagePostInput.files[0]);
    }

    let url = "";

    if (isCreate) {
      url = `${baseUrl}posts`;
    } else {
      url = `${baseUrl}posts/${postId}`;
      formData.append("_method", "put");
    }
    axios
      .post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (response) {
        console.log(response);

        showAlert("Create A New Post Successfully", "success");

        let modal = bootstrap.Modal.getInstance(
          document.getElementById("createPostModel")
        );
        modal.hide();

        getPosts();

        title.value = "";
        body.value = "";
        imagePostInput.value = "";
        setUpUI();
      })
      .catch(function (error) {
        console.log(error.response.data.message);
        showAlert(error.response.data.message, "danger");
      });
  });
}
createPost();

// ============== log out ===============
document.addEventListener("DOMContentLoaded", () => {
  let btnLogout = document.getElementById("btnLogout");
  btnLogout.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("profilePhoto");

    showAlert("You are logged out", "success");
    setUpUI();
  });

  setUpUI();
});

// ============== set up UI ==============
function setUpUI() {
  let token = localStorage.getItem("token");
  let btnLogin = document.getElementById("btnLogin");
  let btnRegister = document.getElementById("btnRegister");
  let profilePhotoHTML = document.getElementById("profilePhoto");
  let profileName = document.getElementById("profileName");
  let btnForPost = document.getElementById("btnForPost");
  let btnLogout = document.getElementById("btnLogout");
  const editButtons = document.querySelectorAll(".edit-btn");

  if (!token) {
    if (btnLogout) btnLogout.style.display = "none";
    btnLogin.style.display = "inline-block";
    btnRegister.style.display = "inline-block";
    profilePhotoHTML.src = "./profile-pic/mainPic.avif"; // default
    profileName.textContent = "guest";
    btnForPost.style.display = "none";
    // Hide edit buttons on logout
    editButtons.forEach((b) => (b.style.display = "none"));
    return;
  }
  if (btnLogout) btnLogout.style.display = "inline-block";
  btnLogin.style.display = "none";
  btnRegister.style.display = "none";
  btnForPost.style.display = "inline-block";

  // Show edit buttons on login
  editButtons.forEach((b) => (b.style.display = "inline-block"));

  profilePhotoHTML.src =
    localStorage.getItem("profilePhoto") || "./profile-pic/mainPic.avif";
  // Defensive: if someone previously stored a non-url (e.g. "[object Object]")
  let storedPhoto = localStorage.getItem("profilePhoto");
  if (!storedPhoto || storedPhoto === "[object Object]") {
    profilePhotoHTML.src = "./profile-pic/mainPic.avif";
  } else {
    profilePhotoHTML.src = storedPhoto;
  }
  // Read `user` from localStorage. Some code stores a plain username string
  // while other places store a JSON-stringified user object. Handle both.
  const storedUserRaw = localStorage.getItem("user");
  let userInfo = null;
  if (storedUserRaw) {
    try {
      // If it's JSON (stringified object), parse it
      userInfo = JSON.parse(storedUserRaw);
    } catch (e) {
      // Not JSON -> treat as plain username string
      userInfo = { username: storedUserRaw };
    }
  } else {
    userInfo = { username: null };
  }

  profileName.textContent = (userInfo && userInfo.username) || "user";
}

// ============= show Alert ===================
function showAlert(message, bg) {
  const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${bg}  alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;

  const alertElement = wrapper.firstElementChild;

  alertPlaceholder.append(wrapper);

  // تخفي الرسالة بعد 3 ثواني
  setTimeout(() => {
    alertElement.classList.remove("show");
    alertElement.classList.add("fade");

    // بعد نص ثانية يشيل العنصر نهائيًا
    setTimeout(() => {
      wrapper.remove();
    }, 500);
  }, 3000);
}

function postClicked(postId) {
  window.location = `./postDetails.html?postId=${postId}`;
}

// ============ Edit Post Function ===========
function editPost(event, el) {
  event.stopPropagation(); // يمنع فتح postClicked

  // حاول قراءة الـ post من dataset لو مررنا العنصر (this)
  let post = null;
  try {
    if (el && el.dataset && el.dataset.post) {
      post = JSON.parse(el.dataset.post);
    }
  } catch (e) {
    console.error("Failed to parse post data", e);
  }
  console.log(post);

  let postModal = new bootstrap.Modal(
    document.getElementById("createPostModel")
  );
  postModal.toggle();

  // ضع ID البوست في الحقل المخفي لتحديد أنه edit وليس create
  document.getElementById("inputValueId").value = post.id || "";

  document.querySelector(".postModalLapel").innerHTML = "Edit Post";
  document.querySelector(".btnCreatePost").innerHTML = "Update";

  document.querySelector(".titlePostInput").value = post.title || "";
  document.querySelector("#bodyPostInput").value = post.body || "";
  document.querySelector(".imagePostInput").src = post.image || "";
}

// ============ Delete Post Function ===========
function deletePost(event, el) {
  event.stopPropagation(); // يمنع فتح postClicked

  // حاول قراءة الـ post من dataset لو مررنا العنصر (this)
  let post = null;
  try {
    if (el && el.dataset && el.dataset.post) {
      post = JSON.parse(el.dataset.post);
    }
  } catch (e) {
    console.error("Failed to parse post data", e);
  }
  console.log(post);

  let btnDeletePost = document.getElementById("btnDeletePost");

  btnDeletePost.onclick = function () {
    axios({
      method: "delete",
      url: `${baseUrl}posts/${post.id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log("Post Deleted:", response.data);
        showAlert("Post deleted successfully", "success");

        let modal = bootstrap.Modal.getInstance(
          document.getElementById("deleteModal")
        );
        modal.hide();

        // إعادة تحميل البوستات
        getPosts();
      })
      .catch((error) => {
        console.error(error);
        showAlert("Failed to delete post", "danger");
      });
  };
}

// ============ Get Current User ===========
function getCurrentUser() {
  let getUserInfo = localStorage.getItem("user");
  console.trace("getCurrentUser called");
  // لو مفيش user → ارجع null
  if (!getUserInfo) {
    return null;
  }

  try {
    // لو JSON → رجعه ك object
    return JSON.parse(getUserInfo);
  } catch {
    // لو تم تخزين username فقط ك string → رجعه
    return { username: getUserInfo };
  }
}

// ============ Reset Create Post Modal on Click ===========
document.getElementById("postModalLabel").addEventListener("click", () => {
  document.querySelector(".postModalLapel").innerHTML = "Create New Post";
  document.querySelector(".btnCreatePost").innerHTML = "Create";
  document.querySelector(".titlePostInput").value = "";
  document.querySelector("#bodyPostInput").value = "";
  document.querySelector(".imagePostInput").src = "";
  document.getElementById("inputValueId").value = "";
});

function openProfileDetails(id) {
  window.location = `./profile.html?userId=${id}`;
}

function profileClicked() {
  let user = getCurrentUser();
  window.location = `./profile.html?userId=${user.id}`;
}
