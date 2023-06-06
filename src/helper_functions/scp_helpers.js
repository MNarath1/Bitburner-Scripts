/** 
 * 
 * @param {import("@ns").NS} ns 
 * @param host:String Name of Host Server
 * @param target:String Name of Destination Server
 * 
*/
export function scp_helpers(ns, host, target) {
    for(let script of ns.ls(host,"helper_functions")) {
        ns.scp(script, target);
    }
}