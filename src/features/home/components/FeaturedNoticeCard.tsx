import { Tags } from '@/components/ui/Tags';
import type { FeedCardPost } from '@/api';

export function FeaturedNoticeCard({ post }: { post: FeedCardPost }) {
  return (
    <article
      className="relative flex h-[481px] overflow-hidden bg-[#D6D8CF] bg-cover bg-center p-4"
      data-post-id={post.postId}
      style={{ backgroundImage: `url(${post.imageUrl})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(51,51,51,0.82)_100%)]" />
      <div className="relative z-10 mt-auto flex w-full flex-col gap-3 pb-16">
        <Tags size="lg" type="tertiary" className="h-8">
          {post.tagName}
        </Tags>
        <div className="flex flex-col gap-1">
          <h2 className="line-clamp-2 text-[20px] font-semibold leading-[1.4] text-white">
            {post.title}
          </h2>
          <p className="line-clamp-2 min-h-[39.2px] text-[14px] font-normal leading-[1.4] text-[#DCDFE2]">
            {post.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
