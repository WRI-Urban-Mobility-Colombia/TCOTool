import { Icon, ICON_NAMES } from '@/app/components/Icon';
import type {
  StepperContainerProps,
  StepperStepContainerProps,
  StepperCircleProps,
  StepperLabelProps,
} from './Stepper.types';

export function StepperContainer({ children }: StepperContainerProps) {
  return <div className="relative mb-0 flex h-[60px] w-full items-center justify-between">{children}</div>;
}

export function StepperStepContainer({ children }: StepperStepContainerProps) {
  return <div className="relative z-10 flex shrink-0 flex-col items-center gap-2">{children}</div>;
}

export function StepperCircle({ children, isActive, isCompleted, onClick, isClickable }: StepperCircleProps) {
  const clickableClass = isClickable ? 'cursor-pointer hover:opacity-80 transition-opacity' : 'cursor-default';

  if (isCompleted) {
    return (
      <div
        onClick={onClick}
        className={`flex h-[32px] w-[32px] items-center justify-center rounded-[99px] border border-solid
        bg-[#f2fff2] border-[#40873e] ${clickableClass}`}
      >
        <Icon
          iconName={ICON_NAMES.CHECK}
          width={16}
          height={16}
          className="[&_img]:brightness-0 [&_img]:invert-[9%] [&_img]:sepia-[100%]
          [&_img]:saturate-[10000%] [&_img]:hue-rotate-[85deg] [&_img]:contrast-[200%]"
        />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        flex h-[32px] w-[32px] items-center justify-center rounded-[99px] border border-solid
        font-['Inter',sans-serif] text-xl font-bold leading-[28px]
        ${isActive ? 'bg-[#f2fff2] border-[#40873e] text-[#085f05]' : 'bg-[#e7e6e6] border-transparent text-[#b0b0b0]'}
        ${clickableClass}
      `}
    >
      {children}
    </div>
  );
}

export function StepperLabel({ children, isActive }: StepperLabelProps) {
  return (
    <div
      className={`
        flex w-20 flex-col justify-center text-center font-['Inter',sans-serif] text-sm font-normal leading-5
        ${isActive ? 'text-[#1a1919]' : 'text-[#a1a1a1]'}
      `}
    >
      {children}
    </div>
  );
}

export function StepperLine() {
  return <div className="absolute left-14 right-14 top-[18px] h-0.5 bg-[#c9c9c9]" />;
}
