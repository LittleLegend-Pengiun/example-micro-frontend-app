import { 
  Component, 
  Input, 
  ElementRef, 
  ViewChild, 
  OnInit, 
  OnDestroy, 
  AfterViewInit,
  ChangeDetectionStrategy 
} from '@angular/core';
import { RemoteLoaderService } from '../../services/remote-loader.service';

/**
 * EmbeddedMicrofrontendComponent
 * 
 * Angular component to dynamically load and mount a remote micro-frontend using Module Federation.
 * 
 * @example
 * <!-- Basic usage in a template -->
 * <app-embedded-microfrontend
 *   [remoteUrl]="'http://localhost:4202/remoteEntry.js'"
 *   [scope]="'container'"
 *   [module]="'./mount'"
 *   [type]="'module'">
 * </app-embedded-microfrontend>
 * 
 * @inputs
 * @param {string} remoteUrl - The URL to the remoteEntry.js of the micro-frontend.
 * @param {string} scope - The scope name defined in Module Federation for the remote.
 * @param {string} module - The exposed module to load from the remote.
 * @param {string} [type='text/javascript'] - The script type for loading the remote (default: 'text/javascript').
 * 
 * @description
 * This component loads a remote micro-frontend at runtime and mounts it inside the host Angular application.
 * It displays loading and error states as needed.
 * 
 * @usageNotes
 * - All inputs (`remoteUrl`, `scope`, and `module`) are required.
 * - The remote module must expose a `mount` function (and optionally an `unmount` function).
 * - The `type` input is optional and defaults to `'text/javascript'`.
 */
@Component({
  selector: 'app-embedded-microfrontend',
  template: `
    <div #mountPoint class="microfrontend-container">
      <div *ngIf="loading" class="loading-indicator">
        Loading microfrontend...
      </div>
      <div *ngIf="error" class="error-message">
        Error: {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .microfrontend-container {
      width: 100%;
      height: 100%;
    }
    
    .loading-indicator {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      color: #666;
    }
    
    .error-message {
      color: #d32f2f;
      padding: 16px;
      border: 1px solid #d32f2f;
      border-radius: 4px;
      background-color: #ffebee;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmbeddedMicrofrontendComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() remoteUrl!: string;
  @Input() scope!: string;  
  @Input() module!: string;
  @Input() type: string = 'text/javascript';

  @ViewChild('mountPoint', { static: true }) 
  mountPoint!: ElementRef<HTMLDivElement>;

  loading = false;
  error: string | null = null;
  private unmountFn?: () => void;

  constructor(private remoteLoader: RemoteLoaderService) {}

  ngOnInit(): void {
    this.validateInputs();
  }

  ngAfterViewInit(): void {
    this.loadAndMountMicrofrontend();
  }

  ngOnDestroy(): void {
    this.unmountMicrofrontend();
  }

  private validateInputs(): void {
    if (!this.remoteUrl || !this.scope || !this.module) {
      this.error = 'remoteUrl, scope, and module are required inputs';
      return;
    }
  }

  private async loadAndMountMicrofrontend(): Promise<void> {
    if (this.error) return;

    try {
      this.loading = true;
      this.error = null;

      console.log('Loading microfrontend:', { 
        remoteUrl: this.remoteUrl, 
        scope: this.scope, 
        module: this.module 
      });

      const remote = await this.remoteLoader.loadRemote(
        this.remoteUrl, 
        this.scope, 
        this.module, 
        this.type
      );

      console.log('Loaded remote:', remote);

      if (remote && typeof remote.mount === 'function') {
        // Clear any existing content
        this.mountPoint.nativeElement.innerHTML = '';
        
        // Mount the microfrontend
        await remote.mount(this.mountPoint.nativeElement);
        
        // Store unmount function if available
        this.unmountFn = remote.unmount;
        
        console.log('Microfrontend mounted successfully');
      } else {
        throw new Error('Remote module does not expose a mount function');
      }

    } catch (err) {
      console.error('Failed to load microfrontend:', err);
      this.error = err instanceof Error ? err.message : 'Unknown error occurred';
    } finally {
      this.loading = false;
    }
  }

  private unmountMicrofrontend(): void {
    try {
      // Call unmount function if available
      if (this.unmountFn && typeof this.unmountFn === 'function') {
        this.unmountFn();
      }
      
      // Clear the mount point
      if (this.mountPoint?.nativeElement) {
        this.mountPoint.nativeElement.innerHTML = '';
      }
      
      console.log('Microfrontend unmounted');
    } catch (err) {
      console.error('Error during unmount:', err);
    }
  }

  // Public method to reload the microfrontend
  reload(): void {
    this.unmountMicrofrontend();
    this.loadAndMountMicrofrontend();
  }
}