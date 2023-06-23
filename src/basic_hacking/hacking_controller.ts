import { run_worker } from "@/helpers/helper_functions";
import { NS } from '@ns';

export async function main(ns: NS) {
    const target = <string>ns.args[0];
    const moneyThresh = <number>ns.args[1] * 0.75;
    const securityThresh = <number>ns.args[2] + 5;
    const mem = <number>ns.args[3];
    let before_script_time = 0;
    ns.disableLog("asleep");
    while(true) {
        const elapsed_time = Date.now() - before_script_time;
        if(elapsed_time <= 1000) {
          ns.printf("WARNING: Script too fast\n Time passed: %d ms\n Sleeping...", elapsed_time);
          await ns.asleep(1000); // if the exec time is less than a second don't allow it to loop too fast to avoid game freezing
        }
        before_script_time = Date.now();
        const security_level = ns.getServerSecurityLevel(target);
        const server_money = ns.getServerMoneyAvailable(target);  
        if(security_level > securityThresh) {
            await run_worker(ns, "basic_hacking/weaken.js", Math.floor(mem/<number>ns.args[4]), target);
        } else if(server_money < moneyThresh) {
            await run_worker(ns, "basic_hacking/grow.js", Math.floor(mem/<number>ns.args[5]), target);
        } else {
          try {
            await run_worker(ns, "basic_hacking/hack.js", Math.floor(mem/<number>ns.args[6]), target);
          } catch (ErrorEvent) {
            ns.print("Cannot execute hack waiting....");
            await ns.asleep(1000*60);
            continue;
          }
        }
    }
}