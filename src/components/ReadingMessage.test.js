import { render, screen, fireEvent } from "@testing-library/react";
import ReadingMessage from "../components/ReadingMessage";

// Mock mail data
const mockMail = {
  id: "mail1",
  subject: "Test Mail",
  body: "This is the full mail body",
  sender: "sender@example.com",
  read: false,
  timestamp: "2025-08-16T12:00:00Z"
};

describe("ReadingMessage Component", () => {
  test("renders full mail content when opened", () => {
    render(<ReadingMessage mail={mockMail} />);

    expect(screen.getByText("Test Mail")).toBeInTheDocument();
    expect(screen.getByText("sender@example.com")).toBeInTheDocument();
    expect(screen.getByText("This is the full mail body")).toBeInTheDocument();
  });

  test("marks mail as read when opened", () => {
    const onMarkAsRead = jest.fn();

    render(<ReadingMessage mail={mockMail} onMarkAsRead={onMarkAsRead} />);

    // Simulate opening the mail
    fireEvent.click(screen.getByText("Test Mail"));

    expect(onMarkAsRead).toHaveBeenCalledWith("mail1");
  });

  test("mail remains read after refresh (mock persistence)", () => {
    const readMail = { ...mockMail, read: true };

    render(<ReadingMessage mail={readMail} />);

    // Blue dot should NOT be present for read mails
    const dot = screen.queryByTestId("blue-dot");
    expect(dot).toBeNull();
  });
});

