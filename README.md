```js
import { mapField, mapMethod, m, f } from "./index";
```

mapField & mapMethod only return the mapped names, while
m & f return the value of the field/method applied to the object.

**Note**: Due to method overloading, mapMethod returns an array of valid methods,
most of the time just being 1.

```js
const displayWidthField = mapField(Client.getMinecraft(), "displayWidth");

const displayWidth = Client.getMinecraft() |> f("displayWidth");

console.log(
  displayWidthField, // field_71443_c
  Client.getMinecraft()[displayWidthField], // 1920

  displayWidth // 1920
);
```

In this example, `displayWidthField` returns the simple mapped field name. To get
the actual value of the field you can invoke on an object like line 18, or use the
`f` function, which is what `displayWidth` uses.

---

```js
const sessionMethod = mapMethod(Client.getMinecraft(), "getSession");

const session = Client.getMinecraft() |> m("getSession");

console.log(
  sessionMethod, // [ func_110432_I ]
  Client.getMinecraft()[sessionMethod[0]](), // net.minecraft.util.Session@19c48bb3

  session.toString() // net.minecraft.util.Session@19c48bb3
);
```

In this example, `sessionMethod` returns an array of the valid method names for that
object. In this case it is just an array with the 1 mapped value. The data in the
`session` variable is the actual return value as if you called `sessionMethod` onto
a `Minecraft` instance.

---

This next example shows the power of the pipeline operator, allowing chaining of
`m` and `f` functions.

```js
const name = Client.getMinecraft() |> f("thePlayer") |> m("getName");

console.log(
  name // Squagward
);
```

Some other simple examples

```js
register("renderOverlay", () => {
  GlStateManager |> m("pushMatrix");

  GlStateManager |> m("scale", 0.5, 0.5, 1);

  Renderer.drawRect(Renderer.AQUA, 10, 10, 100, 100);

  GlStateManager |> m("popMatrix");
});
```

**Note**: the `m` function can take in as many parameters as the method requires.

This code block will draw a rectangle with 50 width, 50 height due to the scaling
