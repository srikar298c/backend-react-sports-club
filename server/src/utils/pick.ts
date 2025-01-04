import { ParsedQs } from 'qs';

type AnyObject = Record<string, any>;

/**
 * Create an object composed of the picked object properties
 * @param object - The source object
 * @param keys - The keys to pick from the source object
 * @returns A new object containing only the picked properties
 */
const pick = <T extends AnyObject, K extends keyof T>(
  object: T | ParsedQs,
  keys: K[]
): Partial<Record<K, string>> => {
  return keys.reduce((obj, key) => {
    if (object && typeof object === 'object' && key in object) {
      // Access key safely after type narrowing
      const value = (object as T)[key];
      // Ensure the value is cast to a string if necessary
      obj[key] = Array.isArray(value) ? value.join(',') : String(value);
    }
    return obj;
  }, {} as Partial<Record<K, string>>);
};

export default pick;
