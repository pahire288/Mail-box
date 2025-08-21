import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

export function useMails(userEmail, type = "inbox") {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch mails
  const fetchMails = async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(db, "mails"));
    const allMails = [];
    querySnapshot.forEach((docItem) => {
      allMails.push({ id: docItem.id, ...docItem.data() });
    });

    if (type === "inbox") {
      setMails(allMails.filter((mail) => mail.receiver === userEmail));
    } else if (type === "sent") {
      setMails(allMails.filter((mail) => mail.sender === userEmail));
    }

    setLoading(false);
  };

  // Delete mail
  const deleteMail = async (id) => {
    await deleteDoc(doc(db, "mails", id));
    setMails((prev) => prev.filter((mail) => mail.id !== id));
  };

  // Send mail
  const sendMail = async (newMail) => {
    await addDoc(collection(db, "mails"), newMail);
    if (type === "sent") {
      setMails((prev) => [...prev, newMail]);
    }
  };

  useEffect(() => {
    fetchMails();

    // Poll every 2 seconds for new mails
    const interval = setInterval(fetchMails, 2000);

    return () => clearInterval(interval);
  }, [userEmail, type]);

  return { mails, loading, deleteMail, sendMail, fetchMails };
}
