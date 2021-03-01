export interface MockResponse {
  status(code: number): MockResponse;
  json(object: Record<string, any>): void;
  statusCode?: number;
  body?: Record<string, any>;
}
