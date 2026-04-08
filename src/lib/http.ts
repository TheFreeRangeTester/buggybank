export const parseBody = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T;
  return data;
};

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
