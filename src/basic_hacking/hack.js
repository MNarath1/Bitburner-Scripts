import { send_on_death } from "@/helper_functions/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    let hack_money = 0;
    ns.atExit(() => {send_on_death(port, hack_money);});
    try {
        hack_money = await ns.hack(ns.args[0]);
    } catch (ErrorEvent) {
        hack_money = -1; //So that we signal that the script still did die
    }
}