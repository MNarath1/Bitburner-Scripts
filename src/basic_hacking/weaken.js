/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    port.write(await ns.weaken(ns.args[0]));
}