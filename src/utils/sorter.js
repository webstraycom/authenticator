export const sorter = (a, b) => {
  const now = new Date();

  if (a.isCorrupted && !b.isCorrupted) return 1;
  if (!a.isCorrupted && b.isCorrupted) return -1;

  if (a.type === 'token' && b.type === 'token' && !a.isCorrupted && !b.isCorrupted) {
    const aExpired = a.expires && new Date(a.expires) <= now;
    const bExpired = b.expires && new Date(b.expires) <= now;

    if (aExpired && !bExpired) return 1;
    if (!aExpired && bExpired) return -1;

    if (!aExpired && !bExpired) {
      if (!a.expires && b.expires) return -1;
      if (a.expires && !b.expires) return 1;
    }

    if (a.expires && b.expires) {
      const dateDiff = new Date(a.expires) - new Date(b.expires);
      if (dateDiff !== 0) return dateDiff;
    }
  }

  const getLabel = (item) => {
    if (item.type === 'password') return item.site || '';
    if (item.type === 'totp' || item.type === 'token')
      return item.service || item.account || item.endpoint || '';
    return '';
  };

  const labelA = getLabel(a).trim().toLowerCase();
  const labelB = getLabel(b).trim().toLowerCase();

  return labelA.localeCompare(labelB);
};
