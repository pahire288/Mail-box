it("calls onLoginSuccess on successful login", async () => {
  const mockOnLoginSuccess = jest.fn();
  const mockUser = { getIdToken: jest.fn().mockResolvedValue("fake-token") };

  signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });

  render(<Login onLoginSuccess={mockOnLoginSuccess} />);
  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "test@example.com" } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  expect(await screen.findByText(/login/i)).toBeInTheDocument(); // wait for rerender
  expect(mockUser.getIdToken).toHaveBeenCalled();
  expect(localStorage.getItem("authToken")).toBe("fake-token");
  expect(mockOnLoginSuccess).toHaveBeenCalled();
});
