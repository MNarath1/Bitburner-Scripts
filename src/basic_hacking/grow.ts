import { send_on_death } from "@/helpers/helper_functions";
import { NS } from '@ns';

export async function main(ns: NS) {
    const grow_percent = Array(1);
    send_on_death(ns, grow_percent);
    grow_percent[0] = await ns.grow(<string>ns.args[0]);
}