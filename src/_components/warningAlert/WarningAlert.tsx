'use client';

import { useState } from 'react';

interface WarningAlertProps {
  text: string;
}

export default function WarningAlert({ text }: WarningAlertProps) {
  const [hide, setHide] = useState(false);

  return !hide ? (
    <div
      className="toast toast-end cursor-pointer"
      onClick={() => setHide(true)}
    >
      <div className="alert alert-warning">
        <span>{text}</span>
      </div>
    </div>
  ) : null;
}
