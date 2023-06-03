/** @param {import("@ns").NS} ns */
export async function main(ns) {
    const port = ns.getPortHandle(ns.pid);
    try {
        var hack_money = await ns.hack(ns.args[0]);
        port.write(hack_money);
    } catch (ErrorEvent) {
        port.write(-1); //So that we signal that the script still did die
    }
}