import { withFilter } from "graphql-subscriptions";
import {
  UPDATE_CURRENT_LOCATION,
  CREATE_ORDER,
  UPDATE_ORDER_STATUS,
  REQUEST_NEW_JOB,
  RESPONSE_NEW_JOB,
} from "../utils/subscription-types";
import { Context } from "../utils/types";

export const currentLocationUpdated = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator([UPDATE_CURRENT_LOCATION]);
  },
};

export const orderCreated = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator([CREATE_ORDER]);
  },
};

export const orderStatusUpdated = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator([UPDATE_ORDER_STATUS]);
  },
};

export const newJobRequested = {
  subscribe: withFilter(
    (_parent: any, _args: any, { pubsub }: Context) => {
      return pubsub.asyncIterator([REQUEST_NEW_JOB]);
    },
    (payload, variables) => {
      return payload.newJobRequested.driverIds.includes(variables.driverId);
    }
  ),
};

export const newJobResponsed = {
  subscribe: withFilter(
    (_parent: any, _args: any, { pubsub }: Context) => {
      return pubsub.asyncIterator([RESPONSE_NEW_JOB]);
    },
    (payload, variables) => {
      return payload.newJobResponsed.driverIds.includes(variables.driverId);
    }
  ),
};

export default {
  currentLocationUpdated,
  orderCreated,
  orderStatusUpdated,
  newJobRequested,
  newJobResponsed,
};
