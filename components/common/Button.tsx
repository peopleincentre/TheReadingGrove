import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'text' | 'icon' | 'fab';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'filled', size = 'md', className = '', ...props }) => {
  const baseClasses = 'relative inline-flex items-center justify-center font-medium rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 overflow-hidden uppercase tracking-wider';

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];

    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };
  
  const variantClasses = {
    filled: 'bg-indigo-600 text-white shadow-sm hover:shadow-md focus:shadow-md disabled:bg-slate-400/20 disabled:text-slate-400/50',
    outlined: 'border border-slate-400/80 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10 focus:bg-indigo-600/10',
    text: 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/10 dark:hover:bg-indigo-400/10',
    icon: 'text-white p-2 !rounded-full hover:bg-white/10 focus:bg-white/10',
    fab: 'bg-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl w-14 h-14 !text-3xl',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  
  const finalSize = variant === 'icon' || variant === 'fab' ? '' : sizeClasses[size];

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${finalSize} ${className}`;

  return (
    <button className={combinedClasses} onClick={createRipple} {...props}>
      {children}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(255, 255, 255, 0.7);
        }

        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default Button;
