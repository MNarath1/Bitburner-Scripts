/** @param {import("@ns").NS} ns */
export async function scp_helpers(ns, host, target) {
    for(let script of ns.ls(host,"helper_functions")) {
        ns.scp(script, target);
    }
}