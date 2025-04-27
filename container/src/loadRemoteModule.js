export async function loadRemote(remoteUrl, scope, module) {
  await __webpack_init_sharing__("default");

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = remoteUrl;
    script.type = "text/javascript";
    script.async = true;

    console.log("loadRemote inside script::", script);

    script.onload = async () => {
      const container = window[scope];
      
      console.log("loadRemote inside script onload container::", container);

      if (!container) return reject(`Remote scope ${scope} not found`);
      await container.init(__webpack_share_scopes__.default);
      const factory = await container.get(module);

      console.log("loadRemote inside script onload factory::", factory);

      const Module = factory();

      console.log("loadRemote inside script onload Module::", Module);

      resolve(Module);
    };

    script.onerror = () => reject(`Failed to load remote: ${remoteUrl}`);
    document.head.appendChild(script);
  });
}
