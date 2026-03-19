import * as OTPAuth from 'otpauth';

export const getTOTP = (secret, tick) => {
  try {
    const totp = new OTPAuth.TOTP({
      secret: secret.replace(/\s/g, ''),
      digits: 6,
      period: 30,
    });

    const epoch = Math.floor(tick / 1000);
    const secondsElapsed = epoch % totp.period;
    const secondsLeft = totp.period - secondsElapsed;
    const token = totp.generate();

    return {
      token,
      secondsLeft,
      isExpiring: secondsLeft <= 5,
      period: totp.period,
    };
  } catch (err) {
    return { token: 'ERR!!', secondsLeft: 0, isExpiring: false, period: 30 };
  }
};
