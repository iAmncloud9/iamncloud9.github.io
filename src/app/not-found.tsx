import Link from "next/link";
import CloudLogo from "@/components/CloudLogo";
import { profile } from "@/data/portfolio";

export default function NotFound() {
  return (
    <main className="blog-page">
      <div className="blog-frame">
        <nav className="blog-nav"><Link href="/" className="brand"><CloudLogo />{profile.alias}</Link></nav>
        <article className="blog-article">
          <p className="blog-command"><span>guest@{profile.alias}</span>:~$ cat requested-page</p>
          <header><h1>404: file not found.</h1><p className="blog-deck">That path does not exist in this portfolio.</p></header>
          <Link className="blog-next" href="/"><span><small>RECOVER SESSION</small><strong>Return to terminal</strong></span><span>→</span></Link>
        </article>
      </div>
    </main>
  );
}
