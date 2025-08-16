import { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { auth } from "../firebase";

export default function MailComposer() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendMail = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!to || !subject || !message) {
      setError("All fields are required!");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("You must be logged in to send mail.");
        return;
      }

      const senderEmail = user.email.replace(/\./g, "_"); // Firebase keys can't have "."
      const receiverEmail = to.replace(/\./g, "_");

      const mailData = {
        from: user.email,
        to,
        subject,
        message,
        timestamp: new Date().toISOString(),
      };

      // ✅ Store in receiver inbox
      await fetch(
        `https://login-auth-9cc37-default-rtdb.firebaseio.com/mails/${receiverEmail}/inbox.json`,
        {
          method: "POST",
          body: JSON.stringify(mailData),
          headers: { "Content-Type": "application/json" },
        }
      );

      // ✅ Store in sender sentbox
      await fetch(
        `https://login-auth-9cc37-default-rtdb.firebaseio.com/mails/${senderEmail}/sent.json`,
        {
          method: "POST",
          body: JSON.stringify(mailData),
          headers: { "Content-Type": "application/json" },
        }
      );

      setSuccess("Mail sent successfully!");
      setTo("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError("Failed to send mail. Please try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "600px" }} className="p-4 shadow-lg">
        <h3 className="text-center mb-3">Compose Mail</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSendMail}>
          <Form.Group className="mb-3">
            <Form.Label>To</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter receiver's email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Message</Form.Label>
            <ReactQuill theme="snow" value={message} onChange={setMessage} />
          </Form.Group>

          <Button type="submit" variant="primary" className="w-100">
            Send Mail
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
