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
  comments?:
    | {
        body: string;
        username?: string | null | undefined;
        userId: number;
        id: number;
        createdAt: string;
      }[]
    | null
    | undefined;
  likeStatus?: number | null | undefined;
  createdAt: string;
}

export interface ActionsProps {
  body: string;
  postId: number;
  authorId: number;
}
