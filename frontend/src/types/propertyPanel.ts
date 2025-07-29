export interface ElementData {
  type: string;
  props: Record<string, any>;
  className: string;
  text: string;
  elementId: string;
}

export interface PropertyPanelProps {
  selectedElement: ElementData | null;
  onPropertyChange: (property: string, value: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

export type PropertyTab = 'style' | 'layout' | 'text' | 'advanced';

export interface ColorOption {
  name: string;
  value: string;
  textValue: string;
}

export interface PaddingOption {
  name: string;
  value: string;
}

export interface BorderRadiusOption {
  name: string;
  value: string;
}