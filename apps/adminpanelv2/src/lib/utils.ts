import { clsx, type ClassValue } from 'clsx';
import isEqual from 'lodash-es/isEqual';
import sl from 'slugify';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function slugify(value: string) {
  return sl(value, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
}

export function getChangedFields<
  T extends Partial<{ guid?: string; [key: string]: any }>,
>(current: T, original: T, changes: Partial<T> = {}, deep = 'root'): Partial<T> {
  const guid = original?.guid;
  console.group(`changedFields ${guid}`);

  let hasChanges = false;
  for (const key in current) {
    if (key === '__typename') continue;
    const currentValue = current[key];
    const originalValue = original[key];

    if (Array.isArray(currentValue) && Array.isArray(originalValue)) {
      const length = Math.max(currentValue.length, originalValue.length);
      if (length !== originalValue.length) {
        changes[key] = currentValue;
        hasChanges = true;
        continue;
      }

      for (let i = 0; i < length; i++) {
        const item = originalValue[i];
        const diff = getChangedFields(currentValue[i], item, {}, `${deep}.${key}[${i}]`);
        if (Object.keys(diff).length > 0) {
          if (!changes[key]) {
            changes[key] = [] as any;
          }

          changes[key] = [...((changes[key] ?? []) as any), diff] as any;
          hasChanges = true;
          break;
        }
      }
    } else if (!isEqual(currentValue, originalValue)) {
      changes[key] = currentValue;
      hasChanges = true;
    }
    console.log('hasChanges', `${deep}.${key}`, originalValue, currentValue);
  }
  if (hasChanges && guid) {
    changes = { ...changes, guid };
  }
  console.groupEnd();
  return changes;
}
