export default function login() {
  return (
    <div>
      <div>
        <div>
          <h1 id="title">Join the elite</h1>
          <p>Something here</p>
        </div>

        <div>
          <h1 className="content">Community</h1>
          <p>Something here</p>
        </div>

        <div>
          <h1 className="content">Chat</h1>
          <p>Something here</p>
        </div>

        <div>
          <h1 className="content">News</h1>
          <p>Something here</p>
        </div>
      </div>

      <div>
        <div id="welcom">
          <h1>Welcome</h1>
          <p>Something here</p>
        </div>

        <div id="emailcontainer">
          {/* User icon as inline SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="32"
            height="32"
            fill="currentColor"
          >
            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
          </svg>
          <input type="email" name="email" id="email" />
        </div>
        <div id="passwordcontainer">
        </div>
      </div>
    </div>
  );
}
