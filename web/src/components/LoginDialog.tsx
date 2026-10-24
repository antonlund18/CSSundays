import { Dialog as DialogPrimitive } from "radix-ui";
import { Info, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { logIn, requestPasswordReset, resendVerification, signUp } from "@/api/auth";
import { isPlayertagAvailable } from "@/api/players";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Tooltip } from "@/components/ui/misc";
import { errorCode, errorMessage } from "@/lib/errors";
import { cn } from "@/lib/utils";
import {
  PASSWORD_REQUIREMENTS,
  PLAYERTAG_REQUIREMENTS,
  isValidEmail,
  isValidPassword,
  isValidPlayertag,
} from "@/lib/validation";

type Mode = "login" | "register" | "forgot";

function LoginForm({ onDone, onForgot }: { onDone: () => void; onForgot: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await logIn(email.trim(), password);
      onDone();
    } catch (loginError) {
      setUnconfirmed(errorCode(loginError) === "EMAIL_NOT_CONFIRMED");
      setError(errorMessage(loginError, "Login fejlede. Prøv igen."));
    } finally {
      setBusy(false);
      setPassword("");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="E-mail" htmlFor="login-email">
        <Input id="login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Indtast din e-mail" required />
      </Field>
      <Field label="Kodeord" htmlFor="login-password">
        <Input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Indtast dit kodeord" required />
      </Field>
      {error && <p className="text-sm text-danger">{error}</p>}
      {unconfirmed && (
        <button
          type="button"
          className="cursor-pointer self-start text-xs text-primary hover:underline"
          onClick={() => resendVerification(email.trim()).then(() => toast.success("Vi har sendt bekræftelsesmailen igen."))}
        >
          Send bekræftelsesmail igen
        </button>
      )}
      <Button type="submit" size="lg" className="mt-2 rounded-full" disabled={busy}>
        Log ind
      </Button>
      <button type="button" onClick={onForgot} className="cursor-pointer self-center text-xs text-muted hover:text-primary">
        Glemt kodeord?
      </button>
    </form>
  );
}

type RegisterErrors = Partial<Record<"email" | "playertag" | "password" | "confirm", string>>;

function RegisterForm({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [playertag, setPlayertag] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const next: RegisterErrors = {};
    if (!isValidEmail(email.trim())) next.email = "Ugyldig e-mail";
    if (!isValidPlayertag(playertag)) next.playertag = `Ugyldigt brugernavn (${PLAYERTAG_REQUIREMENTS})`;
    if (!isValidPassword(password)) next.password = PASSWORD_REQUIREMENTS;
    if (password !== confirm) next.confirm = "Kodeordene er ikke ens";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    try {
      if (!(await isPlayertagAvailable(playertag))) {
        setErrors({ playertag: "Brugernavn i brug" });
        return;
      }
      const loggedIn = await signUp(email.trim(), playertag, password);
      if (loggedIn) {
        toast.success("Velkommen til CSSundays! Vi har sendt dig en mail, så du kan bekræfte din e-mail.");
      } else {
        toast.success("Tjek din indbakke og bekræft din e-mail for at aktivere din konto.", { duration: 10_000 });
      }
      onDone();
    } catch (signUpError) {
      const code = errorCode(signUpError);
      if (code === "EMAIL_IN_USE") setErrors({ email: "E-mail i brug" });
      else if (code === "PLAYERTAG_IN_USE") setErrors({ playertag: "Brugernavn i brug" });
      else toast.error(errorMessage(signUpError, "Vi kunne ikke oprette dig som bruger. Prøv igen."));
    } finally {
      setBusy(false);
      setPassword("");
      setConfirm("");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="E-mail" htmlFor="register-email" error={errors.email}>
        <Input id="register-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} placeholder="Indtast din e-mail" required />
      </Field>
      <Field label="Brugernavn" htmlFor="register-playertag" error={errors.playertag} hint={PLAYERTAG_REQUIREMENTS}>
        <Input id="register-playertag" autoComplete="username" value={playertag} onChange={(e) => setPlayertag(e.target.value)} aria-invalid={!!errors.playertag} placeholder="Vælg dit brugernavn" maxLength={16} required />
      </Field>
      <Field
        label={
          <span className="inline-flex items-center gap-1">
            Kodeord
            <Tooltip content={PASSWORD_REQUIREMENTS}>
              <Info className="size-3.5" />
            </Tooltip>
          </span>
        }
        htmlFor="register-password"
        error={errors.password}
      >
        <Input id="register-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} placeholder="Indtast dit kodeord" required />
      </Field>
      <Field label="Bekræft kodeord" htmlFor="register-confirm" error={errors.confirm}>
        <Input id="register-confirm" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={!!errors.confirm} placeholder="Indtast dit kodeord igen" required />
      </Field>
      <Button type="submit" variant="accent" size="lg" className="mt-2 rounded-full" disabled={busy}>
        Tilmeld
      </Button>
    </form>
  );
}

function ForgotPasswordForm({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await requestPasswordReset(email.trim());
    } catch (resetError) {
      toast.error(errorMessage(resetError));
      return;
    } finally {
      setBusy(false);
    }
    toast.success("Hvis e-mailen findes, har vi sendt et link til at nulstille dit kodeord.");
    onBack();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-sm text-muted">Indtast din e-mail, så sender vi dig et link til at vælge et nyt kodeord.</p>
      <Field label="E-mail" htmlFor="forgot-email">
        <Input id="forgot-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Button type="submit" size="lg" className="rounded-full" disabled={busy}>
        Send link
      </Button>
      <button type="button" onClick={onBack} className="cursor-pointer self-center text-xs text-muted hover:text-primary">
        Tilbage til log ind
      </button>
    </form>
  );
}

