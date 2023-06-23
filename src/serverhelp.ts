import { scp_important_files } from "./helpers/helper_functions";
import { HOME_SERVER } from "./helpers/helper_vars";
import { AutocompleteData, NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
  const attack_server = <string>ns.args[0];
  const target_host = <string>ns.args[1];
  const mem = (ns.getServerMaxRam(attack_server)-ns.getServerUsedRam(attack_server)- ns.getScriptRam("basic_hacking/hacking_controller.js"));
  scp_important_files(ns, attack_server);
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

  //autocomplete for server 
  export function autocomplete(data: AutocompleteData) {
    return data.servers;
}