import React from 'react';
import Image from 'next/image';
import { Button } from 'vizonomy';
import type {
  ButtonSelectTriggerProps,
  SelectDropdownProps,
  ButtonSelectOptionProps,
  ChevronDownIconProps,
  SelectTriggerLabelProps,
  SelectEmptyMessageProps,
} from './EBusSelect.types';
import { EBUS_SELECT_SIZES } from './EBusSelect.constants';

export function SelectContentContainer({ children }: { children: React.ReactNode }) {
  return <div className="relative w-full">{children}</div>;
}

export function ButtonSelectTrigger({
  children,
  onClick,
  hasSelectedOption,
  variant = 'default',
}: ButtonSelectTriggerProps) {
  const isTableVariant = variant === 'table';

  const variantClasses = isTableVariant
    ? 'rounded-[4px] px-2 py-1 text-right text-xs sm:text-sm gap-2 justify-end'
    : 'rounded border border-solid border-[#c9c9c9] px-3 py-2 text-left';

  const textColor = hasSelectedOption ? 'text-[#3d3b3b]' : 'text-[#a1a1a1]';
  const justifyClass = isTableVariant ? '' : 'justify-between';
  const heightClass = isTableVariant ? 'h-[20px]' : 'h-[40px]';

  return (
    <Button
      type="default"
      onClick={onClick}
      className={`
        font-['Inter',sans-serif] flex ${heightClass} w-full cursor-pointer items-center ${justifyClass}
        ${isTableVariant ? 'bg-transparent' : 'bg-white'}
        ${variantClasses}
        ${textColor}
        ${!isTableVariant ? 'rounded-[4px]' : ''}
      `}
    >
      {children}
    </Button>
  );
}

export function SelectDropdown({ children, isLastRow = false, variant = 'default' }: SelectDropdownProps) {
  const positionClass = isLastRow ? 'bottom-full mb-1' : 'top-full mt-1';
  const isTableVariant = variant === 'table';
  const maxHeightClass = isTableVariant ? 'max-h-[60px] overflow-y-auto' : '';

  return (
    <div
      className={`absolute left-0 ${positionClass} z-[100] w-full ${maxHeightClass}
      rounded border border-solid border-[#c9c9c9] bg-white shadow-lg`}
    >
      {children}
    </div>
  );
}

export function ButtonSelectOption({ children, onClick, isSelected, variant = 'default' }: ButtonSelectOptionProps) {
  const isTableVariant = variant === 'table';
  const paddingClass = isTableVariant ? 'px-1.5 py-0.5' : 'px-3 py-2';
  const fontSizeClass = isTableVariant ? 'sm:text-sm' : 'sm:text-base';

  return (
    <Button
      type="default"
      onClick={onClick}
      className={`
        font-['Inter',sans-serif] block w-full cursor-pointer ${paddingClass} text-left
        text-xs ${fontSizeClass} text-[#5c5959] hover:bg-gray-100 focus:outline-none
        ${isSelected ? 'bg-[#f0f0f0]' : 'bg-transparent'}
      `}
    >
      {children}
    </Button>
  );
}

export function SelectTriggerLabel({ children, variant = 'default' }: SelectTriggerLabelProps) {
  const isTableVariant = variant === 'table';
  return <span className={isTableVariant ? 'text-right w-full' : ''}>{children}</span>;
}

export function SelectEmptyMessage({ children }: SelectEmptyMessageProps) {
  return <div className="px-3 py-2 text-[#a1a1a1]">{children}</div>;
}

export function ChevronDownIcon({
  isOpen = false,
  width = EBUS_SELECT_SIZES.CHEVRON_ICON_WIDTH,
  height = EBUS_SELECT_SIZES.CHEVRON_ICON_HEIGHT,
}: ChevronDownIconProps) {
  return (
    <div
      className={`pointer-events-none flex items-center justify-center transition-transform ${
        isOpen ? 'rotate-180' : ''
      }`}
    >
      <Image alt="Chevron down" className="w-4 h-4" src="/chevron-down.svg" width={width} height={height} />
    </div>
  );
}
