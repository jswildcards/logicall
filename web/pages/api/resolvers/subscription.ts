import {
  REQUEST_CURRENT_LOCATION,
  RESPONSE_CURRENT_LOCATION,
  CREATE_ORDER,
  UPDATE_ORDER_STATUS,
} from "../utils/subscription-types";
import { Context } from "../utils/types";

export const currentLocationRequested = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator([REQUEST_CURRENT_LOCATION]);
  },
};

export const currentLocationResponsed = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator([RESPONSE_CURRENT_LOCATION]);
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

export default { currentLocationRequested, currentLocationResponsed, orderCreated, orderStatusUpdated };
