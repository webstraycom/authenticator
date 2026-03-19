export const ExpirationMessage = ({ expiration, expires }) => {
  if (!expiration) {
    return (
      <p className="text-muted-foreground px-1 text-sm">
        Your token will <span className="text-foreground font-medium">never expire</span>.
      </p>
    );
  }

  if (expires) {
    const isExpired = expires < new Date();

    if (isExpired)
      return (
        <p className="text-muted-foreground px-1 text-sm">
          Your token is <span className="text-foreground font-medium">already expired</span>.
        </p>
      );

    return (
      <p className="text-muted-foreground px-1 text-sm">
        Your token will expire on{' '}
        <span className="text-foreground font-medium">
          {expires.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
        </span>
        .
      </p>
    );
  }

  return <p className="text-destructive px-1 text-sm">Please enter a valid date.</p>;
};
