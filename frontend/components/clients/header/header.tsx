export default function Header() {
  return (
    <header className="site-header">
      <div className="header-content">
        <h1 className="logo">Social-Network</h1>
        <nav className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/posts">Posts</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
