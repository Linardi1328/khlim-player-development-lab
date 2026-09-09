import { pageViewer } from "@/lib/auth";
import { Shell } from "@/components/shell";
export const dynamic = "force-dynamic";
export default async function LabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Shell viewer={await pageViewer()}>{children}</Shell>;
}
