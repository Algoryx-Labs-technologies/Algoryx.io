import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { usePrivacyMask } from '../contexts/PrivacyMaskContext';

export function PrivacyMaskToggle() {
  const { isMasked, toggleMask } = usePrivacyMask();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleMask}
      className="font-footer gap-2"
      aria-label={isMasked ? 'Show financial amounts' : 'Hide financial amounts'}
      aria-pressed={!isMasked}
    >
      {isMasked ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      <span className="hidden sm:inline">{isMasked ? 'Show amounts' : 'Hide amounts'}</span>
    </Button>
  );
}
