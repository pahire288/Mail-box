import { Container, Card } from "react-bootstrap";

export default function Mailbox() {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "400px" }} className="p-4 shadow-lg text-center">
        <h2>Welcome to your mail box 📬</h2>
      </Card>
    </Container>
  );
}
