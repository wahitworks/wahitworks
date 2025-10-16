import React from 'react';
import { motion } from 'framer-motion';

const Card02LoadingSkeleton = ({
  width = '100%',
  height = '200px',
  borderRadius = '12px',
  backgroundColor = '#f0f2f4',
  highlightColor = '#f8f9fa',
  lines = [
    { width: '50%', height: '20px', align: 'center' },
    { width: '100%', height: '16px' },
    { width: '80%', height: '16px' }
  ]
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '16px'
      }}
    >
      {lines.map((line, index) => (
        <motion.div
          key={index}
          style={{
            width: line.width,
            height: line.height,
            backgroundColor: '#e9edf1',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            margin: line.align === 'center' ? '0 auto' : undefined,
          }}
        >
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(
                90deg,
                transparent,
                ${highlightColor},
                transparent
              )`,
              backgroundSize: '200% 100%'
            }}
            animate={{
              backgroundPosition: ['100% 0', '-100% 0']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.2
            }}
          />
          </motion.div>
      ))}
    </div>
  );
};
export default Card02LoadingSkeleton;