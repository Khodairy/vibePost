for (i = 0; i < posts.length; i++) {
  let userName = posts[i].author.username;
  let userProfileImage = posts[i].author.profile_image;
  let postImage = posts[i].image;
  let timing = posts[i].created_at;
  let postComment = posts[i].comments_count;
  let postId = posts[i].id;
  let postTitle = "";
  let postBody = "";
  console.log(posts[i].body);
  console.log(
    `${userName} ${userProfileImage} ${postImage} ${timing} ${postComment} ${postId} ${postTitle} ${postBody}`
  );
  let postContent = `
                        <div class="card mb-4 shadow my-5" style="cursor: pointer;">
                            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <img class="profile-pic rounded-circle border border-2"
                                    src="${userProfileImage}" alt="">
                                    <span>${userName}</span>
                                </div>
                                <div style="display: flex; gap: 10px;">
                                    <button type="button" class="btn btn-secondary edit-btn" style="width: 80px; float: right;">Edit</button>
                                    <button type="button" class="btn btn-danger edit-btn" data-bs-toggle="modal" data-bs-target="#deleteModal" style="width: 80px; float: right ;">Delete</button>
                                </div>
                            </div>
                            <div class="card-body">
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
  //mainPosts.innerHTML += postContent;
}
