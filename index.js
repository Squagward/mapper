/// <reference types="../CTAutocomplete" />
/// <reference lib="esnext" />

const fields = JSON.parse(FileLib.read("mapper", "fields.json"));
const methods = JSON.parse(FileLib.read("mapper", "methods.json"));

/**
 * @param {JavaTClass<T>} object the Java object, of which to find the mapped field name
 * @param {string} field the MCP field name
 * @example const displayWidthField = mapField(Client.getMinecraft(), "displayWidth");
 * // displayWidthField === "field_71443_c"
 * @returns {string} the name of the mapped field
 */
export const mapField = (object, field) => {
  if (!(field in fields)) {
    throw new Error(`mapper: Field ${field} not found in fields.json`);
  }
  const mapped = fields[field].find((v) => !!object[v]);
  if (mapped) return mapped;
  throw new Error(
    `mapper: No deobfuscated field ${field} for class ${object.class.getName()} found`
  );
};

/**
 * @param {JavaTClass<T>} object the Java object, of which to find the mapped method name
 * @param {string} method the MCP method name
 * @example const sessionMethod = mapMethod(Client.getMinecraft(), "getSession");
 * // sessionMethod is equal to ["func_110432_I"]
 * @returns {string[]} the valid **names** of the mapped method. (This is
 * due to method overloads having different obfuscated names)
 */
export const mapMethod = (object, method) => {
  if (!(method in methods)) {
    throw new Error(`mapper: Method ${method} not found in methods.json`);
  }
  const mapped = methods[method].filter((v) => {
    try {
      !!object[v];
      return true;
    } catch (err) {
      return false;
    }
  });

  if (mapped.length > 0) return mapped;
  throw new Error(
    `mapper: No deobfuscated field ${method} for class ${object.class.getName()} found`
  );
};

/**
 * @param {string} field the MCP field name
 * @param object the Java object, of which to invoke the field
 * @example const displayWidth = Client.getMinecraft() |> f("displayWidth");
 * // displayWidth === 1920
 * @returns the field value for the object
 */
export const f = (field) => {
  /** @param {JavaTClass<T>} object */
  return (object) => {
    const mapped = mapField(object, field);
    return object[mapped];
  };
};

/**
 * @param {string} method the MCP method name
 * @param {string[]=} params the method parameters, leave empty if not applicable
 * @param object the Java object, of which to invoke the method
 * @example const session = Client.getMinecraft() |> m("getSession");
 * // session === net.minecraft.util.Session@19c48bb3
 * @returns the return value of the method for the object
 */
export const m = (method, ...params) => {
  /** @param {JavaTClass<T>} object */
  return (object) => {
    const validMethods = mapMethod(object, method);

    for (const validMethod of validMethods) {
      try {
        return params?.length
          ? object[validMethod](...params)
          : object[validMethod]();
      } catch (e) {}
    }
  };
};
