import LogoPerfumes from '../../../assets/img/Logo-Perfume.jpg';

const sizeMap = {
  sm: 'h-14 w-auto',
  md: 'h-24 w-auto',
  lg: 'h-32 w-auto',
  xl: 'h-44 w-auto'
};

export const BrandLogo = ({ size = 'md', className = '', imageClassName = '' }) => {
  const sizeClass = sizeMap[size] || sizeMap.md;
  
  return (
    <img
      src={LogoPerfumes}
      alt="Buen Provecho"
      className={`${sizeClass} object-contain mix-blend-multiply ${imageClassName} ${className}`}
    />
  );
};
