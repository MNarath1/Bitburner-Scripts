import { send_on_death } from "@/helpers/helper_functions";
import { NS } from '@ns';

export async function main(ns: NS) {
    const hack_money = Array(1);
    send_on_death(ns, hack_money);
    try {
        hack_money[0] = await ns.hack(<string>ns.args[0]);
    } catch (ErrorEvent) {
        hack_money[0] = -1; //So that we signal that the script still did die
    }
}