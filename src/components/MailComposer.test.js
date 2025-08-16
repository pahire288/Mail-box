import { render, screen, fireEvent } from "@testing-library/react";
import MailComposer from "./MailComposer";

describe("MailComposer Component", () => {
  test("renders recipient, subject and message input fields", () => {
    render(<MailComposer />);
    expect(screen.getByPlaceholderText(/Recipient Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByTestId("editor")).toBeInTheDocument(); // assuming editor has data-testid="editor"
  });

  test("shows validation error if recipient field is empty", () => {
    render(<MailComposer />);
    fireEvent.click(screen.getByText(/Send/i));
    expect(screen.getByText(/Recipient email is required/i)).toBeInTheDocument();
  });

  test("shows error for invalid recipient email format", () => {
    render(<MailComposer />);
    fireEvent.change(screen.getByPlaceholderText(/Recipient Email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.click(screen.getByText(/Send/i));
    expect(screen.getByText(/Please enter a valid email/i)).toBeInTheDocument();
  });

  test("calls send function when all fields are valid", () => {
    const mockSend = jest.fn();
    render(<MailComposer onSend={mockSend} />);

    fireEvent.change(screen.getByPlaceholderText(/Recipient Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Subject/i), {
      target: { value: "Hello" },
    });
    fireEvent.change(screen.getByTestId("editor"), {
      target: { value: "This is a test message" },
    });

    fireEvent.click(screen.getByText(/Send/i));
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  test("clears the form after sending mail successfully", () => {
    const mockSend = jest.fn();
    render(<MailComposer onSend={mockSend} />);

    const recipient = screen.getByPlaceholderText(/Recipient Email/i);
    const subject = screen.getByPlaceholderText(/Subject/i);
    const editor = screen.getByTestId("editor");

    fireEvent.change(recipient, { target: { value: "test@example.com" } });
    fireEvent.change(subject, { target: { value: "Hello" } });
    fireEvent.change(editor, { target: { value: "Message" } });

    fireEvent.click(screen.getByText(/Send/i));

    expect(recipient.value).toBe("");
    expect(subject.value).toBe("");
    expect(editor.value).toBe("");
  });
});
