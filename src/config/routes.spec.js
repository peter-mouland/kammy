import { expect } from '../../tests/config/test.helper';
import routesConfig from './routes';

describe('routes', ()=>{
  it('should always start with /', () => {
    Object.keys(routesConfig).forEach(route => {
      expect(routesConfig[route].path.substr(0,1)).to.equal('/', 'route does not start with /')
    })
  });

  it('should always end with / to allow both routes to work', () => {
    Object.keys(routesConfig)
      .forEach(route => {
      const pattern = routesConfig[route].path;
      expect(pattern.substr(-1)).to.equal('/', 'route does not end with /')
    })
  });
});
