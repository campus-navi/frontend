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
