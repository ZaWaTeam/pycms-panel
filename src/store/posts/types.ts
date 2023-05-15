export interface IPost {
  id: number;
  title: string;
  content: string;
  thumbnails: any[];  // Adjust as needed
  // ... other fields ...
}

export interface IPostState {
  post: IPost;
}
