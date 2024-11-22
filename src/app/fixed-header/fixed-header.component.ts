import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';

@Component({
  selector: 'app-fixed-header',
  templateUrl: './fixed-header.component.html',
  styleUrls: ['./fixed-header.component.css']
})
export class FixedHeaderComponent {
  @ViewChild('componentsContainer', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private resolver: ComponentFactoryResolver) {}

  addComponent() {
    const factory = this.resolver.resolveComponentFactory(DynamicContentComponent);
    const componentRef = this.container.createComponent(factory);
    componentRef.instance.remove.subscribe(() => {
      this.container.remove(this.container.indexOf(componentRef.hostView));
    });
  }

  saveData() {
    alert('Datos guardados correctamente');
  }
}