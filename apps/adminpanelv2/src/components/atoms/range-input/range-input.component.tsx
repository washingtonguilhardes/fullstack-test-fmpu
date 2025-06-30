import { useCallback } from 'react';

import { cn } from '@/lib/utils';

export type RangeInputProps = {
  title: string;
  value: number;
  name: string;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

export function RangeInput(
  props: React.ComponentProps<'label'> & RangeInputProps,
) {
  const { title, value, onChange, name, min, max = 5, ...rest } = props;

  const toRange = useCallback(
    (value: number) => ((value * 100) / max).toFixed(2),
    [max],
  );

  const fromRange = useCallback(
    (value: number) => ((value * max) / 100).toFixed(2),
    [max],
  );

  return (
    <label
      htmlFor={name}
      {...rest}
      className={cn(
        'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
        rest.className,
      )}
    >
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </span>
      <input
        id={name}
        type="range"
        value={toRange(value)}
        onChange={(e) =>
          onChange(parseFloat(fromRange(Number(e.target.value))))
        }
        className="w-full h-2 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </label>
  );
}
