"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { checkUsername, checkPassword } from "./actions";

export default function LoginPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      const res = await checkUsername(username);
      if (res?.success) {
        setStep(2);
      }
    } else {
      await checkPassword(password);
    }
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border/50 bg-background p-8 shadow-xl relative overflow-hidden">
        {/* Subtle top glare */}
        <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <form onSubmit={handleNext} className="space-y-8 relative z-10">
          <div className="space-y-1">
            <h1 className="text-xl font-medium tracking-tight text-foreground">
              {step === 1 ? "Sign in" : "Enter password"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 1
                ? "Enter your username to continue."
                : `Continuing as ${username}.`}
            </p>
          </div>

          <div className="relative h-[68px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    autoFocus
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="flex h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground font-medium focus:border-accent focus:bg-muted focus:outline-none focus:ring-0 transition-all"
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    autoFocus
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="flex h-12 w-full rounded-xl border border-border bg-muted/50 px-4 text-sm text-foreground placeholder:text-muted-foreground font-medium focus:border-accent focus:bg-muted focus:outline-none focus:ring-0 transition-all font-mono"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="submit"
            className="group relative flex h-11 w-full items-center justify-center overflow-hidden rounded-xl bg-accent font-medium text-accent-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            <span className="relative z-10 transition-transform group-hover:scale-105">
              {step === 1 ? "Continue" : "Sign in"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
