declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      // timestamp string akshually
      createdAt: string;
      displayName: string;
      fullName: string;
    };
  }
}
