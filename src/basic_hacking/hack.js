/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    port.write(await ns.hack(ns.args[0]));
}