import Link from "next/link";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/settings";

export function WhatsAppLink({
  number,
  message,
  children = "Message us on WhatsApp",
}: {
  number: string;
  message: string;
  children?: React.ReactNode;
}) {
  return (
    <Button asChild variant="outline" size="lg">
      <Link href={buildWhatsAppUrl(number, message)} target="_blank" rel="noopener noreferrer">
        {children}
      </Link>
    </Button>
  );
}