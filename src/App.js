import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import MailComposer from "./components/MailComposer";
import Inbox from "./components/Inbox";  // ✅ Import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // store logged in user

  return (
    <div>
      {!isLoggedIn ? (
        showSignup ? (
          <Signup />
        ) : (
          <Login
            onLoginSuccess={(email) => {
              setIsLoggedIn(true);
              setUserEmail(email); // ✅ Save email after login
            }}
          />
        )
      ) : (
        <div>
          <MailComposer userEmail={userEmail} />
          <Inbox userEmail={userEmail} /> {/* ✅ Show Inbox */}
        </div>
      )}

      {/* Toggle Signup / Login */}
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
