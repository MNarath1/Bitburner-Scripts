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