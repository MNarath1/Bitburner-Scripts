import { break_ports, delete_smallest_server, scp_helper } from "./helper_functions/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const target_host = ns.args[0];
    const attack_memory = ns.args[1];
  
    ns.tprint("Starting Attack on Target Server!");
  
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
      const server_cost = ns.getPurchasedServerCost(attack_memory);
      if(server_cost > ns.getServerMoneyAvailable("home")) {
      ns.tprint("Cannot buy server with current funds!");
      ns.tprintf("Needed funds %s", ns.formatNumber(server_cost));
      return;
      } else {
        //comment this out if you need to start with low ram
        //------------------------------------------------
        delete_smallest_server(ns);
        //------------------------------------------------
        ns.tprint("Buying server");
      }
  
    const attack_server = ns.purchaseServer(target_host + "_attack_server", 
                                            attack_memory);
  
    const mem = (ns.getServerMaxRam(attack_server)
                - ns.getServerUsedRam(attack_server)
                - ns.getScriptRam("basic_hacking/hacking_controller.js"));
    
    scp_helper(ns, attack_server);

    ns.scp(["basic_hacking/hacking_controller.js", 
            "basic_hacking/hack.js", 
            "basic_hacking/grow.js", 
            "basic_hacking/weaken.js"], attack_server, "home");

    ns.exec("basic_hacking/hacking_controller.js", 
            attack_server, 
            1,
            target_host, 
            ns.getServerMaxMoney(target_host), 
            ns.getServerMinSecurityLevel(target_host),
            mem,
            ns.getScriptRam("basic_hacking/weaken.js"),
            ns.getScriptRam("basic_hacking/grow.js"),
            ns.getScriptRam("basic_hacking/hack.js"));
  }