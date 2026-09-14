import Link from "next/link";
import { notFound } from "next/navigation";
import CloudLogo from "@/components/CloudLogo";
import { blogs, profile } from "@/data/portfolio";

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);
  if (!blog) return {};
  return { title: `${blog.title} — ${profile.alias}`, description: blog.summary };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blogIndex = blogs.findIndex((item) => item.slug === slug);
  const blog = blogs[blogIndex];
  if (!blog) notFound();
  const previousBlog = blogIndex > 0 ? blogs[blogIndex - 1] : undefined;
  const nextBlog = blogIndex < blogs.length - 1 ? blogs[blogIndex + 1] : undefined;

  return (
    <main className="blog-page">
      <div className="blog-frame">
        <nav className="blog-nav">
          <Link href="/" className="brand"><CloudLogo />{profile.alias}</Link>
          <Link href="/">← RETURN TO TERMINAL</Link>
        </nav>
        <article className="blog-article">
          <p className="blog-command"><span>guest@{profile.alias}</span>:~/blogs$ cat {blog.slug}.blog</p>
          <header>
            <h1>{blog.title}</h1>
            <p className="blog-deck">{blog.summary}</p>
            <div className="blog-meta"><span>{blog.date}</span><span>{blog.readTime}</span><span>by {profile.alias}</span></div>
          </header>
          <div className="blog-content">
            <aside className="blog-aside">
              <strong>ON THIS PAGE</strong>
              {blog.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{String(index + 1).padStart(2, "0")}. {section.heading}</a>)}
            </aside>
            <div className="blog-copy">
              {blog.sections.map((section, index) => (
                <section id={`section-${index + 1}`} key={section.heading}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </section>
              ))}
              <div className="blog-tags">{blog.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            </div>
          </div>
          {(previousBlog || nextBlog) && (
            <nav className="blog-navigation" aria-label="Blog post navigation">
              {previousBlog && (
                <Link className="blog-next is-prev" href={`/blog/${previousBlog.slug}`}>
                  <span className="blog-navigation-arrow">←</span><span><small>PREV FILE</small><strong>{previousBlog.title}</strong></span>
                </Link>
              )}
              {nextBlog && (
                <Link className="blog-next is-next" href={`/blog/${nextBlog.slug}`}>
                  <span><small>NEXT FILE</small><strong>{nextBlog.title}</strong></span><span className="blog-navigation-arrow">→</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </main>
  );
}
