import { run_worker } from "@/helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const target = ns.args[0];
    // var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    // var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    const moneyThresh = ns.args[1] * 0.75;
    const securityThresh = ns.args[2] + 5;
    const mem = ns.args[3];
    let before_script_time = 0;
    while(true) {
        let elapsed_time = Date.now() - before_script_time;
        if(elapsed_time <= 1000) {
          ns.printf("WARNING: Script too fast\n Time passed: %d ms\n Sleeping...", elapsed_time);
          await ns.sleep(1000); // if the exec time is less than a second don't allow it to loop too fast to avoid game freezing
        }
        before_script_time = Date.now();
        let security_level = ns.getServerSecurityLevel(target);
        let server_money = ns.getServerMoneyAvailable(target);  
        if(security_level > securityThresh) {
            await run_worker(ns, "basic_hacking/weaken.js", Math.floor(mem/ns.args[4]), target);
            // const data = port.read() //only needed if you want to grab data otherwise clear the port or so
        } else if(server_money < moneyThresh) {
            await run_worker(ns, "basic_hacking/grow.js", Math.floor(mem/ns.args[5]), target);
        } else {
          try {
            await run_worker(ns, "basic_hacking/hack.js", Math.floor(mem/ns.args[6]), target);
          } catch (ErrorEvent) {
            ns.print("Cannot execute hack waiting....");
            await ns.sleep(1000*60);
            continue;
          }
        }
    }
}