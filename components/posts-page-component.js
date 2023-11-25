import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, getToken, renderApp } from "../index.js";
import { addLike, getPosts, removeLike } from "../api.js";

export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  appEl.innerHTML = posts.map((post, index) => {
    return `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
              <img src="${post.user.imageUrl}" class="post-header__user-image">
              <p class="post-header__user-name">${post.user.name}</p>
          </div>
          <div class="post-image-container">
            <img class="post-image" src="${post.imageUrl}">
          </div>
          <div class="post-likes">
            <button data-post-id="${
              post.id
            }" class="like-button" data-index="${index}">
              <img src="${
                post.isLiked
                  ? "./assets/images/like-active.svg"
                  : "./assets/images/like-not-active.svg"
              }">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${
                post.likes.length > 1
                  ? post.likes[0].name + " и ещё " + (post.likes.length - 1)
                  : post.likes.length
              }</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${post.user.name}</span>
            ${post.description}
          </p>
          <p class="post-date">
          ${post.createdAt}
          </p>
        </li>
      </ul>
    </div>`;
  });

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }

  const likeButtonsElement = document.querySelectorAll(".like-button");
  for (const likeButtonElement of likeButtonsElement) {
    likeButtonElement.addEventListener("click", () => {
      const postId = likeButtonElement.dataset.postId;
      const index = likeButtonElement.dataset.index;
      if (!posts[index].isLiked) {
        addLike({
          token: getToken(),
          postId,
        })
          .then(() => {
            posts[index].isLiked = true;
            posts[index].likes.length++;
            renderApp();
          })
          .catch((error) => {
            console.error(error);
            alert("Авторизуйтесь, чтобы лайкнуть пост");
          });
      } else {
        removeLike({
          token: getToken(),
          postId,
        })
          .then(() => {
            posts[index].isLiked = false;
            posts[index].likes.length--;
            renderApp();
          })
      }
    });
  }
}
