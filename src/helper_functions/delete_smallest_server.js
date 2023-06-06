/**
 * Deletes smallest bought Server if the max server limit has been reached.
 *  @param {import("@ns").NS} ns */
export function delete_smallest_server(ns) {
    var purchaseServers = ns.getPurchasedServers();
    if(purchaseServers >= ns.getPurchasedServerLimit()) {
      var min_Server;
      var min_ram = 2**20;
      for(let Server of purchaseServers) {
        var temp_ram = ns.getServerMaxRam(Server);
        if(temp_ram <= min_ram) {
          min_ram = temp_ram;
          min_Server = Server;
        }
      }
      ns.tprint("Deleting smallest Server to free Space!")
      ns.deleteServer(min_Server);
      }
}