import hljs from 'highlight.js';
import { toast } from 'react-hot-toast';
import { matcher } from '../matcher';

export const CODE_BLOCK_REG = /^```(\S*?)\s([\s\S]*?)```/;

const renderer = (rawStr: string) => {
  const matchResult = matcher(rawStr, CODE_BLOCK_REG);
  if (!matchResult) {
    return <>{rawStr}</>;
  }

  const language = matchResult[1] || 'plaintext';
  let highlightedCode = hljs.highlightAuto(matchResult[2]).value;

  try {
    const temp = hljs.highlight(matchResult[2], {
      language,
    }).value;
    highlightedCode = temp;
  } catch (error) {
    // do nth
  }

  return (
    <pre className="group">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      ></code>
    </pre>
  );
};

export default {
  name: 'code block',
  regexp: CODE_BLOCK_REG,
  renderer,
};
