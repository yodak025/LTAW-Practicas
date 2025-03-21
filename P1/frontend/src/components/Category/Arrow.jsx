export const ForwardArrow = ({ className }) => {
  return (
    <svg 
      className={className}
      height="24px" 
      viewBox="0 -960 960 960" 
      width="24px" 
      fill="#currentColor">
      <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
    </svg>
  );
};

export const BackwardArrow = ({ className }) => {
  return (
    <svg 
      className={className}
      height="24px" 
      viewBox="0 -960 960 960" 
      width="24px" 
      fill="#currentColor">
      <path d="m540-80 71-71-329-329 329-329-71-71-400 400L540-80Z" />
    </svg>
  );
};
