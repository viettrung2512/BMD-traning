import React from 'react';

interface SuccessAnimationProps {
  size?: number;
  duration?: number;
  className?: string;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ 
  size = 80, 
  duration = 0.6,
  className = "" 
}) => {
  const circleStyles = {
    strokeDasharray: 283,
    strokeDashoffset: 283,
    animation: `drawCircle ${duration}s ease-out forwards`
  };

  const checkStyles = {
    strokeDasharray: 60,
    strokeDashoffset: 60,
    animation: `drawCheck ${duration}s ease-out ${duration * 0.5}s forwards`
  };

  return (
    <>
      <style>{`
        @keyframes drawCircle {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes drawCheck {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes fadeInScale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-animation {
          animation: fadeInScale ${duration}s ease-out forwards;
        }
      `}</style>
      
      <div className={`flex items-center justify-center success-animation ${className}`}>
        <div 
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
        >
          <div 
            className="absolute inset-0 rounded-full bg-green-100 opacity-30"
            style={{ width: size, height: size }}
          />

          <svg
            className="absolute inset-0"
            width={size}
            height={size}
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              style={circleStyles}
            />
          </svg>

          <svg
            className="absolute inset-0"
            width={size}
            height={size}
            viewBox="0 0 100 100"
          >
            <path
              d="M25 50 L40 65 L75 30"
              fill="none"
              stroke="#10B981"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={checkStyles}
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SuccessAnimation;
