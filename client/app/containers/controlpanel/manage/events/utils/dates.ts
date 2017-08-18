import { CPDate } from '../../../../../shared/utils/date';

function isPastEvent(endDate) {
  return endDate < CPDate.toEpoch(new Date());
};

function isUpcomingEvent(startDate) {
  return startDate > CPDate.toEpoch(new Date());
};

export const EventDate = {
  isPastEvent,
  isUpcomingEvent
};
