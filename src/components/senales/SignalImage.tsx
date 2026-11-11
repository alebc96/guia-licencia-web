import Link from "next/link";
import { publicUrl } from "@/lib/constants";
import type { Senal } from "@/lib/schemas";

/** Renders a sign SVG served from `public/`, honouring the deploy sub-path. */
export function SignalImage({
  senal,
  size = 84,
  className,
}: {
  senal: Pick<Senal, "image" | "imageAlt" | "code">;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={publicUrl(senal.image)}
      alt={`Señal ${senal.code}: ${senal.imageAlt}`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
