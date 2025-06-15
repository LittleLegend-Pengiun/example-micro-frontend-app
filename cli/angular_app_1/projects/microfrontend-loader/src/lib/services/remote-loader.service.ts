import { Injectable } from '@angular/core';

declare global {
  const __webpack_init_sharing__: (scope: string) => Promise<void>;
  const __webpack_share_scopes__: { default: any };
}

@Injectable({
  providedIn: 'root'
})
export class RemoteLoaderService {

  async loadRemote(
    remoteUrl: string, 
    scope: string, 
    module: string, 
    type: string = 'text/javascript'
  ): Promise<any> {
    await __webpack_init_sharing__('default');

    // Check if this is an Angular microfrontend
    if (type === 'module' || remoteUrl.includes('angular') || scope === 'angular') {
      return this.loadAngularRemote(remoteUrl, scope, module);
    }

    // Original logic for React/Vue microfrontends
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = remoteUrl;
      script.type = type;
      script.async = true;

      console.log('loadRemote inside script::', script);

      script.onload = async () => {
        console.log(window);
        const container = (window as any)[scope];

        if (!container) {
          return reject(`Remote scope ${scope} not found`);
        }
        
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get(module);
        const Module = factory();

        resolve(Module);
      };

      script.onerror = () => reject(`Failed to load remote: ${remoteUrl}`);
      document.head.appendChild(script);
    });
  }

  private async loadAngularRemote(remoteUrl: string, scope: string, module: string): Promise<any> {
    try {
      // Use dynamic import for ES modules
      const container = await import(/* webpackIgnore: true */ remoteUrl);
      console.log("container::", container);

      // Initialize the container with shared scope
      await container.init(__webpack_share_scopes__.default);

      // Get the specific module (e.g., "./mount")
      const factory = await container.get(module);
      const Module = factory();

      return Module;
    } catch (error: any) {
      throw new Error(`Failed to load Angular remote: ${error.message}`);
    }
  }
}