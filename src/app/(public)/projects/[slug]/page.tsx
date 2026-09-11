import { redirect } from 'next/navigation';

interface ProjectSlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectSlugPage({ params }: ProjectSlugPageProps) {
  const { slug } = await params;
  redirect(`/work/${slug}`);
}
