import React from 'react';

/**
 * LoadingState Component
 * 
 * Displays loading indicators with various styles and skeletons.
 * Used to provide visual feedback while data is being fetched or processed.
 * 
 * Features:
 * - Multiple loading variants (spinner, dots, bars, pulse, skeleton)
 * - Configurable size (small, medium, large)
 * - Optional loading text
 * - Skeleton loaders for different content types
 * - Overlay mode for full-screen loading
 * - Customizable colors
 */

export type LoadingVariant = 
  | 'spinner'      // Circular spinner
  | 'dots'         // Three bouncing dots
  | 'bars'         // Animated bars
  | 'pulse'        // Pulsing circle
  | 'skeleton';    // Skeleton placeholder

export type LoadingSize = 'small' | 'medium' | 'large';

export type SkeletonType = 
  | 'text'         // Text lines
  | 'card'         // Card layout
  | 'table'        // Table rows
  | 'list'         // List items
  | 'avatar'       // Avatar circle
  | 'image';       // Image placeholder

export interface LoadingStateProps {
  /**
   * Loading variant style
   * @default 'spinner'
   */
  variant?: LoadingVariant;
  
  /**
   * Size of the loading indicator
   * @default 'medium'
   */
  size?: LoadingSize;
  
  /**
   * Optional loading text
   */
  text?: string;
  
  /**
   * Show as full-screen overlay
   * @default false
   */
  overlay?: boolean;
  
  /**
   * Skeleton type (only used when variant='skeleton')
   */
  skeletonType?: SkeletonType;
  
  /**
   * Number of skeleton items to show
   * @default 3
   */
  skeletonCount?: number;
  
  /**
   * Custom color for the loader
   */
  color?: string;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Center the loading indicator
   * @default true
   */
  center?: boolean;
  
  /**
   * Minimum height when centered
   */
  minHeight?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  variant = 'spinner',
  size = 'medium',
  text,
  overlay = false,
  skeletonType = 'text',
  skeletonCount = 3,
  color = 'primary-600',
  className = '',
  center = true,
  minHeight = '200px',
}) => {
  // Size classes for loaders
  const sizeClasses = {
    small: {
      spinner: 'w-6 h-6 border-2',
      dots: 'w-2 h-2',
      bars: 'w-1 h-8',
      pulse: 'w-8 h-8',
      text: 'text-sm',
    },
    medium: {
      spinner: 'w-10 h-10 border-3',
      dots: 'w-3 h-3',
      bars: 'w-2 h-12',
      pulse: 'w-12 h-12',
      text: 'text-base',
    },
    large: {
      spinner: 'w-16 h-16 border-4',
      dots: 'w-4 h-4',
      bars: 'w-3 h-16',
      pulse: 'w-16 h-16',
      text: 'text-lg',
    },
  };

  const currentSize = sizeClasses[size];

  // Spinner loader
  const SpinnerLoader = () => (
    <div className={`${currentSize.spinner} border-gray-200 border-t-${color} rounded-full animate-spin`} />
  );

  // Dots loader
  const DotsLoader = () => (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${currentSize.dots} bg-${color} rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  // Bars loader
  const BarsLoader = () => (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`${currentSize.bars} bg-${color} animate-pulse`}
          style={{ 
            animationDelay: `${i * 0.1}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );

  // Pulse loader
  const PulseLoader = () => (
    <div className="relative">
      <div className={`${currentSize.pulse} bg-${color} rounded-full opacity-75 animate-ping absolute`} />
      <div className={`${currentSize.pulse} bg-${color} rounded-full relative`} />
    </div>
  );

  // Skeleton loaders
  const SkeletonText = () => (
    <div className="space-y-3 w-full">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 40 + 60}%` }} />
          {i % 2 === 0 && (
            <div className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 30 + 50}%` }} />
          )}
        </div>
      ))}
    </div>
  );

  const SkeletonCard = () => (
    <div className="space-y-4 w-full">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
          <div className="h-20 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-20" />
          </div>
        </div>
      ))}
    </div>
  );

  const SkeletonTable = () => (
    <div className="space-y-3 w-full">
      {/* Table header */}
      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-gray-200">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
      {/* Table rows */}
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );

  const SkeletonList = () => (
    <div className="space-y-3 w-full">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
          <div className="w-10 h-10 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  const SkeletonAvatar = () => (
    <div className="flex items-center gap-4">
      {Array.from({ length: Math.min(skeletonCount, 5) }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <div className={`${currentSize.pulse} bg-gray-200 rounded-full animate-pulse`} />
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );

  const SkeletonImage = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );

  // Render skeleton based on type
  const renderSkeleton = () => {
    switch (skeletonType) {
      case 'text':
        return <SkeletonText />;
      case 'card':
        return <SkeletonCard />;
      case 'table':
        return <SkeletonTable />;
      case 'list':
        return <SkeletonList />;
      case 'avatar':
        return <SkeletonAvatar />;
      case 'image':
        return <SkeletonImage />;
      default:
        return <SkeletonText />;
    }
  };

  // Render loader based on variant
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader />;
      case 'dots':
        return <DotsLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'skeleton':
        return renderSkeleton();
      default:
        return <SpinnerLoader />;
    }
  };

  // Container classes
  const containerClasses = `
    ${center ? 'flex flex-col items-center justify-center' : ''}
    ${variant !== 'skeleton' ? 'gap-4' : ''}
    ${className}
  `.trim();

  const content = (
    <div 
      className={containerClasses}
      style={center && !overlay ? { minHeight } : undefined}
    >
      {renderLoader()}
      {text && variant !== 'skeleton' && (
        <p className={`${currentSize.text} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  // Overlay mode
  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingState;
