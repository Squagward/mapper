import { mapField, mapMethod, m, f } from "./index";
// hover over each for a simple example

// mapField & mapMethod only return the mapped names, while
// m & f return the value of the field/method applied to the object

const displayWidthName = mapField(Client.getMinecraft(), "displayWidth");

const actualDisplayWidth = f("displayWidth")(Client.getMinecraft());

console.log(
  displayWidthName, //                        "field_71443_c"
  Client.getMinecraft()[displayWidthName], // 1920

  actualDisplayWidth //                       1920
);

const getSessionMapped = mapMethod(Client.getMinecraft(), "getSession");

const getSessionValue = m("getSession")(Client.getMinecraft());

console.log(
  getSessionMapped, //                          func_110432_I
  Client.getMinecraft()[getSessionMapped](), // net.minecraft.util.Session@19c48bb3

  getSessionValue.toString() //                 net.minecraft.util.Session@19c48bb3
);

///////////////////////////////////////////////////////////////////////

// regular ways
const player = f("thePlayer")(Client.getMinecraft());
const name1 = m("getName")(player);

// or via pipeline operator
const name2 = Client.getMinecraft() |> f("thePlayer") |> m("getName");

console.log(
  name1, // Squagward
  name2 //  Squagward
);

// other examples
const GlStateManager = Java.type(
  "net.minecraft.client.renderer.GlStateManager"
);

register("renderOverlay", () => {
  GlStateManager |> m("pushMatrix");

  // Note: the m function can take in as many parameters as the method requires
  GlStateManager |> m("scale", 0.5, 0.5, 1);

  // will draw rectangle with 50 width, 50 height due to the scaling
  Renderer.drawRect(Renderer.AQUA, 10, 10, 100, 100);

  GlStateManager |> m("popMatrix");
});
