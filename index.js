/// <reference types="../CTAutocomplete" />
/// <reference lib="esnext" />

const fields = JSON.parse(FileLib.read("mapper", "fields.json"));
const methods = JSON.parse(FileLib.read("mapper", "methods.json"));

const finder = (object, name, type) => {
  try {
    if (!!object[name]) return name;
  } catch (err) {}
  const arr = type === "field" ? fields : methods;
  return arr[name]?.find((v) => !!object[v]);
};

/**
 * @example const displayWidth = mapField(Client.getMinecraft(), "displayWidth");
 * // displayWidth === "field_71443_c"
 * @returns {string} the mapped field name
 */
export const mapField = (object, field) => {
  const mapped = finder(object, field, "field");
  if (mapped) return mapped;
  throw new Error(
    `No deobfuscated field "${field}" for class ${object.class.getName()} found`
  );
};

/**
 * @example const session = mapMethod(Client.getMinecraft(), "getSession");
 * // session === "func_110432_I"
 * @returns {string} the mapped method name
 */
export const mapMethod = (object, method) => {
  const mapped = finder(object, method, "method");
  if (mapped) return mapped;
  throw new Error(
    `No deobfuscated method "${method}" for class ${object.class.getName()} found`
  );
};

/**
 * @example const displayWidth = Client.getMinecraft() |> f("displayWidth");
 * // displayWidth === 1920
 * @returns the value of the object's field
 */
export const f = (field) => {
  return (object) => {
    const mapped = mapField(object, field);
    return object[mapped];
  };
};

/**
 * @example const session = Client.getMinecraft() |> m("getSession");
 * // session === net.minecraft.util.Session@19c48bb3
 * @returns the return value of the object's method
 */
export const m = (method, ...params) => {
  return (object) => {
    const mapped = mapMethod(object, method);
    return params?.length ? object[mapped](...params) : object[mapped]();
  };
};
