import { renderOg, OG_SIZE, OG_TYPE } from "@/lib/og";
import { posts, getPost } from "@/lib/posts";

export const alt = "Israel Afolabi — AI automation article";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);

  return renderOg({
    kicker: post ? `${post.category} · ${post.readTime}` : "Article",
    title: post?.h1 ?? "AI automation, explained plainly",
    subtitle: undefined,
    portrait: false,
  });
}
