//libary file for helper functions that can be imported into other scripts




/** @param {import("@ns").NS} ns */
export async function run_worker(ns, scriptname, threads, target) {
    const pid = ns.run(scriptname, threads, target);
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
 *  @param {import("@ns").NS} ns */
export function delete_smallest_server(ns) {
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
}


/** @param {import("@ns").NS} ns */
export async function break_ports(ns, target_host) {
    var current_ports = 0;
    
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
    ns.scp("helper_functions/helper_functions.js", target);
}