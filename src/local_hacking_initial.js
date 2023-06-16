import { break_ports, input_server } from "./helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const attack_server = ns.getHostname();
    const target_host = await input_server(ns);
  
    ns.tprintf("Starting Attack on %s!", target_host);

    if(!ns.hasRootAccess(target_host)) {
      ns.tprint("Root Priviliges Required.");
      if(ns.getServerNumPortsRequired(target_host) <= await break_ports(ns, target_host)) {
        await ns.sleep(500);
        ns.print("Attempting to elevate Priviliges.");
        await ns.sleep(200);
        ns.nuke(target_host);
      }
      if(ns.hasRootAccess(target_host)) {
        ns.tprint("Root Access elevation sucessfull!");
      } else {
        ns.tprint("Root Priviliges Escalation unsucessfull!");
        return;
      }
    } else {
      ns.tprint("Root Access already aquired continuing!");
    }

    let server_ram = ns.getServerMaxRam(attack_server);
    let script_ram = ns.getScriptRam("initial.js");
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