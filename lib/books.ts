export const STATUSES = ["To Read", "Reading", "Finished"] as const;
export type BookStatus = (typeof STATUSES)[number];

export type Book = {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  created_at: string;
};

export function nextStatus(status: BookStatus): BookStatus | null {
  const i = STATUSES.indexOf(status);
  return i >= 0 && i < STATUSES.length - 1 ? STATUSES[i + 1] : null;
}

// ---------- validation ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export function validateAuth(
  v: { email: string; password: string; confirmPassword?: string },
  mode: "login" | "register"
): AuthErrors {
  const errors: AuthErrors = {};
  const email = v.email.trim();
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address";

  if (!v.password) errors.password = "Password is required";
  else if (mode === "register" && v.password.length < 6)
    errors.password = "Password must be at least 6 characters";

  if (mode === "register") {
    const c = v.confirmPassword ?? "";
    if (!c) errors.confirmPassword = "Confirm password is required";
    else if (c !== v.password) errors.confirmPassword = "Passwords do not match";
  }
  return errors;
}

export type BookErrors = {
  title?: string;
  author?: string;
  pages?: string;
  status?: string;
};

export function validateBook(v: {
  title: string;
  author: string;
  pages: string;
  status: string;
}): BookErrors {
  const errors: BookErrors = {};
  const title = v.title.trim();
  if (!title) errors.title = "Title is required";
  else if (title.length > 80) errors.title = "Title must be at most 80 characters";

  const author = v.author.trim();
  if (!author) errors.author = "Author is required";
  else if (author.length > 60) errors.author = "Author must be at most 60 characters";

  const pages = v.pages.trim();
  if (!pages) errors.pages = "Pages is required";
  else {
    const n = Number(pages);
    if (!/^\d+$/.test(pages) || n < 1 || n > 5000)
      errors.pages = "Pages must be a whole number between 1 and 5000";
  }

  if (!v.status) errors.status = "Please choose a status";
  return errors;
}
