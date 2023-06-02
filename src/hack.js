/** @param {import("@ns").NS} ns */
export async function main(ns) {
    var target = ns.args[0];
    // var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    // var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    var moneyThresh = ns.args[1] * 0.75;
    var securityThresh = ns.args[2] + 5;
    while(true){
        var security_level = ns.getServerSecurityLevel(target);
        var server_money = ns.getServerMoneyAvailable(target);
        if (security_level > securityThresh) {
            await ns.weaken(target);
        } else if (server_money < moneyThresh) {
            await ns.grow(target);
        } else {
          try {
            await ns.hack(target);
          } catch (ErrorEvent) {
            ns.print("Cannot execute hack waiting....");
            await ns.sleep(1000*60);
            continue;
          }
        }
    }
}