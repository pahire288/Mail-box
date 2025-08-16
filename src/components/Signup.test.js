import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Signup from "./Signup";
import { createUserWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth");

describe("Signup Component", () => {
  test("renders signup form with email, password, confirm password, and button", () => {
    render(<Signup />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();
  });

  test("shows error when fields are empty", () => {
    render(<Signup />);
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  test("shows error when passwords do not match", () => {
    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "654321" } });
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  test("disables signup button if fields are empty", () => {
    render(<Signup />);
    expect(screen.getByRole("button", { name: /signup/i })).toBeDisabled();
  });

  test("shows success message on successful signup", async () => {
    createUserWithEmailAndPassword.mockResolvedValue({ user: { email: "test@example.com" } });

    render(<Signup />);
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "123456" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /signup/i }));

    expect(await screen.findByText(/user registered successfully/i)).toBeInTheDocument();
  });
});
