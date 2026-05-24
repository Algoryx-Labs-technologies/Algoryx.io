/** Cal.com element-click embed — Algoryx Labs Tech Consultation (15m). */
export const CAL_EMBED_SCRIPT = 'https://app.cal.com/embed/embed.js';
export const CAL_ORIGIN = 'https://cal.com';
export const CAL_NAMESPACE = '15min';
/** https://cal.com/algoryx-labs/15min */
export const CAL_LINK = 'algoryx-labs/15min';

export const CAL_UI_CONFIG = {
  layout: 'month_view',
  useSlotsViewOnSmallScreen: 'true',
  overlayCalendar: true,
} as const;

export function getCalButtonProps() {
  return {
    'data-cal-link': CAL_LINK,
    'data-cal-namespace': CAL_NAMESPACE,
    'data-cal-config': JSON.stringify(CAL_UI_CONFIG),
  } as const;
}
