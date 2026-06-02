import { createClient } from "microcms-js-sdk";
import type { MicroCMSImage, MicroCMSDate } from "microcms-js-sdk";

// 記事の型定義（怪談録 articles API スキーマと一致）
export type Article = {
  title: string;
  slug: string;
  content: string;
  thumbnail: MicroCMSImage;
  description?: string;
} & MicroCMSDate;

// microCMSクライアント
export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

// 全記事取得（一覧用）
export const getArticles = async (queries?: { limit?: number; offset?: number }) => {
  return await client.getList<Article>({
    endpoint: "articles",
    queries: {
      limit: queries?.limit ?? 100,
      offset: queries?.offset ?? 0,
      orders: "-publishedAt",
    },
  });
};

// 1記事取得（slug 指定・個別ページ用）
export const getArticleBySlug = async (slug: string) => {
  const data = await client.getList<Article>({
    endpoint: "articles",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });
  return data.contents[0];
};

// 全記事の slug リスト取得（getStaticPaths用）
export const getAllSlugs = async () => {
  const data = await client.getList<Article>({
    endpoint: "articles",
    queries: {
      fields: "slug",
      limit: 100,
    },
  });
  return data.contents.map((c) => c.slug);
};
