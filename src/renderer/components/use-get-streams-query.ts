import axios from 'axios';
import { QueryKey, UseQueryOptions, useQuery } from 'react-query';

export type StreamEntity = {
  id: string; // mtc_63190AA8_11_JSON
  item: string; // 11
  name: string; // JSON
};

export const useGetStreamsQuery = (
  httpHost: string,
  options?: UseQueryOptions<StreamEntity[], any>
) => {
  return useQuery(
    ['GET_STREAM', httpHost] as QueryKey,
    () => axios.get(`${httpHost}/JSON`).then((res) => res.data),
    options
  );
};
