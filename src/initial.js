import { break_ports, delete_smallest_server, scp_helper } from "./helper_functions/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    let target_host = null; 
    let attack_memory;
    let has_root;
    let server_exists = false;
    let server_choice_prompt = "Input Target Server!";
    while(!server_exists) {
      try {
        target_host = await ns.prompt(server_choice_prompt, {type: "text"});
        has_root = ns.hasRootAccess(target_host);
      } catch (error) {
        server_choice_prompt = "Target Server doesn't exist.\nTry to input another Target Server!";
        if(target_host == "") {
          ns.exit();
        }
        target_host = null;
        continue;
      }
      server_exists = true;
    }
    ns.tprintf("Chosen Target Server:%s", target_host);

    const server_cost_array = get_server_cost(ns);
    const prompt_array = format_dropdown_choices(ns, server_cost_array);

    ns.tprint("Starting Attack on Target Server!");
    if(!has_root) {
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
      let choice = prompt_array.indexOf(await ns.prompt("Select Ram for Server.", {type : "select", choices: prompt_array}));
      attack_memory = 2**(choice+1);
      const server_cost = server_cost_array[choice];
      if(server_cost > ns.getServerMoneyAvailable("home")) {
      ns.tprint("Cannot buy server with current funds!");
      ns.tprintf("Needed funds %s", ns.formatNumber(server_cost));
      return;
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


/** @param {import("@ns").NS} ns */
function get_server_cost(ns) {
    let cost_array = Array(20);
    for(let index = 0; index < 20; index++) {
      cost_array[index] = ns.getPurchasedServerCost(2**(index+1));
      }
    return cost_array;
    }


/** @param {import("@ns").NS} ns */
function format_dropdown_choices(ns, cost_array) {
    let prompt_array = Array(20);
    for(let index = 0; index < 20; index++) {
      prompt_array[index] = `${index} Server Cost for ${ns.formatRam(2**(index+1))} is ${ns.formatNumber(cost_array[index])}`;
      }
    return prompt_array;
    }