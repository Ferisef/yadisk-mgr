import { RequestInit as NodeFetchRequestInit } from 'node-fetch';
import QueryParamsCollection from './QueryParamsCollection';

interface RequestInit extends NodeFetchRequestInit {
  queryParams?: QueryParamsCollection;
}

export default RequestInit;
