'use client';

import classNames from 'classnames';

interface ToggleProps {
  className?: string;
  label: string;
  on: boolean;
  onChange: (value: boolean) => void;
}

export default function Toggle({
  className,
  label,
  on,
  onChange,
}: ToggleProps) {
  return (
    <div className={classNames('flex items-center mr-4', className)}>
      <p className="text-slate-300 text-sm mr-4 pt-2">{label}</p>
      <input
        checked={on}
        onChange={(e) => {
          onChange(!!e.target.checked);
        }}
        type="checkbox"
        className="toggle toggle-primary block"
      />
    </div>
  );
}
