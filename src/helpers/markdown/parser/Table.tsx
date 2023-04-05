import React from 'react';
import { marked } from '..';
import { inlineElementParserList } from '.';

export const TABLE_REG = /^ *\|(.+)\n *\|( *[-:]+ *\|)+( *\n *\|(.+))*\|? *$/;

const parseTableContent = (content: string, delimiter: RegExp) => {
  return content.split(delimiter).map(cell => cell.trim());
};

const renderer = (rawStr: string) => {
  const matchResult = rawStr.match(TABLE_REG);
  if (!matchResult) {
    return rawStr;
  }

  const tableRows = matchResult[0].split('\n');
  const headerRow = tableRows[0];
  const alignmentRow = tableRows[1];
  const dataRows = tableRows.slice(2);

  const headerCells = parseTableContent(headerRow, /\|/).filter(cell => cell !== '');
  const alignments = parseTableContent(alignmentRow, /\|/).filter(cell => cell !== '');

  const header = (
    <thead>
      <tr>
        {headerCells.map((cell, index) => (
          <th key={index}>{marked(cell, [], inlineElementParserList)}</th>
        ))}
      </tr>
    </thead>
  );

  const body = (
    <tbody>
      {dataRows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {parseTableContent(row, /\|/)
            .filter(cell => cell !== '')
            .map((cell, cellIndex) => (
              <td key={cellIndex}>{marked(cell, [], inlineElementParserList)}</td>
            ))}
        </tr>
      ))}
    </tbody>
  );

  return (
    <table>
      {header}
      {body}
    </table>
  );
};

export default {
  name: 'table',
  regexp: TABLE_REG,
  renderer,
};
