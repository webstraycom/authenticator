export const ExpirationMessage = ({ id, expiration, expires }) => {
  if (!expiration) {
    return (
      <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
        Your token will <span className="text-foreground font-medium">never expire</span>.
      </p>
    );
  }

  if (expires) {
    const isExpired = expires < new Date();

    if (isExpired)
      return (
        <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
          Your token is <span className="text-foreground font-medium">already expired</span>.
        </p>
      );

    return (
      <p id={id} aria-live="polite" className="text-muted-foreground text-sm">
        Your token will expire on{' '}
        <span className="text-foreground font-medium">
          {expires.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        .
      </p>
    );
  }

  return <p id={id} aria-live="polite" className="text-destructive text-sm">Please enter a valid date.</p>;
};