const headings: Record<Mode, { title: string; text: string }> = {
  login: { title: "Velkommen tilbage!", text: "Log ind for at tilmelde dig turneringer og spille med dit hold." },
  register: {
    title: "Velkommen!",
    text: "Efter du har tilmeldt dig, vil du modtage en bekræftelsesmail med et link til at aktivere din konto.",
  },
  forgot: { title: "Glemt kodeord?", text: "Det sker for de bedste. Vi hjælper dig videre." },
};

/** The shared login / sign-up dialog, opened through useAuth().requestLogin(). */
export function LoginDialog() {
  const { loginRequest, closeLogin, requestLogin } = useAuth();
  const [forgot, setForgot] = useState(false);
  const mode: Mode = forgot ? "forgot" : loginRequest.mode;
  const isLogin = mode !== "register";

  const close = () => {
    closeLogin();
    setForgot(false);
  };

  return (
    <DialogPrimitive.Root open={loginRequest.open} onOpenChange={(open) => !open && close()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl data-[state=open]:animate-fade-in"
        >
          <div
            className={cn(
              "hidden w-5/12 flex-col justify-between p-8 sm:flex",
              isLogin ? "bg-linear-45 from-[#1c59f3] to-[#00d8ff]" : "bg-linear-45 from-[#420ed9] to-[#ff055d]",
            )}
          >
            <DialogPrimitive.Title className="heading text-4xl leading-tight text-white">{headings[mode].title}</DialogPrimitive.Title>
            <div className="text-sm text-white/90">
              <p>{headings[mode].text}</p>
              {mode === "login" && (
                <p className="mt-3">
                  Har du ikke en konto?{" "}
                  <button className="cursor-pointer font-bold italic underline" onClick={() => requestLogin("register")}>
                    Tilmeld dig nu!
                  </button>
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 p-6 sm:p-8">
              <h2 className="heading mb-6 text-lg">{mode === "register" ? "Tilmeld dig" : mode === "forgot" ? "Nulstil kodeord" : "Log ind"}</h2>
              {mode === "login" && <LoginForm onDone={close} onForgot={() => setForgot(true)} />}
              {mode === "register" && <RegisterForm onDone={close} />}
              {mode === "forgot" && <ForgotPasswordForm onBack={() => setForgot(false)} />}
            </div>
            <div className="grid grid-cols-2 border-t border-border">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setForgot(false);
                    requestLogin(tab);
                  }}
                  className={cn(
                    "heading h-14 cursor-pointer text-xs transition-colors first:border-r first:border-border",
                    loginRequest.mode === tab && !forgot ? "text-white" : "text-muted hover:text-foreground",
                  )}
                >
                  {tab === "login" ? "Log ind" : "Tilmeld"}
                </button>
              ))}
            </div>
          </div>
          <DialogPrimitive.Close className="absolute top-3 right-3 cursor-pointer rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Luk</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
