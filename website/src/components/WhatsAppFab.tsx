export function WhatsAppFab({ number }: { number: string }) {
  const digits = number.replace(/\D/g, "");
  const msg = encodeURIComponent(
    "Assalam-o-Alaikum, Crescent! I would like to enquire about your furniture.",
  );
  return (
    <a
      href={`https://wa.me/${digits}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105"
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden>
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.1.6 4.1 1.6 5.9L4 29l8.4-1.6c1.7.9 3.7 1.4 5.6 1.4 6.6 0 12-5.3 12-11.9S22.6 3 16 3Zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9.9.9-4.7-.3-.4a9.8 9.8 0 0 1-1.6-5.2C4.7 9.3 9.8 4.9 16 4.9s11.3 4.4 11.3 10.5-5.1 9.4-11.3 9.4Zm6.1-7.1c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2l-1 1.2c-.2.2-.4.3-.7.1a11 11 0 0 1-5.4-4.7c-.4-.7.4-.6 1.1-2 .1-.3 0-.5 0-.7l-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.4-1.2 1.2-1.2 2.9s1.2 3.4 1.4 3.6c.2.2 2.5 3.9 6.1 5.4 2.3 1 3.2 1.1 4.3.9.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.2-.6-.4Z" />
      </svg>
    </a>
  );
}
