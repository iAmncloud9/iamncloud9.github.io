"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import CloudLogo from "@/components/CloudLogo";
import type { BlogLanguage, BlogPost } from "@/data/portfolio";

const LANGUAGE_STORAGE_KEY = "iamncloud9-blog-language";

const interfaceCopy: Record<BlogLanguage, {
  returnToTerminal: string;
  by: string;
  onThisPage: string;
  previousFile: string;
  nextFile: string;
}> = {
  en: {
    returnToTerminal: "RETURN TO TERMINAL",
    by: "by",
    onThisPage: "ON THIS PAGE",
    previousFile: "PREV FILE",
    nextFile: "NEXT FILE",
  },
  vi: {
    returnToTerminal: "TRỞ LẠI TERMINAL",
    by: "bởi",
    onThisPage: "TRONG BÀI VIẾT",
    previousFile: "BÀI TRƯỚC",
    nextFile: "BÀI TIẾP THEO",
  },
};

type BlogReaderProps = {
  alias: string;
  blog: BlogPost;
  previousBlog: BlogPost | null;
  nextBlog: BlogPost | null;
};

function LanguageFlagToggle({ language, onToggle }: { language: BlogLanguage; onToggle: () => void }) {
  const nextLanguage = language === "en" ? "Vietnamese" : "English";

  return (
    <button className="blog-language-toggle" type="button" onClick={onToggle} aria-label={`Switch blog language to ${nextLanguage}`} title={`Switch to ${nextLanguage}`}>
      <svg className="crossed-language-flags" viewBox="0 0 100 62" aria-hidden="true">
        <g className="crossed-flag-poles">
          <line x1="14" y1="4" x2="77" y2="59" />
          <line x1="86" y1="4" x2="23" y2="59" />
          <circle cx="14" cy="4" r="2.5" /><circle cx="86" cy="4" r="2.5" />
        </g>
        <g className={`language-flag is-us ${language === "en" ? "is-active" : ""}`} transform="rotate(6 14 4)">
          <rect x="14" y="6" width="42" height="26" rx="1" fill="#fff" />
          {[6, 10, 14, 18, 22, 26, 30].map((y) => <rect x="14" y={y} width="42" height="2" fill="#b22234" key={y} />)}
          <rect x="14" y="6" width="18" height="14" fill="#3c3b6e" />
          <g fill="#fff">
            <circle cx="17" cy="9" r=".8" /><circle cx="22" cy="9" r=".8" /><circle cx="27" cy="9" r=".8" />
            <circle cx="19.5" cy="13" r=".8" /><circle cx="24.5" cy="13" r=".8" /><circle cx="29.5" cy="13" r=".8" />
            <circle cx="17" cy="17" r=".8" /><circle cx="22" cy="17" r=".8" /><circle cx="27" cy="17" r=".8" />
          </g>
          <rect className="flag-outline" x="14" y="6" width="42" height="26" rx="1" />
        </g>
        <g className={`language-flag is-vietnam ${language === "vi" ? "is-active" : ""}`} transform="rotate(-6 86 4)">
          <rect x="44" y="6" width="42" height="26" rx="1" fill="#da251d" />
          <polygon points="65,10 67.1,16.3 73.7,16.3 68.4,20.2 70.4,26.5 65,22.6 59.6,26.5 61.6,20.2 56.3,16.3 62.9,16.3" fill="#ffcd00" />
          <rect className="flag-outline" x="44" y="6" width="42" height="26" rx="1" />
        </g>
      </svg>
      <span className="sr-only">Current language: {language === "en" ? "English" : "Vietnamese"}</span>
    </button>
  );
}

export default function BlogReader({ alias, blog, previousBlog, nextBlog }: BlogReaderProps) {
  const [language, setLanguage] = useState<BlogLanguage>("en");

  useEffect(() => {
    let storedLanguage: string | null = null;
    try {
      storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch {
      // The English default remains available when storage is blocked.
    }

    const initialLanguage: BlogLanguage = storedLanguage === "vi" ? "vi" : "en";
    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    return () => {
      document.documentElement.lang = "en";
    };
  }, []);

  const changeLanguage = (nextLanguage: BlogLanguage) => {
    setLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // Switching still works for the current page when storage is blocked.
    }
  };

  const content = blog.translations[language];
  const copy = interfaceCopy[language];

  return (
    <main className="blog-page">
      <div className="blog-frame">
        <nav className="blog-nav">
          <Link href="/" className="brand"><CloudLogo />{alias}</Link>
          <div className="blog-nav-actions">
            <LanguageFlagToggle language={language} onToggle={() => changeLanguage(language === "en" ? "vi" : "en")} />
            <Link href="/">← {copy.returnToTerminal}</Link>
          </div>
        </nav>
        <article className="blog-article" lang={language}>
          <p className="blog-command"><span>guest@{alias}</span>:~/blogs$ cat {blog.slug}.blog</p>
          <header>
            <h1>{content.title}</h1>
            <p className="blog-deck">{content.summary}</p>
            <div className="blog-meta"><span>{blog.date}</span><span>{content.readTime}</span><span>{copy.by} {alias}</span></div>
          </header>
          <div className="blog-content">
            <aside className="blog-aside">
              <strong>{copy.onThisPage}</strong>
              {content.sections.map((section, index) => <a href={`#section-${index + 1}`} key={`${language}-${section.heading}`}>{String(index + 1).padStart(2, "0")}. {section.heading}</a>)}
            </aside>
            <div className="blog-copy">
              {content.sections.map((section, index) => (
                <section id={`section-${index + 1}`} key={`${language}-${section.heading}`}>
                  <h2>{section.heading}</h2>
                  {section.body.map((paragraph, paragraphIndex) => <p key={`${language}-${paragraphIndex}-${paragraph}`}>{paragraph}</p>)}
                </section>
              ))}
              <div className="blog-tags">{blog.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
            </div>
          </div>
          {(previousBlog || nextBlog) && (
            <nav className="blog-navigation" aria-label={language === "vi" ? "Điều hướng bài viết" : "Blog post navigation"}>
              {previousBlog && (
                <Link className="blog-next is-prev" href={`/blog/${previousBlog.slug}`}>
                  <span className="blog-navigation-arrow">←</span><span><small>{copy.previousFile}</small><strong>{previousBlog.translations[language].title}</strong></span>
                </Link>
              )}
              {nextBlog && (
                <Link className="blog-next is-next" href={`/blog/${nextBlog.slug}`}>
                  <span><small>{copy.nextFile}</small><strong>{nextBlog.translations[language].title}</strong></span><span className="blog-navigation-arrow">→</span>
                </Link>
              )}
            </nav>
          )}
        </article>
      </div>
    </main>
  );
}
