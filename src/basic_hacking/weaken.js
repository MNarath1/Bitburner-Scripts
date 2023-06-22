import { send_on_death } from "@/helpers/helper_functions";

/** @param {import("@ns").NS} ns */
export async function main(ns) {
    let current_security = Array(1);
    send_on_death(ns, current_security);
    current_security[0] = await ns.weaken(ns.args[0]);
}