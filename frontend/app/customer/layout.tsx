import Link from "next/link";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#FDFAF5", minHeight: "100vh" }}>
      {/* We removed the old orange <nav> completely! */}
      {/* Now it just perfectly renders your new beautiful page designs. */}
      {children}
    </div>
  );
}

