import { send_on_death } from "@/helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    let current_security = 0;
    ns.atExit(() => {send_on_death(port, current_security);});
    current_security = await ns.weaken(ns.args[0]);
}