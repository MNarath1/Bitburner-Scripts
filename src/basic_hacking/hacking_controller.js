/** @param {import("@ns").NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    // var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    // var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    var moneyThresh = ns.args[1] * 0.75;
    var securityThresh = ns.args[2] + 5;
    var mem = ns.args[3];
    while(true){
        ns.killall(ns.getHostname(),true);
        var security_level = ns.getServerSecurityLevel(target);
        var server_money = ns.getServerMoneyAvailable(target);  
        if (security_level > securityThresh) {
            const pid = ns.run("basic_hacking/weaken.js", Math.floor(mem/ns.args[4]), target);
            const port = ns.getPortHandle(pid);
            await port.nextWrite();
            port.clear();
            // const data = port.read() //only needed if you want to grab data otherwise clear the port or so
        } else if (server_money < moneyThresh) {
            const pid = ns.run("basic_hacking/grow.js", Math.floor(mem/ns.args[5]), target);
            const port = ns.getPortHandle(pid);
            await port.nextWrite();
            port.clear();
        } else {
          try {
            const pid = ns.run("basic_hacking/hack.js", Math.floor(mem/ns.args[6]), target);
            const port = ns.getPortHandle(pid);
            await port.nextWrite();
            if(port.read() <= -1) {
              port.clear();
              throw ErrorEvent;
            }
            port.clear();
          } catch (ErrorEvent) {
            ns.print("Cannot execute hack waiting....");
            await ns.sleep(1000*60);
            continue;
          }
        }
    }
}