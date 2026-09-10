export function Eyebrow({
  children,
  tone = "amber",
}: {
  children: React.ReactNode;
  tone?: "amber" | "muted";
}) {
  return (
    <div
      className={`font-mono-label text-xs tracking-[0.16em] mb-3.5 ${
        tone === "amber" ? "text-amber" : "text-muted"
      }`}
    >
      {children}
    </div>
  );
}
