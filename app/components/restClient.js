import { simpleRestClient, fetchUtils } from 'admin-on-rest';

const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    // add your own headers here
    options.headers.set('X-Custom-Header', 'foobar');
    options.headers.set('X-Total-Count', 30);
    return fetchUtils.fetchJson(url, options);
}
const restClient = simpleRestClient('http://localhost:3000', httpClient);
export default (type, resource, params) => new Promise(resolve => setTimeout(() => resolve(restClient(type, resource, params)), 500));
