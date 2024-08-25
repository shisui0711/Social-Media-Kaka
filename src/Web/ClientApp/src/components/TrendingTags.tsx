"use server"

import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getApiClient } from "@/lib/apiClient";

export async function TrendingTags() {
  const token = cookies().get("token")?.value
  if(!token){
    redirect('/sign-in')
  }
  const trendingTags = await getTrendingTags(token);
  if(!trendingTags){
    redirect('/sign-in')
  }
  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Xu hướng</div>
      {trendingTags.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return <Link key={title} href={`/hashtag/${title}`}>
          <p className="line-clamp-1 break-all font-semibold hover:underline" title={hashtag}>
            {hashtag}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatNumber(count)} bài đăng
          </p>
        </Link>;
      })}
    </div>
  );
}
const getTrendingTags = unstable_cache(
  async (token:string) => {
    try {
      if(!token) return null
      const client = getApiClient(token);
      const result = await client.getTrendingTags().catch(()=>[])
      return result.map((row) => ({
      hashtag: row.tag,
      count: Number(row.count),
    }));
    } catch (error) {
      console.error("Error fetching trending tags");
    }
  },
  ["trending_tags"],
  {
    // revalidate: 60 * 60 * 1, // 1 hours
    revalidate: 60
  }
)