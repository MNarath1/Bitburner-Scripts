import { send_on_death } from "@/helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    let hack_money = Array(1);
    send_on_death(ns, hack_money);
    try {
        hack_money[0] = await ns.hack(ns.args[0]);
    } catch (ErrorEvent) {
        hack_money[0] = -1; //So that we signal that the script still did die
    }
}