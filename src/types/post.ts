export interface PostData {
  user: {
    id: number | null;
    email: string;
    status: string;
    name: string | null;
    phone_number: string | null;
    profile_image: string | null;
  }
  category: {
    id: number;
    name: string;
  }
  id: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  main_image: string | null;
  sub_image: string | null;
  content: string | null;
}

export interface Post { 
  count: number;
  totalCnt: number;
  pageCnt: number;
  curPage: number;
  nextPage: number | null;
  previousPage: number | null;
  data: PostData[];
}
