// Utility function for merging Tailwind CSS classes
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
