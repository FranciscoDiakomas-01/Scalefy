export interface InterService<Input, Output> {
  handle(props: Input | Input[]): Promise<Output> | Output;
}

export interface IPaginationReturnType<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  lastPage: number;
}

export interface IPaginationProps {
  page: number;
  limit: number;
  query?: string;
}
