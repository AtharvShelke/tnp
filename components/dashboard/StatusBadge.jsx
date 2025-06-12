import { CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function StatusBadge({ status, color = 'blue' }) {
  // Color variants
  const colorVariants = {
    green: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-800 dark:text-green-300',
      border: 'border-green-300 dark:border-green-800',
      icon: <CheckCircle2 className="h-4 w-4" />
    },
    yellow: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-800',
      icon: <Clock className="h-4 w-4" />
    },
    red: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-300 dark:border-red-800',
      icon: <XCircle className="h-4 w-4" />
    },
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-300 dark:border-blue-800',
      icon: null
    }
  };

  const variant = colorVariants[color] || colorVariants.blue;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${variant.bg} ${variant.text} ${variant.border}`}>
      {variant.icon && (
        <span className="flex-shrink-0">
          {variant.icon}
        </span>
      )}
      <span className="text-xs font-medium capitalize">
        {status}
      </span>
    </div>
  );
}