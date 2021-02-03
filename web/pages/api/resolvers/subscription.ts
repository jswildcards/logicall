import {
  UPDATE_CURRENT_LOCATION,
  CREATE_ORDER,
  UPDATE_ORDER_STATUS,
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

export default { currentLocationUpdated, orderCreated, orderStatusUpdated };
