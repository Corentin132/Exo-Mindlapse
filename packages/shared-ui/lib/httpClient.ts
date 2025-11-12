type HeadersLike = HeadersInit | undefined;

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
type RequestMethodWithBody = "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpClientOptions {
  baseUrl: string;
  defaultHeaders?: HeadersInit;
  credentials?: RequestCredentials;
}

export interface RequestOptions extends RequestInit {
  method?: RequestMethod;
}


export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: HeadersInit | undefined;
  private readonly defaultCredentials: RequestCredentials | undefined;

  constructor(options: HttpClientOptions) {
    this.baseUrl = options.baseUrl
    this.defaultHeaders = options.defaultHeaders;
    this.defaultCredentials = options.credentials;
  }

  public async request(path: string, init: RequestOptions = {}): Promise<Response> {
    const requestInit = this.composeInit(init);
    const targetUrl = this.resolveUrl(path);
    return fetch(targetUrl, requestInit);
  }
  public async get(path: string, init: RequestOptions = {}): Promise<Response> {
    return this.request(path, { ...init, method: "GET" });
  }

  public async delete(path: string, init: RequestOptions = {}): Promise<Response> {
    return this.request(path, { ...init, method: "DELETE" });
  }

  public async post(path: string, body?: unknown, init: RequestOptions = {}): Promise<Response> {
    return this.requestWithJsonBody("POST", path, body, init);
  }

  public async put(path: string, body?: unknown, init: RequestOptions = {}): Promise<Response> {
    return this.requestWithJsonBody("PUT", path, body, init);
  }

  public async patch(path: string, body?: unknown, init: RequestOptions = {}): Promise<Response> {
    return this.requestWithJsonBody("PATCH", path, body, init);
  }

  private resolveUrl(path: string): string {
    if (!path) {
      return this.baseUrl;
    }

    return `${this.baseUrl}${path}`;
  }

  private composeInit(init: RequestOptions): RequestInit {
    const headers = this.mergeHeaders(this.defaultHeaders, init.headers);
    return {
      ...init,
      headers,
      credentials: init.credentials ?? this.defaultCredentials,
    };
  }

  private mergeHeaders(...sources: HeadersLike[]): Headers {
    const result = new Headers();
    for (const source of sources) {
      if (!source) {
        continue;
      }
      const headers = new Headers(source);
      headers.forEach((value, key) => {
        result.set(key, value);
      });
    }
    return result;
  }

  private requestWithJsonBody(
    method: RequestMethodWithBody,
    path: string,
    body?: unknown,
    init: RequestOptions = {}
  ): Promise<Response> {
    const preparedInit: RequestOptions = {
      ...init,
      method,
      body: body !== undefined ? JSON.stringify(body) : init.body,
      headers: this.mergeHeaders({ "Content-Type": "application/json" }, init.headers),
    };

    if (body === undefined) {
      if (preparedInit.headers instanceof Headers) {
        preparedInit.headers.delete("Content-Type");
      } else {
        const headers = new Headers(preparedInit.headers);
        headers.delete("Content-Type");
        preparedInit.headers = headers;
      }
    }

    return this.request(path, preparedInit);
  }
}

export function createHttpClient(options: HttpClientOptions): HttpClient {
  return new HttpClient(options);
}
