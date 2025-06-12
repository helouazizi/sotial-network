export default function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="logo">Social-Network</h1>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/addPost">Add Post</a>
        </nav>
      </div>
    </header>
  );
}
