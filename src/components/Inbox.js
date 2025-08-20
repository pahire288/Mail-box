// Inbox.js
import { useEffect, useState } from "react";
import { db } from "../firebase"; // your firebase config
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function Inbox({ userEmail }) {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchMails = async () => {
      const querySnapshot = await getDocs(collection(db, "mails"));
      const allMails = [];
      querySnapshot.forEach((doc) => {
        allMails.push({ id: doc.id, ...doc.data() });
      });

      // Only fetch mails where receiver matches logged-in user
      setMails(allMails.filter((mail) => mail.receiver === userEmail));
    };

    fetchMails();
  }, [userEmail]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "mails", id));
      setMails((prev) => prev.filter((mail) => mail.id !== id)); // update UI
    } catch (err) {
      console.error("Error deleting mail: ", err);
    }
  };

  return (
    <div>
      <h2>Inbox</h2>
      {mails.map((mail) => (
        <div
          key={mail.id}
          className="border p-2 flex justify-between items-center"
        >
          <div>
            <strong>{mail.subject}</strong> - {mail.sender}
          </div>
          <button
            onClick={() => handleDelete(mail.id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Inbox;
