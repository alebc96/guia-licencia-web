import Link from "next/link";

export default function NotFound() {
  return (
    <section className="tile tile-parchment">
      <div className="container-read" style={{ textAlign: "center", paddingBlock: 64 }}>
        <h1 className="t-hero">
          Esta página no existe
        </h1>
        <p className="t-lead" style={{ marginTop: 16 }}>
          Puede que el enlace esté mal escrito o que la página se haya movido. El temario y el catálogo siguen donde
          estaban.
        </p>
        <div className="row" style={{ justifyContent: "center", marginTop: 32 }}>
          <Link href="/temario" className="btn btn-primary">
            Ir al temario
          </Link>
          <Link href="/senales" className="btn btn-ghost">
            Ver las señales
          </Link>
        </div>
      </div>
    </section>
  );
}
