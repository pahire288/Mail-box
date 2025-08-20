// SentBox.js
import { useEffect, useState } from "react";
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

function SentBox({ userEmail }) {
  const [mails, setMails] = useState([]);

  useEffect(() => {
    const fetchMails = async () => {
      const querySnapshot = await getDocs(collection(db, "mails"));
      const allMails = [];
      querySnapshot.forEach((doc) => {
        allMails.push({ id: doc.id, ...doc.data() });
      });

      // ✅ Filter mails where logged-in user is the sender
      setMails(allMails.filter((mail) => mail.sender === userEmail));
    };

    fetchMails();
  }, [userEmail]);

  return (
    <div>
      <h2>Sent Mails</h2>
      {mails.map((mail) => (
        <div
          key={mail.id}
          className="border p-2 flex justify-between items-center"
        >
          <div>
            <strong>{mail.subject}</strong> - To: {mail.receiver}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SentBox;
