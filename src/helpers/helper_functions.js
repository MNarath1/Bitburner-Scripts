//libary file for helper functions that can be imported into other scripts




/** @param {import("@ns").NS} ns */
export async function run_worker(ns, scriptname, threads, target) {
    const option = {temporary: true, threads: threads};
    const pid = ns.run(scriptname, option, target);
    const port = ns.getPortHandle(pid);
    await port.nextWrite();
    if(port.peek() <= -1) {
        port.clear();
        throw new ErrorEvent("Unknown Error Script Terminated");
      }
    return port.read();
    
}


/**
 * Deletes smallest bought Server if the max server limit has been reached.
 ** @param {import("@ns").NS} ns */
export function delete_smallest_server(ns) {
    let purchaseServers = ns.getPurchasedServers();
    if(purchaseServers.length >= ns.getPurchasedServerLimit()) {
      let min_Server;
      let min_ram = 2**20;
      for(let Server of purchaseServers) {
        let temp_ram = ns.getServerMaxRam(Server);
        if(temp_ram <= min_ram) {
          min_ram = temp_ram;
          min_Server = Server;
        }
      }
      ns.tprint("Deleting smallest Server to free Space!");
      ns.tprint("Deleting " + min_Server);
      ns.killall(min_Server);
      return ns.deleteServer(min_Server);
      }
}


/** @param {import("@ns").NS} ns */
export async function break_ports(ns, target_host) {
    let current_ports = 0;
    
    if(ns.fileExists("BruteSSH.exe", "home") && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing SSH Bruteforce Attack.");
    ns.brutessh(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("FTPCrack.exe", "home") && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on FTP Port.");
    ns.ftpcrack(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("relaySMTP.exe", "home") && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on SMTP Port.");
    ns.relaysmtp(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("HTTPWorm.exe", "home") && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on HTTP Port.");
    ns.httpworm(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("SQLInject.exe", "home") && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing SQL injection attack.");
    ns.sqlinject(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }
    return current_ports;
}


/** 
 * 
 * @param {import("@ns").NS} ns 
 * @param host:String Name of Host Server
 * @param target:String Name of Destination Server
 * 
*/
export function scp_helper(ns, target) {
    ns.scp("helpers/helper_functions.js", target);
}

/** @param {import("@ns").NetscriptPort} port */
export function send_on_death(port, data) {
  port.write(data);
}


/** @param {import("@ns").NS} ns */
export async function input_server(ns) {
  let target_host = String();
  let server_exists = false;
  let server_choice_prompt = "Input Target Server!";
  while(!server_exists) {
    try {
      target_host = await ns.prompt(server_choice_prompt, {type: "text"});
      ns.hasRootAccess(target_host);
    } catch (error) {
      server_choice_prompt = `Target Server "${target_host}" doesn't exist.\nTry to input another Target Server!`;
      if(target_host == "") {
        ns.exit();
      }
      continue;
    }
    server_exists = true;
  }
  ns.tprintf("Chosen Target Server:%s", target_host);
  
  return target_host;
}