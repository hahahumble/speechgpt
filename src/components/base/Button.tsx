interface ButtonProps {
  onClick?: () => void;
  className?: string;
  text?: string;
}

function Button({ onClick, className, text }: ButtonProps) {
  return (
    <button
      className={`bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-700 font-medium py-1.5 px-4 rounded shadow ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
