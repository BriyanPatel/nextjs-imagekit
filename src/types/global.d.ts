declare global {
  type ActionResponse<T> =
    | {
        success: true;
        data: T;
      }
    | {
        success: false;
        error: {
          message: string;
        };
      };

  type ErrorResponse = {
    success: false;
    error: {
      message: string;
    };
  };

  type RouteParams = {
    params: Promise<{
      id: string;
    }>;
  };
}

export {};
