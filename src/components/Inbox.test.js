import { render, screen, fireEvent } from "@testing-library/react";
import Inbox from "./Inbox";

// Mock fetch globally
beforeEach(() => {
  global.fetch = jest.fn();
});

// 1. Renders Inbox title
test("renders Inbox title", () => {
  render(<Inbox currentUser={{ email: "test@gmail.com" }} />);
  expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
});

// 2. Shows 'No mails received yet' when inbox is empty
test("shows empty state when no mails are received", async () => {
  global.fetch.mockResolvedValueOnce({
    json: async () => null,
  });

  render(<Inbox currentUser={{ email: "test@gmail.com" }} />);
  expect(await screen.findByText(/No mails received yet/i)).toBeInTheDocument();
});

// 3. Displays received mails correctly
test("displays mails for the current user", async () => {
  const mockMails = {
    m1: { sender: "alice@gmail.com", receiver: "test@gmail.com", subject: "Hello", body: "Hi there!" },
    m2: { sender: "bob@gmail.com", receiver: "other@gmail.com", subject: "Ignore", body: "Not for you" }
  };

  global.fetch.mockResolvedValueOnce({
    json: async () => mockMails,
  });

  render(<Inbox currentUser={{ email: "test@gmail.com" }} />);
  
  expect(await screen.findByText(/From: alice@gmail.com/i)).toBeInTheDocument();
  expect(screen.getByText(/Subject: Hello/i)).toBeInTheDocument();
  expect(screen.queryByText(/From: bob@gmail.com/i)).not.toBeInTheDocument();
});

// 4. Opens MailComposer on Compose button click
test("opens MailComposer when compose button is clicked", () => {
  render(<Inbox currentUser={{ email: "test@gmail.com" }} />);
  
  fireEvent.click(screen.getByText(/Compose/i));
  
  expect(screen.getByText(/Send Mail/i)).toBeInTheDocument();
});

// 5. Handles fetch error gracefully
test("handles fetch error gracefully", async () => {
  global.fetch.mockRejectedValueOnce("API failure");

  render(<Inbox currentUser={{ email: "test@gmail.com" }} />);
  
  expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
});
