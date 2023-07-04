import axios from 'axios';
import { QueryKey, UseQueryOptions, useQueries, useQuery } from 'react-query';

export type StreamDetail = {
  name: string;
  value: string | number;
};

export type StreamChannel = {
  display: {
    scale: {
      max: number;
      min: number;
    };
    unit: string;
  };
  index: number;
  name: string;
  rate: number;
};

export type StreamIdentity = {
  identity: {
    hash: string;
    channels: StreamChannel[];
    details: {
      Device_Serial: StreamDetail;
      Device_Type: StreamDetail;
      Device_Version: StreamDetail;
      Event: StreamDetail;
      Gear_1: StreamDetail;
      Gear_2: StreamDetail;
      Gear_3: StreamDetail;
      Gear_4: StreamDetail;
      Gear_5: StreamDetail;
      Gear_6: StreamDetail;
      Log_Date: StreamDetail;
      Log_Time: StreamDetail;
      Long_Comment: StreamDetail;
      Session: StreamDetail;
      Short_Comment: StreamDetail;
      Vehicle_Desc: StreamDetail;
      Vehicle_Id: StreamDetail;
      Vehicle_Type: StreamDetail;
      Vehicle_Wheelbase: StreamDetail;
      Vehicle_Venue: StreamDetail;
      Vehicle_Venue_Type: StreamDetail;
    };
  };
};

export const useGetStreamIdentityQuery = (
  httpUri: string,
  streamId: string,
  options?: UseQueryOptions<StreamIdentity, any>
) => {
  return useQuery(
    ['STREAM_IDENTITY', streamId, httpUri] as QueryKey,
    () =>
      axios.get(`${httpUri}/JSON/${streamId}/identity`).then((res) => res.data),
    options
  );
};

export const useGetStreamIdentitiesQuery = (
  httpUri: string,
  streamIds: string[]
) => {
  return useQueries<(StreamIdentity | null)[]>(
    streamIds.map((streamId) => ({
      queryKey: ['STREAM_IDENTITY', streamId, httpUri],
      queryFn: () =>
        axios
          .get<StreamIdentity>(`${httpUri}/JSON/${streamId}/identity`)
          .then((res) => res.data),
    }))
  );
};
