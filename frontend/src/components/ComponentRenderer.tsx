'use client';

import { useEffect, useState } from 'react';

interface ComponentRendererProps {
  component: {
    jsxCode: string;
    cssCode: string;
  };
  onElementClick?: (element: {
    type: string;
    props: Record<string, any>;
    className: string;
    text: string;
    elementId: string;
  }) => void;
  selectedElementId?: string;
}

export default function ComponentRenderer({ 
  component, 
  onElementClick,
  selectedElementId 
}: ComponentRendererProps) {
  const [renderedComponent, setRenderedComponent] = useState<React.ReactElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!component.jsxCode) {
      setRenderedComponent(null);
      setError(null);
      return;
    }

    try {
      // Extract the component name and props from the JSX code
      const componentName = extractComponentName(component.jsxCode);
      const props = extractDefaultProps(component.jsxCode);
      
      // Parse the actual JSX code to extract real classes and properties
      const parsedClasses = parseJSXClasses(component.jsxCode);
      const parsedText = extractTextContent(component.jsxCode);
      
      console.log('ComponentRenderer: JSX Code:', component.jsxCode.substring(0, 200));
      console.log('ComponentRenderer: Parsed classes:', parsedClasses);
      console.log('ComponentRenderer: Parsed text:', parsedText);
      
      // Create a simple component based on the extracted info
      const SimpleComponent = () => {
        const [clickCount, setClickCount] = useState(0);
        
        const handleClick = (e: React.MouseEvent, elementType: string, elementProps: any) => {
          e.stopPropagation();
          setClickCount(prev => prev + 1);
          
          // Extract element information for property panel
          const element = e.currentTarget as HTMLElement;
          const className = element.className;
          const text = element.textContent || '';
          const elementId = `${elementType}-${Date.now()}`;
          
          // Add data attribute for identification
          element.setAttribute('data-element-id', elementId);
          
          onElementClick?.({
            type: elementType,
            props: elementProps,
            className,
            text,
            elementId
          });
        };

        // Apply the CSS if provided
        if (component.cssCode) {
          const style = document.createElement('style');
          style.textContent = component.cssCode;
          document.head.appendChild(style);
        }

        // Create a simple render based on common patterns
        if (componentName.toLowerCase().includes('button')) {
          // Use parsed classes from the actual JSX code
          const buttonClasses = parsedClasses.button || "bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 transition duration-200";
          // Extract button text more intelligently
          let buttonText = parsedText.button || props.label || 'Click me!';
          
          // If the text contains JSX expressions, provide a default
          if (buttonText.includes('{') || buttonText.includes('}')) {
            buttonText = 'Click me!';
          }
          
          const isSelected = selectedElementId === 'button-1';
          
          console.log('ComponentRenderer: Rendering button with classes:', buttonClasses);
          console.log('ComponentRenderer: Button text:', buttonText);
          
          return (
            <button
              className={`${buttonClasses} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={(e) => handleClick(e, 'button', { 
                className: buttonClasses,
                text: buttonText,
                backgroundColor: extractBackgroundColor(buttonClasses),
                textColor: extractTextColor(buttonClasses),
                padding: extractPadding(buttonClasses),
                borderRadius: extractBorderRadius(buttonClasses)
              })}
              data-element-id="button-1"
            >
              {buttonText} {clickCount > 0 && `(${clickCount})`}
            </button>
          );
        }

        if (componentName.toLowerCase().includes('card')) {
          const cardClasses = parsedClasses.card || "max-w-sm rounded overflow-hidden shadow-lg bg-white";
          const cardTitle = parsedText.title || props.title || 'Card Title';
          const cardDescription = parsedText.description || props.description || 'This is a sample card component.';
          
          const isSelected = selectedElementId === 'card-1';
          
          return (
            <div 
              className={`${cardClasses} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={(e) => handleClick(e, 'card', {
                className: cardClasses,
                title: cardTitle,
                description: cardDescription,
                backgroundColor: extractBackgroundColor(cardClasses),
                borderRadius: extractBorderRadius(cardClasses),
                shadow: extractShadow(cardClasses)
              })}
              data-element-id="card-1"
            >
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{cardTitle}</div>
                <p className="text-gray-700 text-base">
                  {cardDescription}
                </p>
              </div>
            </div>
          );
        }

        if (componentName.toLowerCase().includes('input') || componentName.toLowerCase().includes('form')) {
          const formClasses = parsedClasses.form || "space-y-4";
          const inputClasses = parsedClasses.input || "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
          const buttonClasses = parsedClasses.button || "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200";
          
          const isSelected = selectedElementId === 'form-1';
          
          return (
            <div 
              className={`${formClasses} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 p-2 rounded' : ''}`}
              onClick={(e) => handleClick(e, 'form', {
                className: formClasses,
                backgroundColor: 'bg-transparent',
                spacing: 'space-y-4'
              })}
              data-element-id="form-1"
            >
              <input
                type="text"
                placeholder="Enter text..."
                className={inputClasses}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e, 'input', {
                    className: inputClasses,
                    placeholder: 'Enter text...',
                    borderColor: extractBorderColor(inputClasses),
                    padding: extractPadding(inputClasses),
                    borderRadius: extractBorderRadius(inputClasses)
                  });
                }}
                data-element-id="input-1"
              />
              <button
                className={buttonClasses}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e, 'button', {
                    className: buttonClasses,
                    backgroundColor: extractBackgroundColor(buttonClasses),
                    textColor: extractTextColor(buttonClasses),
                    padding: extractPadding(buttonClasses),
                    borderRadius: extractBorderRadius(buttonClasses)
                  });
                }}
                data-element-id="button-2"
              >
                Submit
              </button>
            </div>
          );
        }

        if (componentName.toLowerCase().includes('nav') || componentName.toLowerCase().includes('header')) {
          const navClasses = parsedClasses.nav || "bg-gray-800 text-white p-4";
          
          const isSelected = selectedElementId === 'nav-1';
          
          return (
            <nav 
              className={`${navClasses} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
              onClick={(e) => handleClick(e, 'nav', {
                className: navClasses,
                backgroundColor: extractBackgroundColor(navClasses),
                textColor: extractTextColor(navClasses),
                padding: extractPadding(navClasses)
              })}
              data-element-id="nav-1"
            >
              <div className="flex items-center justify-between">
                <div className="text-xl font-bold">Logo</div>
                <div className="space-x-4">
                  <a href="#" className="hover:text-gray-300">Home</a>
                  <a href="#" className="hover:text-gray-300">About</a>
                  <a href="#" className="hover:text-gray-300">Contact</a>
                </div>
              </div>
            </nav>
          );
        }

        // Default fallback
        const defaultClasses = parsedClasses.div || "text-center p-4";
        const defaultText = parsedText.div || `${componentName} component rendered successfully!`;
        
        const isSelected = selectedElementId === 'component-1';
        
        return (
          <div 
            className={`${defaultClasses} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : ''}`}
            onClick={(e) => handleClick(e, 'div', {
              className: defaultClasses,
              backgroundColor: extractBackgroundColor(defaultClasses),
              padding: extractPadding(defaultClasses),
              textAlign: 'text-center'
            })}
            data-element-id="component-1"
          >
            <div className="text-lg font-semibold mb-2">Component Preview</div>
            <div className="text-sm text-gray-600">
              {defaultText}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e, 'button', {
                  className: 'mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600',
                  backgroundColor: 'bg-blue-500',
                  textColor: 'text-white',
                  padding: 'px-4 py-2',
                  borderRadius: 'rounded'
                });
              }}
              data-element-id="button-3"
            >
              Test Interaction ({clickCount})
            </button>
          </div>
        );
      };

      setRenderedComponent(<SimpleComponent />);
      setError(null);
    } catch (err) {
      console.error('ComponentRenderer error:', err);
      setError('Failed to render component');
      setRenderedComponent(null);
    }
  }, [component.jsxCode, component.cssCode, selectedElementId, onElementClick]);

  const extractComponentName = (jsxCode: string): string => {
    // Try to extract component name from export default
    const exportMatch = jsxCode.match(/export\s+default\s+(\w+)/);
    if (exportMatch) return exportMatch[1];

    // Try to extract from const declaration
    const constMatch = jsxCode.match(/const\s+(\w+)\s*:/);
    if (constMatch) return constMatch[1];

    // Try to extract from function declaration
    const funcMatch = jsxCode.match(/function\s+(\w+)/);
    if (funcMatch) return funcMatch[1];

    return 'Component';
  };

  const extractDefaultProps = (jsxCode: string): Record<string, any> => {
    const props: Record<string, any> = {};
    
    // Extract common props
    if (jsxCode.includes('label')) props.label = 'Sample Label';
    if (jsxCode.includes('title')) props.title = 'Sample Title';
    if (jsxCode.includes('description')) props.description = 'Sample description text';
    if (jsxCode.includes('onClick')) props.onClick = () => {};
    
    return props;
  };

  const parseJSXClasses = (jsxCode: string): Record<string, string> => {
    const classes: Record<string, string> = {};
    
    console.log('Parsing JSX code:', jsxCode.substring(0, 200) + '...');
    
    // Extract className from button elements - more robust pattern
    const buttonMatches = jsxCode.match(/<button[^>]*className="([^"]+)"[^>]*>/g);
    if (buttonMatches && buttonMatches.length > 0) {
      const buttonClassMatch = buttonMatches[0].match(/className="([^"]+)"/);
      if (buttonClassMatch) {
        classes.button = buttonClassMatch[1];
        console.log('Found button classes:', classes.button);
      }
    }
    
    // Also try to match className with template literals or complex expressions
    const buttonTemplateMatch = jsxCode.match(/<button[^>]*className=\{`([^`]+)`\}[^>]*>/g);
    if (buttonTemplateMatch && buttonTemplateMatch.length > 0) {
      const buttonClassMatch = buttonTemplateMatch[0].match(/className=\{`([^`]+)`\}/);
      if (buttonClassMatch) {
        classes.button = buttonClassMatch[1];
        console.log('Found button classes (template):', classes.button);
      }
    }
    
    // Extract className from div elements - more robust pattern
    const divMatches = jsxCode.match(/<div[^>]*className="([^"]+)"[^>]*>/g);
    if (divMatches && divMatches.length > 0) {
      const divClassMatch = divMatches[0].match(/className="([^"]+)"/);
      if (divClassMatch) {
        classes.div = divClassMatch[1];
        console.log('Found div classes:', classes.div);
      }
    }
    
    // Extract className from input elements
    const inputMatches = jsxCode.match(/<input[^>]*className="([^"]+)"[^>]*>/g);
    if (inputMatches && inputMatches.length > 0) {
      const inputClassMatch = inputMatches[0].match(/className="([^"]+)"/);
      if (inputClassMatch) {
        classes.input = inputClassMatch[1];
        console.log('Found input classes:', classes.input);
      }
    }
    
    // Extract className from nav elements
    const navMatches = jsxCode.match(/<nav[^>]*className="([^"]+)"[^>]*>/g);
    if (navMatches && navMatches.length > 0) {
      const navClassMatch = navMatches[0].match(/className="([^"]+)"/);
      if (navClassMatch) {
        classes.nav = navClassMatch[1];
        console.log('Found nav classes:', classes.nav);
      }
    }
    
    // Extract className from card-like divs (divs containing "card" in className)
    const cardMatches = jsxCode.match(/<div[^>]*className="[^"]*card[^"]*"[^>]*>/g);
    if (cardMatches && cardMatches.length > 0) {
      const cardClassMatch = cardMatches[0].match(/className="([^"]+)"/);
      if (cardClassMatch) {
        classes.card = cardClassMatch[1];
        console.log('Found card classes:', classes.card);
      }
    }
    
    // Extract className from form-like divs (divs containing "form" in className)
    const formMatches = jsxCode.match(/<div[^>]*className="[^"]*form[^"]*"[^>]*>/g);
    if (formMatches && formMatches.length > 0) {
      const formClassMatch = formMatches[0].match(/className="([^"]+)"/);
      if (formClassMatch) {
        classes.form = formClassMatch[1];
        console.log('Found form classes:', classes.form);
      }
    }
    
    console.log('Final parsed classes:', classes);
    return classes;
  };

  const extractTextContent = (jsxCode: string): Record<string, string> => {
    const text: Record<string, string> = {};
    
    // Extract text from button elements - handle both plain text and JSX expressions
    const buttonTextMatch = jsxCode.match(/<button[^>]*>([^<]+)<\/button>/);
    if (buttonTextMatch) {
      text.button = buttonTextMatch[1].trim();
    }
    
    // Also try to match button text with JSX expressions like {label}
    const buttonExpressionMatch = jsxCode.match(/<button[^>]*>\{([^}]+)\}<\/button>/);
    if (buttonExpressionMatch) {
      const expression = buttonExpressionMatch[1].trim();
      // Convert common expressions to readable text
      if (expression === 'label') {
        text.button = 'Click me!';
      } else if (expression === 'children') {
        text.button = 'Button';
      } else {
        text.button = expression;
      }
    }
    
    // Extract text from div elements
    const divTextMatch = jsxCode.match(/<div[^>]*>([^<]+)<\/div>/);
    if (divTextMatch) text.div = divTextMatch[1].trim();
    
    // Extract title and description from card-like structures
    const titleMatch = jsxCode.match(/<div[^>]*font-bold[^>]*>([^<]+)<\/div>/);
    if (titleMatch) text.title = titleMatch[1].trim();
    
    const descriptionMatch = jsxCode.match(/<p[^>]*>([^<]+)<\/p>/);
    if (descriptionMatch) text.description = descriptionMatch[1].trim();
    
    return text;
  };

  const extractBackgroundColor = (className: string): string => {
    const bgMatch = className.match(/bg-\w+(-\d+)?/);
    return bgMatch ? bgMatch[0] : 'bg-transparent';
  };

  const extractTextColor = (className: string): string => {
    const textMatch = className.match(/text-\w+(-\d+)?/);
    return textMatch ? textMatch[0] : 'text-black';
  };

  const extractPadding = (className: string): string => {
    const paddingMatch = className.match(/p-\d+/);
    return paddingMatch ? paddingMatch[0] : 'p-0';
  };

  const extractBorderRadius = (className: string): string => {
    const radiusMatch = className.match(/rounded(-\w+)?/);
    return radiusMatch ? radiusMatch[0] : 'rounded-none';
  };

  const extractBorderColor = (className: string): string => {
    const borderMatch = className.match(/border-\w+(-\d+)?/);
    return borderMatch ? borderMatch[0] : 'border-gray-300';
  };

  const extractShadow = (className: string): string => {
    const shadowMatch = className.match(/shadow-\w+/);
    return shadowMatch ? shadowMatch[0] : '';
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <div className="text-sm font-medium">Render Error</div>
        <div className="text-xs">{error}</div>
      </div>
    );
  }

  if (!renderedComponent) {
    return (
      <div className="text-gray-500 text-center p-4">
        <div className="text-sm">No component to preview</div>
        <div className="text-xs">Generate a component to see it here</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderedComponent && (
        <div key={`${component.jsxCode.substring(0, 100)}-${Date.now()}`}>
          {renderedComponent}
        </div>
      )}
      {error && (
        <div className="text-red-500 text-sm p-4 border border-red-200 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 