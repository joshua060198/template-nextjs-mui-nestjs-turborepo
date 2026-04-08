export function enumToOptions<E extends Record<string, string>>(
  enm: E,
  labelMap?: (key: keyof E) => string,
) {
  return Object.entries(enm).map(([key, value]) => ({
    label: labelMap ? labelMap(key as keyof E) : key,
    value,
  }));
}

export function capitalizeEachWord(str: string) {
  return str.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
