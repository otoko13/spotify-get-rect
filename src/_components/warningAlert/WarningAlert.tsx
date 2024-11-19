'use client';

import { useCallback, useState } from 'react';

interface WarningAlertProps {
  text: string;
}

export default function WarningAlert({ text }: WarningAlertProps) {
  const [hide, setHide] = useState(false);

  const handleEnter = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setHide(true);
    }
  }, []);

  return !hide ? (
    <div
      className="toast toast-end cursor-pointer"
      onClick={() => setHide(true)}
      role="button"
      tabIndex={0}
      onKeyDown={handleEnter}
    >
      <div className="alert alert-warning">
        <span>{text}</span>
      </div>
    </div>
  ) : null;
}
