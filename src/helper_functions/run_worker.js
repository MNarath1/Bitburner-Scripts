/** @param {import("@ns").NS} ns */
export async function run_worker(ns, scriptname, threads, target) {
    const pid = ns.run(scriptname, threads, target);
    const port = ns.getPortHandle(pid);
    await port.nextWrite();
    if(port.peek() <= -1) {
        port.clear();
        throw new ErrorEvent("Unknown Error Script Terminated");
      }
    return port.read();
    
}