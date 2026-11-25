import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/site/Logo";
import { lifeAreas, type LifeArea } from "@/lib/fixtures";
import { handleForName, loadProfile, saveProfile } from "@/lib/store";
import { img } from "@/lib/img";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Join Softground" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"account" | "focus">("account");
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [name, setName] = useState("Natalie");
  const [picked, setPicked] = useState<LifeArea[]>(["personal", "growth"]);

  const toggle = (id: LifeArea) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const finishSignup = () => {
    if (picked.length === 0) return;
    // Local profile for now: stored on this device only. Real accounts arrive
    // with Netlify Identity (see PLAN.md, milestone 2).
    saveProfile({
      ...loadProfile(),
      name: name.trim() || "Natalie",
      handle: handleForName(name.trim() || "Natalie"),
      focus: picked,
    });
    toast(`Welcome to your space, ${name.trim() || "Natalie"} 🌿`);
    void navigate({ to: "/today" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={img("together", 1400)}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-x-8 bottom-8 rounded-3xl bg-background/85 p-6 backdrop-blur">
          <p className="font-display text-2xl">
            “The first place that felt like it was built for how I actually
            feel.”
          </p>
          <p className="mt-2 text-sm text-muted-foreground">— north-window</p>
        </div>
      </div>

      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          {step === "account" ? (
            <form
              className="rise flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (mode === "login") {
                  const stored = loadProfile();
                  toast(`Welcome back, ${stored.name} 🌿`);
                  void navigate({ to: "/today" });
                } else setStep("focus");
              }}
            >
              <div>
                <h1 className="text-4xl">
                  {mode === "signup" ? "Make yourself at home" : "Welcome back"}
                </h1>
                <p className="mt-2 text-muted-foreground">
                  {mode === "signup"
                    ? "Free forever. You’ll pick an anonymous handle for circles."
                    : "Good to see you again."}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-full"
                onClick={() =>
                  toast(
                    "Google sign-in arrives with real accounts (Netlify Identity) — email works for now.",
                  )
                }
              >
                Continue with Google
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or with email{" "}
                <span className="h-px flex-1 bg-border" />
              </div>
              {mode === "signup" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">What should we call you?</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your first name"
                    className="h-11 rounded-xl"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  className="h-11 rounded-xl"
                />
              </div>
              <Button type="submit" className="h-11 rounded-full">
                {mode === "signup" ? "Create my space" : "Log in"}{" "}
                <ArrowRight className="size-4" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                  onClick={() =>
                    setMode(mode === "signup" ? "login" : "signup")
                  }
                >
                  {mode === "signup" ? "Log in" : "Create an account"}
                </button>
              </p>
              {mode === "signup" && (
                <p className="text-center text-xs text-muted-foreground">
                  Your profile is saved on this device only for now — no account
                  is created yet.
                </p>
              )}
            </form>
          ) : (
            <div className="rise flex flex-col gap-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  Step 2 of 2
                </span>
                <h1 className="mt-2 text-4xl">What’s been weighing on you?</h1>
                <p className="mt-2 text-muted-foreground">
                  Pick as many as you like. We’ll tailor circles, activities and
                  your companion. You can change this anytime.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {lifeAreas.map((a) => {
                  const on = picked.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggle(a.id)}
                      className={cn(
                        "relative flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
                        on
                          ? "border-primary bg-secondary shadow-sm"
                          : "bg-card hover:border-primary/40",
                      )}
                    >
                      <span className="text-2xl" aria-hidden>
                        {a.emoji}
                      </span>
                      <span className="text-sm font-medium">{a.label}</span>
                      {on && (
                        <Check className="absolute top-3 right-3 size-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
              <Button
                className="h-11 rounded-full"
                disabled={picked.length === 0}
                onClick={finishSignup}
              >
                Take me to my space <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
