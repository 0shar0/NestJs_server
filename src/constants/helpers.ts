import { EnumTruckType } from './enums';
import {
  maxSmallStraightHeight,
  maxSmallStraightLength,
  maxSmallStraightPayload,
  maxSmallStraightWidth,
  maxSprinterHeight,
  maxSprinterLength,
  maxSprinterPayload,
  maxSprinterWidth,
} from './constants';
import { LoadDocument } from '../schemas/load.schema';

export const findTruckType = (dimensions, payload): string[] => {
  let types = [
    EnumTruckType.SPRINTER,
    EnumTruckType.LARGE_STRAIGHT,
    EnumTruckType.SMALL_STRAIGHT,
  ];
  if (
    payload > maxSprinterPayload ||
    dimensions.width > maxSprinterWidth ||
    dimensions.length > maxSprinterLength ||
    dimensions.height > maxSprinterHeight
  ) {
    types = types.filter((type) => type !== EnumTruckType.SPRINTER);
  }

  if (
    payload > maxSmallStraightPayload ||
    dimensions.width > maxSmallStraightWidth ||
    dimensions.length > maxSmallStraightLength ||
    dimensions.height > maxSmallStraightHeight
  ) {
    types = types.filter((type) => type !== EnumTruckType.SMALL_STRAIGHT);
  }
  return types;
};

export const formatLoad = ({
  _id,
  created_by,
  assigned_to,
  status,
  state,
  name,
  payload,
  pickup_address,
  delivery_address,
  dimensions,
  logs,
  createdAt,
}: any | LoadDocument) => {
  return {
    _id,
    created_by,
    assigned_to,
    status,
    state,
    name,
    payload,
    pickup_address,
    delivery_address,
    dimensions,
    logs,
    created_date: createdAt,
  };
};
export const formatFullInfoLoad = (
  load,
  { _id, created_by, assigned_to, type, status, createdAt },
) => {
  return {
    load: formatLoad(load),
    truck: {
      _id,
      created_by,
      assigned_to,
      type,
      status,
      created_date: createdAt,
    },
  };
};
