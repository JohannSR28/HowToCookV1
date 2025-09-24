export default function Contact() {
  return (
    <>
      <div className="flex flex-col items-center gap-8 pb-20 px-2">
        <h2 className="text-2xl font-bold text-center">Contact Us</h2>
        <p className="text-center">
          If you have any questions, feel free to reach out!
        </p>
        <div className="flex gap-6">
          <a
            href="mailto:your.email@example.com"
            aria-label="Email"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 2v.01L12 13 4 6.01V6h16zm0 12H4V8l8 7 8-7v10z" />
            </svg>
          </a>
          <a
            href="https://github.com/yourusername"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.012c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.091-.646.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.175 22 16.428 22 12.012 22 6.484 17.523 2 12 2z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.601 2.002 3.601 4.604v5.592z" />
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
