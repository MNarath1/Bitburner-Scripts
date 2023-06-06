import { break_ports } from "./helper_functions/break_ports";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const target_host = ns.args[0];
    const attack_server = ns.getHostname();
  
    ns.tprint("Starting Attack on Target Server!");

    if(!ns.hasRootAccess(target_host)) {
      var open_ports = await break_ports(ns, target_host);

      ns.tprint("Root Priviliges Required.");
      if(ns.getServerNumPortsRequired(target_host) <= open_ports){
        await ns.sleep(500);
        ns.print("Attempting to elevate Priviliges.");
        await ns.sleep(200);
        ns.nuke(target_host);
      }
      if(ns.hasRootAccess(target_host)){
        ns.tprint("Root Access elevation sucessfull!");
      } else {
        ns.tprint("Root Priviliges Escalation unsucessfull!");
        return;
      }
    } else {
      ns.tprint("Root Access already aquired continuing!");
    }

    var server_ram = ns.getServerMaxRam(attack_server);
    var script_ram = ns.getScriptRam("initial.js");
    if(script_ram >= server_ram) {
      script_ram = ns.getScriptRam("local_hacking_initial.js");
    }

    const mem = (server_ram
      - ns.getServerUsedRam(attack_server)
      - ns.getScriptRam("basic_hacking/hacking_controller.js")
      - script_ram);
    
    ns.tprint("Starting hacking Script on local Machine.");
    ns.run("basic_hacking/hacking_controller.js",
            1,
            target_host, 
            ns.getServerMaxMoney(target_host), 
            ns.getServerMinSecurityLevel(target_host),
            mem,
            ns.getScriptRam("basic_hacking/weaken.js"),
            ns.getScriptRam("basic_hacking/grow.js"),
            ns.getScriptRam("basic_hacking/hack.js"));
  }