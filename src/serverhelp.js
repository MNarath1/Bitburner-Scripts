import { scp_helper } from "./helpers/helper_functions";
import { HOME_SERVER } from "./helpers/helper_vars";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
  let attack_server = ns.args[0];
  let target_host = ns.args[1];
  let mem = (ns.getServerMaxRam(attack_server)-ns.getServerUsedRam(attack_server)- ns.getScriptRam("basic_hacking/hacking_controller.js"));
  scp_helper(ns, attack_server);
  ns.scp(["basic_hacking/hacking_controller.js", "basic_hacking/hack.js", "basic_hacking/grow.js", "basic_hacking/weaken.js"], attack_server, HOME_SERVER);

  ns.exec("basic_hacking/hacking_controller.js", attack_server, 1,
  target_host, 
  ns.getServerMaxMoney(target_host), 
  ns.getServerMinSecurityLevel(target_host),
  mem,
  ns.getScriptRam("basic_hacking/weaken.js"),
  ns.getScriptRam("basic_hacking/grow.js"),
  ns.getScriptRam("basic_hacking/hack.js"));
}