import { useEffect, useRef, type ClipboardEvent, type KeyboardEvent } from 'react';
import { cn } from '../components/ui/utils';

const MPIN_LENGTH = 6;

interface MpinInputProps {
  value: string;
  onChange: (value: string) => void;
  showValue?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
}

export function MpinInput({
  value,
  onChange,
  showValue = false,
  disabled,
  autoFocus,
}: MpinInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: MPIN_LENGTH }, (_, index) => value[index] ?? '');

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const setDigits = (nextDigits: string[]) => {
    onChange(nextDigits.join('').slice(0, MPIN_LENGTH));
  };

  const handleChange = (index: number, nextValue: string) => {
    const digit = nextValue.replace(/\D/g, '').slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);

    if (digit && index < MPIN_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      const nextDigits = [...digits];

      if (digits[index]) {
        nextDigits[index] = '';
        setDigits(nextDigits);
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = '';
        setDigits(nextDigits);
        focusInput(index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
    }

    if (event.key === 'ArrowRight' && index < MPIN_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, MPIN_LENGTH);
    if (!pasted) {
      return;
    }

    onChange(pasted);
    focusInput(Math.min(pasted.length, MPIN_LENGTH - 1));
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="MPIN">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type={showValue ? 'text' : 'password'}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          aria-label={`MPIN digit ${index + 1} of ${MPIN_LENGTH}`}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          className={cn(
            'h-12 w-10 sm:h-14 sm:w-12 rounded-lg border border-white/10 bg-slate-800/80 text-center text-lg font-semibold text-white',
            'focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        />
      ))}
    </div>
  );
}

export const MPIN_DIGIT_COUNT = MPIN_LENGTH;
