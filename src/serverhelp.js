import { scp_helpers } from "./helper_functions/scp_helpers";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
  var attack_server = ns.args[0];
  var target_host = ns.args[1];
  var mem = (ns.getServerMaxRam(attack_server)-ns.getServerUsedRam(attack_server)- ns.getScriptRam("basic_hacking/hacking_controller.js"));
  scp_helpers(ns, "home", attack_server);
  ns.scp(["basic_hacking/hacking_controller.js", "basic_hacking/hack.js", "basic_hacking/grow.js", "basic_hacking/weaken.js"], attack_server, "home");

  ns.exec("basic_hacking/hacking_controller.js", attack_server, 1,
  target_host, 
  ns.getServerMaxMoney(target_host), 
  ns.getServerMinSecurityLevel(target_host),
  mem,
  ns.getScriptRam("basic_hacking/weaken.js"),
  ns.getScriptRam("basic_hacking/grow.js"),
  ns.getScriptRam("basic_hacking/hack.js"));
}