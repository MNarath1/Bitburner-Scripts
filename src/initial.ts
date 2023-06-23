import { break_ports, delete_smallest_server, scp_helper } from "./helpers/helper_functions";
import { HOME_SERVER } from "./helpers/helper_vars";
import { AutocompleteData, NS } from '@ns';

/** @param {NS} ns */
export async function main(ns: NS) {
    let attack_memory = 0;

    const target_host = <string>ns.args[0];
    const server_cost_array = get_server_cost(ns);
    const prompt_array = format_dropdown_choices(ns, server_cost_array);

    if(!target_host) {
      ns.tprint("No target server please input valid server!");
      ns.exit();
    }

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
        ns.exit();
      }
    } else {
      ns.tprint("Root Access already aquired continuing!");
    }
      const choice = prompt_array.indexOf(await ns.prompt("Select Ram for Server.", {type : "select", choices: prompt_array}));
      attack_memory = 2**(choice+1);
      if(choice == -1) {
        ns.exit();
      }
      const server_cost = server_cost_array[choice];
      if(server_cost > ns.getServerMoneyAvailable(HOME_SERVER)) {
      ns.tprint("Cannot buy server with current funds!");
      ns.tprintf("Needed funds %s", ns.formatNumber(server_cost));
      ns.exit();
      } else {
        //comment this out if you need to start with low ram
        //------------------------------------------------
        delete_smallest_server(ns);
        //------------------------------------------------
        ns.tprintf("Buying server for %s", ns.formatNumber(server_cost));
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
            "basic_hacking/weaken.js"], attack_server, HOME_SERVER);

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


function get_server_cost(ns: NS) {
    const cost_array = Array(20);
    for(let index = 0; index < 20; index++) {
      cost_array[index] = ns.getPurchasedServerCost(2**(index+1));
      }
    return cost_array;
  }

function format_dropdown_choices(ns :NS, cost_array: Array<number>) {
    const prompt_array = Array(20);
    for(let index = 0; index < 20; index++) {
      if(ns.getServerMoneyAvailable(HOME_SERVER)  >= cost_array[index]) {
        prompt_array[index] = `${index + 1} Server Cost for ${ns.formatRam(2**(index+1))} is ${ns.formatNumber(cost_array[index])}`;
      } else {
        prompt_array.splice(index, prompt_array.length-index+1);
        break;
      }
    }
    return prompt_array;
  }

//autocomplete for server 
  export function autocomplete(data: AutocompleteData) {
      return data.servers;
  }
