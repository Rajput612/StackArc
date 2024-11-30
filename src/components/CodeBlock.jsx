import React from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';

const CodeBlock = ({ code, language = 'python' }) => {
  const highlightedCode = Prism.highlight(code, Prism.languages[language], language);
  
  return (
    <pre className="rounded-lg bg-gray-900 p-4 my-4">
      <code 
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      />
    </pre>
  );
};

export default CodeBlock;