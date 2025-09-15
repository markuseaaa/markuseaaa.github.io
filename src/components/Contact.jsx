// src/components/Contact.jsx
import { useEffect, useRef, useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    site: "", // honeypot
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [status, setStatus] = useState({ sending: false, ok: null, msg: "" });
  const [popup, setPopup] = useState(false);

  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  const [titleIn, setTitleIn] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [prog, setProg] = useState(0); // 0..1 global progress for reveals

  useEffect(() => {
    // Title observer
    const el = titleRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTitleIn(true);
      },
      { threshold: 0.15 }
    );
    if (el) io.observe(el);

    // Scroll listener to pin + progress
    const onScroll = () => {
      const sec = sectionRef.current;
      if (!sec) return;

      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--navH")
        ) || 0;

      const r = sec.getBoundingClientRect();
      const viewH = window.innerHeight;

      const nowPinned = r.top <= navH && r.bottom - navH >= viewH;
      if (nowPinned !== pinned) setPinned(nowPinned);

      // Start progress a bit earlier so section appears sooner
      const EARLY_PX = 120; // tweak 80–160 to taste
      const total = r.height + viewH;
      const passed = Math.min(Math.max(viewH - (r.top + EARLY_PX), 0), total);
      const p = Math.max(0, Math.min(1, passed / total));
      setProg(p);

      sec.classList.toggle("is-pinned", nowPinned);
      sec.classList.toggle("has-entered", p > 0.06); // optional CSS hook
      sec.style.setProperty("--cProg", String(p));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onBlur = (e) => setTouched((t) => ({ ...t, [e.target.name]: true }));

  // Validation
  const validEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const errors = {
    name: form.name.trim().length === 0 ? "Skriv dit navn." : "",
    email:
      form.email.trim().length === 0
        ? "Skriv din email."
        : !validEmail(form.email)
        ? "Email skal indeholde @ og et gyldigt domæne."
        : "",
    message: form.message.trim().length === 0 ? "Skriv en besked." : "",
  };
  const canSubmit = !errors.name && !errors.email && !errors.message;

  // Progressive reveal (now based on overall progress instead of pinned)
  const revealName = prog > 0.06;
  const typedName = form.name.trim().length > 0;
  const revealEmail = revealName && typedName;
  const typedEmail = form.email.trim().length > 0;
  const revealSubject = revealEmail && typedEmail;
  const typedSubject = form.subject.trim().length > 0;
  const revealMessage = revealSubject && typedSubject;
  const typedMessage = form.message.trim().length > 0;
  const revealSend = revealMessage && typedMessage;

  async function onSubmit(e) {
    e.preventDefault();

    // mark all as touched to show errors if any
    setTouched({
      name: true,
      email: true,
      subject: touched.subject,
      message: true,
    });

    if (!canSubmit) {
      setStatus({ sending: false, ok: false, msg: "Udfyld felterne korrekt." });
      return;
    }
    if (form.site) return; // honeypot

    setStatus({ sending: true, ok: null, msg: "" });

    try {
      const res = await fetch("https://formspree.io/f/xkgvekrn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim() || "Kontaktformular",
          message: form.message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.errors?.[0]?.message || "Noget gik galt.");

      setStatus({ sending: false, ok: true, msg: "Tak! Din besked er sendt." });
      setForm({ name: "", email: "", subject: "", message: "", site: "" });
      setTouched({ name: false, email: false, subject: false, message: false });
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
    } catch (err) {
      setStatus({
        sending: false,
        ok: false,
        msg: err.message || "Kunne ikke sende beskeden.",
      });
    }
  }

  return (
    <section ref={sectionRef} className="contactSection pageContent contactPin">
      {/* Title */}
      <div className="contactMotion contactMotion--title">
        <header
          ref={titleRef}
          className={`contactTitle fade ${titleIn || prog > 0.06 ? "in" : ""}`}
        >
          <h1>Kontakt</h1>
        </header>
      </div>

      {/* Sticky viewport */}
      <div className="contactViewport">
        <div className="contactMotion contactMotion--form">
          <form className="contactFormBare" onSubmit={onSubmit} noValidate>
            {/* Honeypot */}
            <input
              className="hp"
              type="text"
              name="site"
              value={form.site}
              onChange={onChange}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Name */}
            <div
              className={`reveal ${revealName ? "in" : ""}`}
              style={{ transitionDelay: "80ms" }}
            >
              <label className="field">
                <span>Navn</span>
                <input
                  name="name"
                  type="text"
                  placeholder="Dit navn"
                  value={form.name}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="name"
                  aria-invalid={touched.name && !!errors.name}
                  className={touched.name && errors.name ? "invalid" : ""}
                />
                {touched.name && errors.name && (
                  <small className="fieldError">{errors.name}</small>
                )}
              </label>
            </div>

            {/* Email */}
            <div
              className={`reveal ${revealEmail ? "in" : ""}`}
              style={{ transitionDelay: "140ms" }}
            >
              <label className="field">
                <span>Email</span>
                <input
                  name="email"
                  type="email"
                  placeholder="din@mail.dk"
                  value={form.email}
                  onChange={onChange}
                  onBlur={onBlur}
                  autoComplete="email"
                  aria-invalid={touched.email && !!errors.email}
                  className={touched.email && errors.email ? "invalid" : ""}
                />
                {touched.email && errors.email && (
                  <small className="fieldError">{errors.email}</small>
                )}
              </label>
            </div>

            {/* Subject (optional) */}
            <div
              className={`reveal ${revealSubject ? "in" : ""}`}
              style={{ transitionDelay: "200ms" }}
            >
              <label className="field">
                <span>
                  Emne <small>(valgfrit)</small>
                </span>
                <input
                  name="subject"
                  type="text"
                  placeholder="Hvad drejer det sig om?"
                  value={form.subject}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </label>
            </div>

            {/* Message */}
            <div
              className={`reveal ${revealMessage ? "in" : ""}`}
              style={{ transitionDelay: "260ms" }}
            >
              <label className="field">
                <span>Besked</span>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Skriv din besked her…"
                  value={form.message}
                  onChange={onChange}
                  onBlur={onBlur}
                  aria-invalid={touched.message && !!errors.message}
                  className={touched.message && errors.message ? "invalid" : ""}
                />
                {touched.message && errors.message && (
                  <small className="fieldError">{errors.message}</small>
                )}
              </label>
            </div>

            {/* Send */}
            <div
              className={`reveal ${revealSend ? "in" : ""}`}
              style={{ transitionDelay: "320ms" }}
            >
              <button
                className="sendBtnBare"
                disabled={!canSubmit || status.sending}
              >
                <span className="gradText">
                  {status.sending ? "Sender…" : "Send besked"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {popup && (
        <div className="popup">
          <div className="popupInner">
            <h3>Tak for din besked!✅</h3>
            <p>Din mail er sendt. Jeg vender tilbage hurtigst muligt.</p>
          </div>
        </div>
      )}
    </section>
  );
}
