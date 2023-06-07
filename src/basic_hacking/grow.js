import { send_on_death } from "@/helper_functions/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    let grow_percent = 0;
    ns.atExit(() => {send_on_death(port, grow_percent);});
    grow_percent = await ns.grow(ns.args[0]);
}