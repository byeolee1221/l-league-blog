export interface Category {
  count: number;
  totalCnt: number;
  pageCnt: number;
  curPage: number;
  nextPage: number | null;
  previousPage: number | null;
  data: {
    id: number | null;
    name: string;
  }[]
}