interface Error {
  code?: number;
  source?: { pointer: string };
  title?: string;
  detail?: string;
}

export interface ErrorMessageProps {
  errors: Error[];
}
