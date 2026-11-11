import Link from "next/link";
import { publicUrl } from "@/lib/constants";
import type { Senal } from "@/lib/schemas";

export interface SignalCardData {
  code: string;
  name: string;
  family: string;
  image: string;
  imageAlt: string;
  tier: string;
  isNew: boolean;
}

export function SignalCard({ senal }: { senal: SignalCardData }) {
  return (
    <Link href={`/senales/${senal.code.toLowerCase()}`} className="sign-card">
      <span className="sign-card__media">
        <img src={publicUrl(senal.image)} alt={`Señal ${senal.code}: ${senal.imageAlt}`} loading="lazy" decoding="async" />
      </span>
      <span className="sign-card__code">{senal.code}</span>
      <span className="sign-card__name">{senal.name}</span>
      {senal.isNew ? <span className="badge badge--new">Nueva</span> : null}
    </Link>
  );
}

export function toCardData(senal: Senal): SignalCardData {
  return {
    code: senal.code,
    name: senal.name,
    family: senal.family,
    image: senal.image,
    imageAlt: senal.imageAlt,
    tier: senal.tier,
    isNew: senal.isNew,
  };
}
