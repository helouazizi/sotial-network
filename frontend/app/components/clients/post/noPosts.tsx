export const NoPostsMessage = () => (
  <div className="no-posts-message">
    <h2>No posts yet</h2>
    <p>Looks like there’s nothing here. Start by creating a new post!</p>
    <a className="create-post-button" href="/addPost">
      Add Post
    </a>
  </div>
);
