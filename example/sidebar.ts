import { PointCloudOctree, PointColorType, PointShape } from "../src";

export class Sidebar {

  private targetEl: HTMLElement | undefined;

  sidebar!: HTMLElement;
  container!: HTMLElement;
  targetPointcloud!: PointCloudOctree;

    initialize(targetEl: HTMLElement): void {
      if (this.targetEl || !targetEl) {
        return;
      }
  
      this.targetEl = targetEl;
    
      // Create sidebar
      this.sidebar = document.createElement('div');
      this.sidebar.className = 'sidebar';
      this.sidebar.id = 'sidebar';
      targetEl.appendChild(this.sidebar);

      this.container = document.createElement('div');
      this.container.className = 'containerSidebar';
      this.container.id = 'container';
      this.sidebar.appendChild(this.container);

      const opacitySlider = this.createSlider("Opacity", (num) => this.changeOpacity(num), 100);
      this.container.appendChild(opacitySlider);
    
      const pointSizeSlider = this.createSlider("Point Size", (num) => this.changePointSize(num), 1);
      this.container.appendChild(pointSizeSlider);
        
      const dropdown = this.createDropDown();
      this.container.appendChild(dropdown);

      const elevationSlider = this.createSlider("Show Elevation", (num) => this.changeElevationGradient(num), 0);
      this.container.appendChild(elevationSlider);
    } 

    setTargetPointcloud(pcloud: PointCloudOctree):void{
        this.targetPointcloud = pcloud;
        this.toggleSidebar();
    }

    createButton(text: string, onClick: () => void): HTMLButtonElement {
        const button: HTMLButtonElement = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    }

    createDropDown() : HTMLElement{
        const dropdownDiv = document.createElement('div');
        dropdownDiv.className = 'dropdown';
        const dropdownLabel = document.createElement('label');
        dropdownLabel.setAttribute('for', 'dropdown');
        dropdownLabel.textContent = 'Point Shape:';
        dropdownDiv.appendChild(dropdownLabel);
        const dropdownSelect = document.createElement('select');
        dropdownSelect.id = 'dropdown';
        for (let shape in PointShape) {
            if (isNaN(Number(shape))) {
                const option = document.createElement('option');
                option.value = shape.toLowerCase().replace(' ', '');
                option.textContent = shape;
                dropdownSelect.appendChild(option);
            }
        }
        dropdownSelect.addEventListener('change', (event) => {
            if (!event.target) {
                return;
            }
            if (!this.targetPointcloud) {
                return;
            }
            const target = event.target as HTMLSelectElement;
            this.targetPointcloud.material.shape = target.selectedIndex;
        });
        dropdownDiv.appendChild(dropdownSelect);
        this.sidebar.appendChild(dropdownDiv);
        return dropdownDiv;
    }
    
    createSlider(label: string, onChanged: (inte: number) => void, defVal: number = -1): HTMLDivElement {
        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'slider';

        const slider: HTMLInputElement = document.createElement('input');
        const sliderLabel = document.createElement('label');
        sliderLabel.className = 'slider-label';
        // sliderLabel.setAttribute('for', 'label');
        sliderLabel.textContent = label;
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        if(defVal != -1)
        {
            slider.value = defVal.toString();
        }
        slider.className = 'opacity-slider';
        sliderDiv.appendChild(sliderLabel);
        sliderDiv.appendChild(slider);

        slider.addEventListener('change', () => {
            onChanged(parseFloat(slider.value)/100);
        });
        return sliderDiv;
    }

    changeOpacity(sliderValue: number):void{
        if (!this.targetPointcloud) {
            return;
        }
        this.targetPointcloud.material.opacity = sliderValue;
    }

    changePointSize(sliderValue: number):void{
        if (!this.targetPointcloud) {
            return;
        }
        this.targetPointcloud.material.size = sliderValue * (this.targetPointcloud.material.maxSize/2);
    }

    changeElevationGradient(sliderValue: number):void{
        if (!this.targetPointcloud) {
            return;
        }
        this.targetPointcloud.material.pointColorType = PointColorType.RGB_HEIGHT;
        this.targetPointcloud.material.transition = sliderValue;
    }

    toggleSidebar(): void {
        this.sidebar.classList.toggle('expanded');
    }
    
}
