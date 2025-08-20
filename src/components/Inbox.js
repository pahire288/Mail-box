import { useEffect, useState } from "react";
import MailComposer from "./MailComposer";

function Inbox({ currentUser }) {
  const [mails, setMails] = useState([]);
  const [showComposer, setShowComposer] = useState(false);

  useEffect(() => {
    // Replace with your Firebase Realtime DB URL
    fetch("https://YOUR_PROJECT_ID.firebaseio.com/mails.json")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          const loadedMails = Object.values(data).filter(
            (mail) => mail.receiver === currentUser.email
          );
          setMails(loadedMails);
        }
      })
      .catch((err) => console.error(err));
  }, [currentUser.email]);

  return (
    <div className="container mt-4">
      <h2>Inbox</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowComposer(true)}
      >
        Compose
      </button>

      {showComposer && <MailComposer sender={currentUser.email} />}

      <ul className="list-group">
        {mails.length === 0 ? (
          <li className="list-group-item">No mails received yet.</li>
        ) : (
          mails.map((mail, index) => (
            <li key={index} className="list-group-item">
              <strong>From:</strong> {mail.sender} <br />
              <strong>Subject:</strong> {mail.subject} <br />
              <p>{mail.body}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Inbox;
