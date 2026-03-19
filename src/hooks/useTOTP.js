import { useMemo } from 'react';
import { getTOTP } from '@utils/totp';

export const useTOTP = (secret, tick) => {
  return useMemo(() => getTOTP(secret, tick), [secret, tick]);
};
