export default function Register() {
  return (
    <main className="register-form">
      <form>
        <div className="names">
          <div className="lastname">
            <h1>First Name</h1>
            <input type="text" name="first-name" id="first-name" />
          </div>
          <div className="lastname">
            <h1>Last Name</h1>
            <input type="text" name="last-name" id="last-name" />
          </div>
        </div>

        <div className="credential">
          <div className="email">
            <h1>Email:</h1>
            <input type="email" name="email" id="Email" />
          </div>
          <div className="password">
            <h1>Password:</h1>
            <input type="password" name="pass" id="pass" />
          </div>
        </div>

        <div className="opt">
          <div className="Username">
            <h1>Username:</h1>
            <input type="text" name="Username" id="Username" />
          </div>
          <div className="avatar">
            <h1>Profile:</h1>
            <input type="file" name="avatar" id="avatar" />
          </div>
        </div>

        <div className="dob-about">
          <div className="DOB">
            <h1>Date of Birth:</h1>
            <input type="date" name="date" id="date" />
          </div>
          <div className="aboutme">
            <h1>About Me:</h1>
            <input type="text" name="aboutme" id="aboutme" />
          </div>
        </div>

        <button type="submit">Register</button>
      </form>
    </main>
  );
}