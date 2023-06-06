import { break_ports } from "./helper_functions/break_ports";
import { scp_helpers } from "./helper_functions/scp_helpers";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const target_host = ns.args[0];
    const attack_memory = ns.args[1];
  
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
      const server_cost = ns.getPurchasedServerCost(attack_memory);
      if(server_cost > ns.getServerMoneyAvailable("home")) {
      ns.tprint("Cannot buy server with current funds!");
      ns.tprintf("Needed funds %s", ns.formatNumber(server_cost));
      return;
      } else {
        //comment this out if you need to start with low ram
        //------------------------------------------------
        var purchaseServers = ns.getPurchasedServers();
        if(purchaseServers >= ns.getPurchasedServerLimit()) {
          var min_Server;
          var min_ram = 2**20;
          for(let Server of purchaseServers) {
            var temp_ram = ns.getServerMaxRam(Server);
            if(temp_ram <= min_ram) {
              min_ram = temp_ram;
              min_Server = Server;
            }
          }
          ns.tprint("Deleting smallest Server to free Space!")
          ns.deleteServer(min_Server);
          }
        //------------------------------------------------
        ns.tprint("Buying server");
      }
  
    const attack_server = ns.purchaseServer(target_host + "_attack_server", 
                                            attack_memory);
  
    const mem = (ns.getServerMaxRam(attack_server)
                - ns.getServerUsedRam(attack_server)
                - ns.getScriptRam("basic_hacking/hacking_controller.js"));
    scp_helpers(ns, "home", attack_server);

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