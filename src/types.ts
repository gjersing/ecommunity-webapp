export interface PostData {
  id: number;
  author: {
    id: number;
    username: string;
    email: string;
  };
  body: string;
  img: string;
  points: number;
  likeStatus?: number | null | undefined;
  createdAt: string;
}
