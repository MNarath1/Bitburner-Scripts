import { send_on_death } from "@/helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    let grow_percent = Array(1);
    send_on_death(ns, grow_percent);
    grow_percent[0] = await ns.grow(ns.args[0]);
}