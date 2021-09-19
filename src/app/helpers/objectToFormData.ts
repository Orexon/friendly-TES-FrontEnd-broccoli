export function isUndefined(value: any) {
  return value === undefined;
}

export function isNull(value: any) {
  return value === null;
}

export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

export function isObject(value: any) {
  return value === Object(value);
}

export function isArray(value: any) {
  return Array.isArray(value);
}

export function isDate(value: any) {
  return value instanceof Date;
}

export function isBlob(value: any) {
  return (
    value &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.slice === 'function'
  );
}

export function isFile(value: any) {
  return (
    isBlob(value) &&
    typeof value.name === 'string' &&
    (typeof value.lastModifiedDate === 'object' ||
      typeof value.lastModified === 'number')
  );
}

export function objectToFormData(obj: any, cfg?: any, fd?: any, pre?: any) {
  cfg = cfg || {};

  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;

  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds)
    ? false
    : cfg.nullsAsUndefineds;

  cfg.booleansAsIntegers = isUndefined(cfg.booleansAsIntegers)
    ? false
    : cfg.booleansAsIntegers;

  fd = fd || new FormData();

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) {
      fd.append(pre, '');
    }
  } else if (isBoolean(obj)) {
    if (cfg.booleansAsIntegers) {
      fd.append(pre, obj ? 1 : 0);
    } else {
      fd.append(pre, obj);
    }
  } else if (isArray(obj)) {
    if (obj.length) {
      obj.forEach((value: any, index: any) => {
        const key = pre + '[' + (cfg.indices ? index : '') + ']';

        objectToFormData(value, cfg, fd, key);
      });
    }
  } else if (isDate(obj)) {
    fd.append(pre, obj.toISOString());
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach((prop) => {
      const value = obj[prop];

      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf('[]') === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }
      const key = pre ? pre + '.' + prop : prop;

      objectToFormData(value, cfg, fd, key);
    });
  } else {
    fd.append(pre, obj);
  }

  return fd;
}
