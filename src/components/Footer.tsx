export default function Footer() {
  const pathname = window.location.pathname;
  if (pathname === "/orderhistory") {
    return null;
  }

  return <div className="h-16"></div>;
}
