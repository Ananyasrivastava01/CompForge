'use client';

import { useState, useEffect } from 'react';
import { X, Palette, Type, Layout, Settings } from 'lucide-react';
import { ElementData, PropertyPanelProps, PropertyTab, ColorOption, PaddingOption, BorderRadiusOption } from '@/types/propertyPanel';

export default function PropertyPanel({ 
  selectedElement, 
  onPropertyChange, 
  onClose, 
  isVisible 
}: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState<PropertyTab>('style');
  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedElement) {
      // Initialize local values from element props
      const initialValues: Record<string, string> = {};
      
      // Extract common properties
      if (selectedElement.props.backgroundColor) {
        initialValues.backgroundColor = selectedElement.props.backgroundColor;
      }
      if (selectedElement.props.textColor) {
        initialValues.textColor = selectedElement.props.textColor;
      }
      if (selectedElement.props.padding) {
        initialValues.padding = selectedElement.props.padding;
      }
      if (selectedElement.props.borderRadius) {
        initialValues.borderRadius = selectedElement.props.borderRadius;
      }
      if (selectedElement.props.text) {
        initialValues.text = selectedElement.props.text;
      }
      
      setLocalValues(initialValues);
    }
  }, [selectedElement]);

  const handlePropertyChange = (property: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [property]: value }));
    onPropertyChange(property, value);
  };

  const colorOptions: ColorOption[] = [
    { name: 'Red', value: 'bg-red-500', textValue: 'text-red-500' },
    { name: 'Blue', value: 'bg-blue-500', textValue: 'text-blue-500' },
    { name: 'Green', value: 'bg-green-500', textValue: 'text-green-500' },
    { name: 'Yellow', value: 'bg-yellow-500', textValue: 'text-yellow-500' },
    { name: 'Purple', value: 'bg-purple-500', textValue: 'text-purple-500' },
    { name: 'Pink', value: 'bg-pink-500', textValue: 'text-pink-500' },
    { name: 'Gray', value: 'bg-gray-500', textValue: 'text-gray-500' },
    { name: 'White', value: 'bg-white', textValue: 'text-white' },
    { name: 'Black', value: 'bg-black', textValue: 'text-black' },
  ];

  const paddingOptions: PaddingOption[] = [
    { name: 'None', value: 'p-0' },
    { name: 'Small', value: 'p-2' },
    { name: 'Medium', value: 'p-4' },
    { name: 'Large', value: 'p-6' },
    { name: 'Extra Large', value: 'p-8' },
  ];

  const borderRadiusOptions: BorderRadiusOption[] = [
    { name: 'None', value: 'rounded-none' },
    { name: 'Small', value: 'rounded' },
    { name: 'Medium', value: 'rounded-md' },
    { name: 'Large', value: 'rounded-lg' },
    { name: 'Full', value: 'rounded-full' },
  ];

  if (!isVisible || !selectedElement) {
    return null;
  }

  return (
    <div className="fixed right-4 top-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="text-lg font-semibold">Property Editor</h3>
          <p className="text-sm text-gray-500 capitalize">
            {selectedElement.type} Element
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'style' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Palette className="h-4 w-4" />
          Style
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'layout' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Layout className="h-4 w-4" />
          Layout
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'text' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Type className="h-4 w-4" />
          Text
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'advanced' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="h-4 w-4" />
          Advanced
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handlePropertyChange('backgroundColor', color.value)}
                    className={`h-8 rounded border-2 ${
                      localValues.backgroundColor === color.value 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    } ${color.value}`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.textValue}
                    onClick={() => handlePropertyChange('textColor', color.textValue)}
                    className={`h-8 rounded border-2 flex items-center justify-center ${
                      localValues.textColor === color.textValue 
                        ? 'border-blue-500' 
                        : 'border-gray-200'
                    } ${color.textValue}`}
                    title={color.name}
                  >
                    <span className="text-xs font-bold">T</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Padding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Padding
              </label>
              <select
                value={localValues.padding || ''}
                onChange={(e) => handlePropertyChange('padding', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {paddingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Border Radius
              </label>
              <select
                value={localValues.borderRadius || ''}
                onChange={(e) => handlePropertyChange('borderRadius', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {borderRadiusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* Text Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Content
              </label>
              <input
                type="text"
                value={localValues.text || ''}
                onChange={(e) => handlePropertyChange('text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter text content..."
              />
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={localValues.fontSize || 'text-base'}
                onChange={(e) => handlePropertyChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="text-xs">Extra Small</option>
                <option value="text-sm">Small</option>
                <option value="text-base">Base</option>
                <option value="text-lg">Large</option>
                <option value="text-xl">Extra Large</option>
                <option value="text-2xl">2XL</option>
                <option value="text-3xl">3XL</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Weight
              </label>
              <select
                value={localValues.fontWeight || 'font-normal'}
                onChange={(e) => handlePropertyChange('fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="font-light">Light</option>
                <option value="font-normal">Normal</option>
                <option value="font-medium">Medium</option>
                <option value="font-semibold">Semibold</option>
                <option value="font-bold">Bold</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-4">
            {/* Custom Classes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Classes
              </label>
              <textarea
                value={localValues.customClasses || ''}
                onChange={(e) => handlePropertyChange('customClasses', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter custom Tailwind classes..."
              />
            </div>

            {/* Element Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Element Info
              </label>
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p><strong>Type:</strong> {selectedElement.type}</p>
                <p><strong>ID:</strong> {selectedElement.elementId}</p>
                <p><strong>Current Classes:</strong> {selectedElement.className}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}