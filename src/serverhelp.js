/** @param {import("@ns").NS} ns */
export async function main(ns) {
  var attack_server = ns.args[0];
  var target_host = ns.args[1];
  var threads = Math.floor((ns.getServerMaxRam(attack_server)-ns.getServerUsedRam(attack_server))/ns.getScriptRam("hack.js","home"));
  ns.scp("hack.js", attack_server, "home");
  ns.exec("hack.js",attack_server, threads,
  target_host, 
  ns.getServerMaxMoney(target_host), 
  ns.getServerMinSecurityLevel(target_host));
}