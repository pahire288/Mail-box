import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Mailbox from "./components/Mailbox";
import MailComposer from "./components/MailComposer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showComposer, setShowComposer] = useState(false); // toggle between mailbox & composer

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
          {showComposer ? (
            <MailComposer onBack={() => setShowComposer(false)} />
          ) : (
            <Mailbox onComposeClick={() => setShowComposer(true)} />
          )}
        </div>
      )}

      {/* Toggle between Signup and Login */}
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
