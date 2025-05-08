import React, { ElementType } from 'react';
import { IconType } from 'react-icons';
import { IconBaseProps } from 'react-icons/lib';

interface IconProps {
  icon: IconType;
  className?: string;
  'aria-hidden'?: boolean;
  size?: string | number;
}

const Icon = ({ icon, ...props }: IconProps) => {
  const Component = icon as ElementType;
  return React.createElement(Component, props);
};

export default Icon; 