/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const target_host = ns.args[0];
    const attack_server = ns.getHostname();
  
    ns.tprint("Starting Attack on Target Server!");

    if(!ns.hasRootAccess(target_host)) {
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
      ns.tprint("Root Priviliges Required.");
      if(ns.getServerNumPortsRequired(target_host) <= current_ports){
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
  
    const mem = (ns.getServerMaxRam(attack_server)
                - ns.getServerUsedRam(attack_server)
                - ns.getScriptRam("basic_hacking/hacking_controller.js")
                - ns.getScriptRam("initial.js"));
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