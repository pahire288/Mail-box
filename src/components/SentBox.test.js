import { render, screen, fireEvent } from "@testing-library/react";
import SentBox from "../components/SentBox";

// Mock Firebase (same as you did for Inbox tests)
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({
    forEach: (cb) => {
      cb({ id: "1", data: () => ({ subject: "Subject 1", receiver: "test@abc.com", sender: "me@example.com" }) });
      cb({ id: "2", data: () => ({ subject: "Subject 2", receiver: "test@xyz.com", sender: "me@example.com" }) });
    }
  })),
  deleteDoc: jest.fn(() => Promise.resolve()),
  doc: jest.fn(),
}));

describe("SentBox Component", () => {
  test("renders sent mails", async () => {
    render(<SentBox userEmail="me@example.com" />);
    expect(await screen.findByText(/Subject 1/i)).toBeInTheDocument();
    expect(await screen.findByText(/Subject 2/i)).toBeInTheDocument();
  });

  test("shows 'No sent mails available' when empty", async () => {
    jest.spyOn(require("firebase/firestore"), "getDocs").mockResolvedValueOnce({
      forEach: () => {}, // No mails
    });
    render(<SentBox userEmail="me@example.com" />);
    expect(await screen.findByText(/No sent mails available/i)).toBeInTheDocument();
  });

  test("clicking a mail shows its details", async () => {
    render(<SentBox userEmail="me@example.com" />);
    const mail = await screen.findByText(/Subject 1/i);
    fireEvent.click(mail);
    expect(await screen.findByText(/Message/i)).toBeInTheDocument();
  });

  test("deletes a sent mail and updates UI", async () => {
    render(<SentBox userEmail="me@example.com" />);
    const deleteBtn = await screen.findAllByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn[0]);
    expect(await screen.findAllByText(/Subject/i)).toHaveLength(1);
  });

  test("shows empty state when all sent mails are deleted", async () => {
    render(<SentBox userEmail="me@example.com" />);
    const deleteBtns = await screen.findAllByRole("button", { name: /delete/i });
    deleteBtns.forEach((btn) => fireEvent.click(btn));
    expect(await screen.findByText(/No sent mails available/i)).toBeInTheDocument();
  });
});
