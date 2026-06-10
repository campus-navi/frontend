export type MyPageRecentScrapCardItem = {
  detailPath: string;
  endDate: string | null;
  publishedAt: string;
  tagName: string;
  title: string;
};

export type MyPageScrapFolderListItem = {
  description: string;
  detailPath: string;
  folderId: number;
  name: string;
  scrapCount: number;
};

export type MyPageFolderScrapListItem = {
  detailPath: string | null;
  endDate: string;
  isActive: boolean;
  postId: number;
  publishedAt: string;
  scrapId: number;
  tagName: string;
  title: string;
};
