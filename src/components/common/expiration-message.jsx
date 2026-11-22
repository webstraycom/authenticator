export const ExpirationMessage = ({ id, expiration, expires }) => {
  if (!expiration) {
    return (
      <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
        Your token will <strong className="text-foreground font-medium">never expire</strong>.
      </p>
    );
  }

  if (expires) {
    const isExpired = expires < new Date();

    if (isExpired)
      return (
        <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
          Your token is <strong className="text-foreground font-medium">already expired</strong>.
        </p>
      );

    return (
      <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
        Your token will expire on{' '}
        <strong className="text-foreground font-medium">
          {expires.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
        </strong>
        .
      </p>
    );
  }

  return (
    <p id={id} aria-live="polite" className="text-destructive text-sm">
      Please enter a valid date.
    </p>
  );
};
