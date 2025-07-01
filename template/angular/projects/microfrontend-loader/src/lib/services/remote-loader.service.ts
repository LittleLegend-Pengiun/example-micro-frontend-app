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
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = remoteUrl;
      script.type = 'text/javascript';
      script.async = true;

      script.onload = async () => {
        try {
          // Wait for container to be available
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const container = (window as any)[scope];
          if (!container) {
            throw new Error(`Angular container '${scope}' not found on window`);
          }

          await container.init(__webpack_share_scopes__.default);
          const factory = await container.get(module);
          const Module = factory();
          
          resolve(Module);
        } catch (error) {
          reject(error);
        }
      };

      script.onerror = () => reject(`Failed to load Angular remote: ${remoteUrl}`);
      document.head.appendChild(script);
    });
  }
}