import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

const FONT_SIZES = ['normal', 'large', 'extra-large'];
const FONT_SIZE_LABELS = { normal: '100%', large: '120%', 'extra-large': '140%' };

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'normal';
  });

  useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast);
    localStorage.setItem('highContrast', highContrast);
  }, [highContrast]);

  useEffect(() => {
    document.documentElement.classList.remove(...FONT_SIZES.map(s => `font-${s}`));
    document.documentElement.classList.add(`font-${fontSize}`);
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleHighContrast = () => setHighContrast(prev => !prev);

  const increaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx < FONT_SIZES.length - 1) setFontSize(FONT_SIZES[idx + 1]);
  };

  const decreaseFontSize = () => {
    const idx = FONT_SIZES.indexOf(fontSize);
    if (idx > 0) setFontSize(FONT_SIZES[idx - 1]);
  };

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      toggleHighContrast,
      fontSize,
      fontSizeLabel: FONT_SIZE_LABELS[fontSize],
      increaseFontSize,
      decreaseFontSize,
      canIncrease: FONT_SIZES.indexOf(fontSize) < FONT_SIZES.length - 1,
      canDecrease: FONT_SIZES.indexOf(fontSize) > 0,
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
