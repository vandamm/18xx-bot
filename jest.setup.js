// Mock global objects for Cloudflare Workers environment
global.Request = class MockRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = options.headers || {};
    this.body = options.body || null;
  }
  
  async json() {
    return JSON.parse(this.body || '{}');
  }
};

global.Response = class MockResponse {
  constructor(body, options = {}) {
    this.body = body;
    this.status = options.status || 200;
    this.headers = options.headers || {};
  }
  
  async text() {
    return this.body || '';
  }
};

global.URL = class MockURL {
  constructor(url) {
    const parsed = new (require('url').URL)(url);
    this.pathname = parsed.pathname;
    this.search = parsed.search;
    this.searchParams = parsed.searchParams;
  }
};

global.ExecutionContext = class MockExecutionContext {};

// Mock process.env for tests that still need it
if (!global.process) {
  global.process = { env: {} };
} 