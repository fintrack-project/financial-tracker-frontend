import React, { ElementType, CSSProperties } from 'react';
import { IconType } from 'react-icons';

interface IconProps {
  icon: IconType;
  className?: string;
  'aria-hidden'?: boolean;
  size?: string | number;
  style?: CSSProperties;
}

const Icon = ({ icon, ...props }: IconProps) => {
  const Component = icon as ElementType;
  return React.createElement(Component, props);
};

export default Icon; 