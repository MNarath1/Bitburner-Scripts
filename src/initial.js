/** @param {import("@ns").NS} ns */
export async function main(ns) {
    var target_host = ns.args[0];
    var attack_memory = ns.args[1];
  
    ns.tprint("Starting Attack on Target Server!");
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
  
    if(!ns.hasRootAccess(target_host)) {
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
  
      if(ns.getPurchasedServerCost(attack_memory) > ns.getServerMoneyAvailable("home")) {
      ns.tprint("Cannot buy server with current funds!");
      return;
    }
  
    var attack_server = ns.purchaseServer(target_host + "_attack_server", 
    attack_memory);
  
    var threads = Math.floor((ns.getServerMaxRam(attack_server)-ns.getServerUsedRam(attack_server))/ns.getScriptRam("hack.js","home"));
    ns.scp("hack.js", attack_server, "home");
    ns.exec("hack.js",attack_server, threads,
    target_host, 
    ns.getServerMaxMoney(target_host), 
    ns.getServerMinSecurityLevel(target_host));
    
  }