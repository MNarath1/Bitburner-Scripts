import { send_on_death } from "@/helpers/helper_functions";
import { NS } from '@ns';

export async function main(ns: NS) {
    const current_security = Array(1);
    send_on_death(ns, current_security);
    current_security[0] = await ns.weaken(<string>ns.args[0]);
}