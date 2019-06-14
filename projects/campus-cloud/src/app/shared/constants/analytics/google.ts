const googleEventCategory = {
  OUTBOUND: 'Outbound'
};

const googleEventAction = {
  ZENDESK: 'Zendesk'
};

const googleEventLabel = {
  CP_TOP_BANNER: 'CP Top Banner'
};

export const cpTrackGoogle = {
  label: { ...googleEventLabel },
  action: { ...googleEventAction },
  category: { ...googleEventCategory }
};
