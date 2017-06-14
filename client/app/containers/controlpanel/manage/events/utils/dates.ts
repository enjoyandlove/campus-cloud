import { CPDate } from '../../../../../shared/utils/date';

const isPastEvent = function isPastEvent(endDate) {
  return endDate < CPDate.toEpoch(new Date());
};

const isUpcomingEvent = function isUpcomingEvent(startDate) {
  return startDate > CPDate.toEpoch(new Date());
};

export const EventDate = {
  isPastEvent,
  isUpcomingEvent
};
