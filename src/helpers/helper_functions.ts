//libary file for helper functions that can be imported into other scripts

import { HOME_SERVER, scp_functions, scp_helper_libary } from "./helper_vars";
import { NS } from '@ns';

/**
 * 
 * @param ns 
 * @param scriptname Name of the Worker Skript you want to execute
 * @param threads Thread Number of Worker Script
 * @param args Additional Arguments to be passed to the Worker Script
 * @returns Passes the Data Read from the Worker Port to upwards
 */
export async function run_worker(ns: NS, scriptname: string, threads: number, ...args: any[]) {
    const option = {temporary: true, threads: threads};
    const pid = ns.run(scriptname, option, ...args);
    const port = ns.getPortHandle(pid);
    void get_worker_log(ns, scriptname, ...args);
    await port.nextWrite();
    if(<number>port.peek() <= -1) {
        port.clear();
        throw new ErrorEvent("Unknown Error Script Terminated");
      }
    return port.read();
    
}

export async function get_worker_log(ns: NS, scriptname: string, ...args: any[]): Promise<void> {
  await ns.asleep(1);
  ns.print(ns.getScriptLogs(scriptname, undefined, ...args)[0]?.split("] ")[1]); //passes the logs on to the logs of the controller we split the string to avoid passing the log time on as well
}


/**
 * Deletes smallest bought Server if the max server limit has been reached.*/

export function delete_smallest_server(ns: NS) {
    const purchaseServers = ns.getPurchasedServers();
    if(purchaseServers.length >= ns.getPurchasedServerLimit()) {
      let min_Server = "";
      let min_ram = 2**20;
      for(const Server of purchaseServers) {
        const temp_ram = ns.getServerMaxRam(Server);
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


export async function break_ports(ns: NS, target_host: string) {
    let current_ports = 0;
    
    if(ns.fileExists("BruteSSH.exe", HOME_SERVER) && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing SSH Bruteforce Attack.");
    ns.brutessh(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("FTPCrack.exe", HOME_SERVER) && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on FTP Port.");
    ns.ftpcrack(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("relaySMTP.exe", HOME_SERVER) && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on SMTP Port.");
    ns.relaysmtp(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("HTTPWorm.exe", HOME_SERVER) && ns.getServerNumPortsRequired(target_host) > current_ports) {
    ns.tprint("Executing attack on HTTP Port.");
    ns.httpworm(target_host);
    current_ports++;
    await ns.sleep(1000);
    ns.tprint("Success!");
    }

    if(ns.fileExists("SQLInject.exe", HOME_SERVER) && ns.getServerNumPortsRequired(target_host) > current_ports) {
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
 * @param target:String Name of Destination Server
 * 
*/
export function scp_important_files(ns: NS, target: string) {
    ns.scp(scp_functions.concat(scp_helper_libary), target, HOME_SERVER);
}

/**
 * Function to send Data from the worker back to the controller once the worker dies (supports only 1 data entry for now)
 * Data has to be input as a Array of size 1 so that the data can be modified after the array got passed to the script
 * @param ns 
 * @param data Array of size 1 for data (has to be array so we can pass it on and modify it after the fact)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function send_on_death(ns: NS, data: any[]) {
  const port = ns.getPortHandle(ns.pid);
  ns.atExit(() => {port.write(data[0]);});
}


export async function input_server(ns: NS) {
  let target_host = String();
  let server_exists = false;
  let server_choice_prompt = "Input Target Server!";
  while(!server_exists) {
    try {
      target_host = <string> await ns.prompt(server_choice_prompt, {type: "text"});
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