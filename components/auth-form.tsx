"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { validateAuth } from "@/lib/books";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  // Nothing is shown before the first submit; afterwards each message
  // disappears as soon as its field becomes valid.
  const errors = submitted
    ? validateAuth({ email, password, confirmPassword }, mode)
    : {};

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setAuthError(null);
    setSuccess(false);
    if (Object.keys(validateAuth({ email, password, confirmPassword }, mode)).length > 0) return;

    setPending(true);
    const { error } = isRegister
      ? await signUp(email.trim(), password)
      : await signIn(email.trim(), password);
    setPending(false);

    if (error) {
      setAuthError(error);
      return;
    }
    if (isRegister) setSuccess(true);
    else router.push("/books");
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">{isRegister ? "Create an account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isRegister ? "Register to start your shelf." : "Login to see your shelf."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={onSubmit}
          data-testid={isRegister ? "register-form" : "login-form"}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-email`}>Email</Label>
            <Input
              id={`${mode}-email`}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid={`${mode}-email`}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p data-testid="error-email" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={`${mode}-password`}>Password</Label>
            <Input
              id={`${mode}-password`}
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              data-testid={`${mode}-password`}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <p data-testid="error-password" className="text-sm text-destructive">
                {errors.password}
              </p>
            )}
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">Confirm password</Label>
              <Input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                data-testid="register-confirm-password"
                aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <p data-testid="error-confirm-password" className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {authError && (
            <p data-testid="error-auth" className="text-sm text-destructive">
              {authError}
            </p>
          )}
          {success && (
            <p data-testid="form-success" className="text-sm font-medium text-green-700">
              Registration successful
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={pending}
            data-testid={isRegister ? "register-submit" : "login-submit"}
          >
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

