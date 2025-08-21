// src/components/Inbox.js
import { useEffect, useRef, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  Container,
  Card,
  ListGroup,
  Button,
  Badge,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";

function Inbox({ userEmail }) {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMail, setSelectedMail] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Used to avoid unnecessary re-renders when data hasn't changed
  const prevSignatureRef = useRef("");

  const makeSignature = (items) =>
    JSON.stringify(
      items.map((m) => ({
        id: m.id,
        read: !!m.read,
        subject: m.subject || "",
        ts: m.timestamp || m.createdAt || "",
      }))
    );

  const fetchMails = async () => {
    try {
      setError("");
      // Efficient query: only get mails for this user, newest first
      const q = query(
        collection(db, "mails"),
        where("receiver", "==", userEmail),
        orderBy("timestamp", "desc")
      );

      const snap = await getDocs(q);
      const next = [];
      snap.forEach((d) => next.push({ id: d.id, ...d.data() }));

      // Optimized state updates – only update if signature changed
      const nextSignature = makeSignature(next);
      if (nextSignature !== prevSignatureRef.current) {
        prevSignatureRef.current = nextSignature;
        setMails(next);
        setUnreadCount(next.filter((m) => !m.read).length);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to fetch mails. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userEmail) return;
    fetchMails(); // initial fetch

    const interval = setInterval(fetchMails, 2000); // poll every 2s
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const handleOpenMail = async (mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      try {
        await updateDoc(doc(db, "mails", mail.id), { read: true });
        // Optimistic UI update
        setMails((prev) =>
          prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
        // Update signature so future polls compare correctly
        prevSignatureRef.current = makeSignature(
          mails.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
        );
      } catch (e) {
        console.error("Error marking as read:", e);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "mails", id));
      setMails((prev) => prev.filter((m) => m.id !== id));
      setUnreadCount((c) => {
        const wasUnread = mails.find((m) => m.id === id && !m.read);
        return wasUnread ? Math.max(0, c - 1) : c;
      });
      prevSignatureRef.current = makeSignature(
        mails.filter((m) => m.id !== id)
      );
      if (selectedMail?.id === id) setSelectedMail(null);
    } catch (e) {
      console.error("Error deleting mail: ", e);
      setError("Failed to delete mail.");
    }
  };

  const MailList = (
    <Card className="shadow-sm">
      <Card.Header className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold">Inbox</span>
          <Badge bg="primary" pill>
            {unreadCount}
          </Badge>
        </div>
      </Card.Header>
      <ListGroup variant="flush">
        {mails.length === 0 && !loading && (
          <ListGroup.Item>No mails available.</ListGroup.Item>
        )}
        {mails.map((mail) => (
          <ListGroup.Item
            key={mail.id}
            action
            className="d-flex align-items-center justify-content-between"
            onClick={(e) => {
              // avoid triggering open when clicking delete
              if (e.target.closest("button")) return;
              handleOpenMail(mail);
            }}
          >
            <div className="d-flex align-items-center gap-2">
              {!mail.read && (
                <span
                  aria-label="unread"
                  style={{ color: "#0d6efd", fontSize: 14, lineHeight: 1 }}
                >
                  ●
                </span>
              )}
              <div>
                <div className="fw-semibold">{mail.subject || "(No subject)"}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  From: {mail.sender}
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(mail.id)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
        {loading && (
          <ListGroup.Item className="d-flex align-items-center gap-2">
            <Spinner animation="border" size="sm" />
            Loading…
          </ListGroup.Item>
        )}
      </ListGroup>
    </Card>
  );

  const MailDetail = selectedMail && (
    <Card className="shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold">
          {selectedMail.subject || "(No subject)"}
        </span>
        <Button variant="outline-secondary" size="sm" onClick={() => setSelectedMail(null)}>
          Back to Inbox
        </Button>
      </Card.Header>
      <Card.Body>
        <div className="mb-2">
          <strong>From:</strong> {selectedMail.sender}
        </div>
        <div className="mb-3">
          <strong>To:</strong> {selectedMail.receiver}
        </div>
        <div>
          {/* Message may be HTML (from ReactQuill) or plain text */}
          {typeof selectedMail.body === "string" || typeof selectedMail.message === "string" ? (
            <div
              dangerouslySetInnerHTML={{
                __html: selectedMail.body || selectedMail.message || "",
              }}
            />
          ) : (
            <div>{selectedMail.body || selectedMail.message || ""}</div>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container className="py-3">
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError("")}
          dismissible
          className="mb-3"
        >
          {error}
        </Alert>
      )}
      <Row className="g-3">
        <Col lg={selectedMail ? 5 : 12}>{MailList}</Col>
        {selectedMail && <Col lg={7}>{MailDetail}</Col>}
      </Row>
    </Container>
  );
}

export default Inbox;
