import Tippy from '@tippy.js/react';
import 'tippy.js/dist/tippy.css';

interface TippyButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: string;
  text?: string;
  icon?: React.ReactNode;
  tooltip?: string;
}

function TippyButton(props: TippyButtonProps) {
  return (
    <>
      {props.tooltip && (
        <Tippy
          content={props.tooltip}
          placement="bottom"
          duration={0}
          hideOnClick={true}
          trigger={'mouseenter'}
        >
          <button
            className={`font-bold py-2 px-2 rounded-md flex flex-row justify-center ${props.style}`}
            onClick={props.onClick}
          >
            {props.icon}
            {props.text}
          </button>
        </Tippy>
      )}
      {!props.tooltip && (
        <button
          className={`font-bold py-2 px-2 rounded-md flex flex-row justify-center ${props.style}`}
          onClick={props.onClick}
        >
          {props.icon}
          {props.text}
        </button>
      )}
    </>
  );
}

export default TippyButton;
