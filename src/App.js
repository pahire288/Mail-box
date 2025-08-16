import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Mailbox from "./components/Mailbox";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      {!isLoggedIn ? (
        showSignup ? (
          <Signup />
        ) : (
          <Login onLoginSuccess={() => setIsLoggedIn(true)} />
        )
      ) : (
        <Mailbox />
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
