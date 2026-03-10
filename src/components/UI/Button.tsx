// import React from 'react';
// import './Button.scss';

// interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   children: React.ReactNode;
//   variant?: 'primary' | 'secondary' | 'base' | 'danger' | 'success';
//   size?: 'small' | 'medium' | 'large';
//   outline?: boolean;
//   ghost?: boolean;
//   block?: boolean;
//   loading?: boolean;
//   icon?: React.ReactNode;
//   iconPosition?: 'left' | 'right';
// }

// const Button = ({ 
//   children, 
//   variant = 'primary',
//   size = 'medium',
//   outline = false,
//   ghost = false,
//   block = false,
//   loading = false,
//   icon,
//   iconPosition = 'left',
//   className = '',
//   disabled,
//   ...props 
// }: CustomButtonProps) => {
//   const getButtonClasses = () => {
//     const baseClasses = ['custom-button'];
    
//     // Variant classes
//     baseClasses.push(`custom-button-${variant}`);
    
//     // Size classes
//     baseClasses.push(`size-${size}`);
    
//     // Modifier classes
//     if (outline) baseClasses.push('custom-button-outline');
//     if (ghost) baseClasses.push('custom-button-ghost');
//     if (block) baseClasses.push('custom-button-block');
//     if (loading) baseClasses.push('loading');
//     if (disabled) baseClasses.push('disabled');
//     if (icon) baseClasses.push('custom-button-with-icon');
    
//     // Additional custom classes
//     if (className) baseClasses.push(className);
    
//     return baseClasses.join(' ');
//   };

//   const renderContent = () => {
//     if (loading) {
//       return (
//         <>
//           <span className="icon">
//             <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               />
//             </svg>
//           </span>
//           {children}
//         </>
//       );
//     }

//     if (icon && iconPosition === 'left') {
//       return (
//         <>
//           <span className="icon">{icon}</span>
//           {children}
//         </>
//       );
//     }

//     if (icon && iconPosition === 'right') {
//       return (
//         <>
//           {children}
//           <span className="icon">{icon}</span>
//         </>
//       );
//     }

//     return children;
//   };

//   return (
//     <button
//       className={getButtonClasses()}
//       disabled={disabled || loading}
//       {...props}
//     >
//       {renderContent()}
//     </button>
//   );
// };

// // Predefined button components for convenience
// const ButtonPrimary = ({ children, ...props }: Omit<CustomButtonProps, 'variant'>) => (
//   <Button variant="primary" {...props}>
//     {children}
//   </Button>
// );

// const ButtonSecondary = ({ children, ...props }: Omit<CustomButtonProps, 'variant'>) => (
//   <Button variant="secondary" {...props}>
//     {children}
//   </Button>
// );

// const ButtonBase = ({ children, ...props }: Omit<CustomButtonProps, 'variant'>) => (
//   <Button variant="base" {...props}>
//     {children}
//   </Button>
// );

// const ButtonDanger = ({ children, ...props }: Omit<CustomButtonProps, 'variant'>) => (
//   <Button variant="danger" {...props}>
//     {children}
//   </Button>
// );

// const ButtonSuccess = ({ children, ...props }: Omit<CustomButtonProps, 'variant'>) => (
//   <Button variant="success" {...props}>
//     {children}
//   </Button>
// );

// // Button Group Component
// interface ButtonGroupProps {
//   children: React.ReactNode;
//   className?: string;
// }

// const ButtonGroup = ({ children, className = '' }: ButtonGroupProps) => (
//   <div className={`custom-button-group ${className}`}>
//     {children}
//   </div>
// );

// export { 
//   Button, 
//   ButtonPrimary, 
//   ButtonSecondary, 
//   ButtonBase,
//   ButtonDanger, 
//   ButtonSuccess, 
//   ButtonGroup 
// };
