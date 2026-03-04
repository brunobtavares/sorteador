import { routes } from './app.routes';

describe('App routes', () => {
  it('should declare the home route before wildcard redirect', () => {
    expect(routes[0].path).toBe('');
    expect(routes[1].path).toBe('**');
  });
});
