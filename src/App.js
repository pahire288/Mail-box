import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Inbox from "./components/Inbox";
import Sentbox from "./components/Sentbox";
import MailComposer from "./components/MailComposer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [activePage, setActivePage] = useState("inbox");
  const currentUser = { email: "test@gmail.com" }; // Replace with firebase auth user

  return (
    <div>
      {!isLoggedIn ? (
        showSignup ? (
          <Signup />
        ) : (
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
        )
      ) : (
        <div>
          {/* Navigation */}
          <nav className="d-flex gap-3 p-3 bg-light">
            <button className="btn btn-outline-primary" onClick={() => setActivePage("inbox")}>
              Inbox
            </button>
            <button className="btn btn-outline-primary" onClick={() => setActivePage("sent")}>
              Sentbox
            </button>
            <button className="btn btn-outline-primary" onClick={() => setActivePage("compose")}>
              Compose
            </button>
          </nav>

          {/* Pages */}
          {activePage === "inbox" && <Inbox currentUser={currentUser} />}
          {activePage === "sent" && <Sentbox currentUser={currentUser} />}
          {activePage === "compose" && <MailComposer sender={currentUser.email} />}
        </div>
      )}

      {/* Toggle Signup/Login */}
      <div className="text-center mt-3">
        {!isLoggedIn && (
          <button
            className="btn btn-link"
            onClick={() => setShowSignup(!showSignup)}
          >
            {showSignup
              ? "Already have an account? Login"
              : "Don't have an account? Signup"}
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
