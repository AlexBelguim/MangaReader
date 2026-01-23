// Simple hash-based router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  register(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRoute() {
    let hash = window.location.hash.slice(1) || '/';
    
    // Strip query string from hash - it will be accessed via window.location.search
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      hash = hash.substring(0, queryIndex);
    }
    
    const [path, ...params] = hash.split('/').filter(Boolean);
    const routePath = '/' + (path || '');
    
    if (this.routes[routePath]) {
      this.currentRoute = routePath;
      this.routes[routePath](params);
    } else if (this.routes['*']) {
      this.routes['*'](params);
    }
  }

  start() {
    this.handleRoute();
  }
}

const router = new Router();
