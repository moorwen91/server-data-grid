import { isArray } from 'lodash';

export function mapToInsertMutationPayload(
  object: unknown
): Record<string, unknown> | unknown[] | unknown {
  if (isArray(object)) {
    return object.map(i => mapToInsertMutationPayload(i));
  }
  if (typeof object === 'object') {
    let result: Record<string, unknown> = {};
    for (const key in object) {
      let value = (object as Record<string, unknown>)[key];
      if (value && typeof value === 'object') {
        value = {
          data: mapToInsertMutationPayload(value),
        };
      }
      result[key] = value;
    }
    return result;
  }
  return object;
}
