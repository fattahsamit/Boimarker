export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Register user
export async function register(email: string, password: string): Promise<void> {
  const res = await fetch("http://localhost:8000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Registration failed");
}

// Login user
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch("http://localhost:8000/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }).toString(),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}
