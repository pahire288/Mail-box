import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Inbox from "./Inbox";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc } from "firebase/firestore";

// Mock Firestore methods
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

describe("Inbox Component - Delete Functionality", () => {
  const mockMails = [
    { id: "1", subject: "Hello", sender: "a@test.com", receiver: "user@test.com" },
    { id: "2", subject: "React Testing", sender: "b@test.com", receiver: "user@test.com" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should render mails for logged-in user", async () => {
    getDocs.mockResolvedValue({
      forEach: (cb) => mockMails.forEach((mail) => cb({ id: mail.id, data: () => mail })),
    });

    render(<Inbox userEmail="user@test.com" />);

    expect(await screen.findByText(/Hello/)).toBeInTheDocument();
    expect(await screen.findByText(/React Testing/)).toBeInTheDocument();
  });

  test("should delete a mail when Delete button is clicked", async () => {
    getDocs.mockResolvedValue({
      forEach: (cb) => mockMails.forEach((mail) => cb({ id: mail.id, data: () => mail })),
    });

    render(<Inbox userEmail="user@test.com" />);

    const deleteButtons = await screen.findAllByText(/Delete/);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteDoc).toHaveBeenCalled();
    });
  });

  test("should remove deleted mail from the UI", async () => {
    getDocs.mockResolvedValue({
      forEach: (cb) => mockMails.forEach((mail) => cb({ id: mail.id, data: () => mail })),
    });

    render(<Inbox userEmail="user@test.com" />);

    const firstMail = await screen.findByText(/Hello/);
    const deleteButtons = await screen.findAllByText(/Delete/);

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(firstMail).not.toBeInTheDocument();
    });
  });

  test("should handle delete error gracefully", async () => {
    console.error = jest.fn(); // suppress error log in test output

    getDocs.mockResolvedValue({
      forEach: (cb) => mockMails.forEach((mail) => cb({ id: mail.id, data: () => mail })),
    });

    deleteDoc.mockRejectedValueOnce(new Error("Delete failed"));

    render(<Inbox userEmail="user@test.com" />);

    const deleteButtons = await screen.findAllByText(/Delete/);
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error deleting mail: ", expect.any(Error));
    });
  });
});
