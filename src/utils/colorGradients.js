export const COLOR_GRADIENTS = {
  blue: 'from-blue-500 to-cyan-500',
  purple: 'from-purple-500 to-pink-500',
  green: 'from-green-500 to-emerald-500',
  orange: 'from-orange-500 to-red-500',
  yellow: 'from-yellow-500 to-orange-500',
  indigo: 'from-indigo-500 to-purple-500',
  teal: 'from-teal-500 to-cyan-500',
  pink: 'from-pink-500 to-rose-500',
  amber: 'from-amber-500 to-yellow-500',
  gray: 'from-gray-500 to-slate-500'
};

export const getColorGradient = (color) => COLOR_GRADIENTS[color] || COLOR_GRADIENTS.blue;
