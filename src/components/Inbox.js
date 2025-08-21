import { useMails } from "../hooks/useMails";

function Inbox({ userEmail }) {
  const { mails, loading, deleteMail } = useMails(userEmail, "inbox");

  if (loading) return <p>Loading...</p>;

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
            onClick={() => deleteMail(mail.id)}
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
