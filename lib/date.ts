export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const now = new Date().getTime();
  const target = new Date(date).getTime();

  const diff = Math.floor((now - target) / 1000);

  if (diff < 60) return "Just now";

  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;

  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  return `${Math.floor(diff / 86400)} days ago`;
}
