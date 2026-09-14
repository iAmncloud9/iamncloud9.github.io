import { notFound } from "next/navigation";
import BlogReader from "@/components/BlogReader";
import { blogs, profile } from "@/data/portfolio";

export function generateStaticParams() {
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = blogs.find((item) => item.slug === slug);
  if (!blog) return {};
  return { title: `${blog.translations.en.title} — ${profile.alias}`, description: blog.translations.en.summary };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blogIndex = blogs.findIndex((item) => item.slug === slug);
  const blog = blogs[blogIndex];
  if (!blog) notFound();
  const previousBlog = blogIndex > 0 ? blogs[blogIndex - 1] : null;
  const nextBlog = blogIndex < blogs.length - 1 ? blogs[blogIndex + 1] : null;

  return <BlogReader alias={profile.alias} blog={blog} previousBlog={previousBlog} nextBlog={nextBlog} />;
}
