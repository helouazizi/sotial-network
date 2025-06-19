'use client';

export default function Login() {
  return (
    <div className="login-container">
      {/* Intro Section */}
      <section>
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
      </section>

      {/* Login Form Section */}
      <section>
        <div id="welcom">
          <h1>Welcome</h1>
          <p>Something here</p>
        </div>

        {/* Email Input */}
        <div id="emailcontainer" className="input-group">
          <label htmlFor="email" className="sr-only">Email</label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            width="32"
            height="32"
            fill="currentColor"
          >
            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
          </svg>
          <input type="email" name="email" id="email" placeholder="Email" />
        </div>

        {/* Password Input */}
        <div id="passwordcontainer" className="input-group">
          <label htmlFor="password" className="sr-only">Password</label>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="32"
            height="32"
            fill="currentColor"
            enableBackground="new 0 0 100 100" // SVG attribute, not style
          >

            {/* You can keep your path here */}
            <path d="M86.776,33.97l-7.106-6.611l4.926-5.294c1.151-1.239..." />
            <path d="M32.999,61.242c-1.873,0.031-3.621,0.789..." />
          </svg>
          <input type="password" name="password" id="password" placeholder="Password" />
        </div>
        <div>
          <button>login</button>
        </div>
      </section>
    </div>
  );
}
