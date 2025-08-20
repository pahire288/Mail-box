import { useEffect, useState } from "react";

function Inbox({ userEmail }) {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);

  // ✅ Fetch mails from Firebase (only for this user)
  useEffect(() => {
    const fetchMails = async () => {
      const res = await fetch("https://your-firebase-url/mails.json");
      const data = await res.json();

      if (data) {
        const loadedMails = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));

        // ✅ Filter only mails for this user
        const userMails = loadedMails.filter(
          (mail) => mail.receiver === userEmail
        );

        setMails(userMails);
      }
    };

    fetchMails();
  }, [userEmail]);

  // ✅ Open mail + mark as read
  const openMail = async (mail) => {
    setSelectedMail(mail);

    if (!mail.read) {
      // Update in backend
      await fetch(`https://your-firebase-url/mails/${mail.id}.json`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
        headers: { "Content-Type": "application/json" },
      });

      // Update in frontend state
      setMails((prev) =>
        prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
      );
    }
  };

  return (
    <div className="p-4">
      <h2>Inbox ({mails.filter((mail) => !mail.read).length})</h2>

      {/* Inbox list */}
      <div className="mail-list">
        {mails.map((mail) => (
          <div
            key={mail.id}
            onClick={() => openMail(mail)}
            style={{
              cursor: "pointer",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {!mail.read && (
              <span style={{ color: "blue", marginRight: "8px" }}>●</span>
            )}
            <strong>{mail.subject}</strong> - {mail.sender}
          </div>
        ))}
      </div>

      {/* Mail details */}
      {selectedMail && (
        <div className="mail-details mt-4 p-3 border rounded bg-light">
          <h3>{selectedMail.subject}</h3>
          <p>
            <strong>From:</strong> {selectedMail.sender}
          </p>
          <p>{selectedMail.body}</p>
        </div>
      )}
    </div>
  );
}

export default Inbox;
