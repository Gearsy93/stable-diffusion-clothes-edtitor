import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import {} from 'styled-components/cssprop';

type Props = {
  id: string;
  onChange: Function;
  value: string;
  additionalClasses?: string[];
  style?: React.CSSProperties;
  placeholder?: string;
  disabled?: Boolean;
  preventLineBreaks?: Boolean;
};

interface styledDivProps {
  readonly title: { length: number };
  readonly contentEditable: boolean;
  readonly placeholder: string | undefined;
}

const placeHolderStyles = (prop: any) => css`
  content: '${prop}';
  color: rgb(119, 119, 119);
`;

const StyledDiv = styled.div<styledDivProps>`
  display: ${(props) => (props.title.length > 0 ? 'inline' : 'inline-block')};
  background: transparent;
  outline: none;
  border: none;
  max-width: 100%;
  min-width: 1px;
  word-wrap: break-word;

  &:after {
    ${(props) =>
      props.contentEditable &&
      !props.title &&
      placeHolderStyles(props.placeholder)}
  }
`;

export const MultilineInput: React.FunctionComponent<Props> = (props) => {
  const {
    id,
    placeholder,
    onChange,
    value,
    additionalClasses,
    style,
    disabled = false,
    preventLineBreaks,
  } = props;

  const defaultValue = useRef(value),
    [titleValue, setTitleValue] = useState(value),
    divRef = useRef<HTMLDivElement | null>(null);

  const setTargetPropsAndCallOnChange = (e: any): void => {
    const textValue = e.target.innerText.replace(/[\u200B]/g, '');
    setTitleValue(textValue);
    e.target.value = textValue;
    e.target.name = e.target.id;
    onChange(e);
  };

  const preventLineBreaksOnType = (
    e: React.KeyboardEvent<HTMLInputElement>
  ): void | boolean => e.key.toLowerCase() === 'enter' && e.preventDefault();

  const preventLineBreaksOnPaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ): void | boolean => {
    e.preventDefault();

    let clipboardText = e.clipboardData.getData('text');
    clipboardText = clipboardText.replace(/\n/g, ' ');

    const selection: any = window.getSelection();
    if (!selection.rangeCount) return false;
    selection.deleteFromDocument();
    selection.getRangeAt(0).insertNode(document.createTextNode(clipboardText));
    selection.collapseToEnd();

    setTargetPropsAndCallOnChange(e);
  };

  return (
    <StyledDiv
      title={titleValue}
      ref={divRef}
      id={id}
      className={additionalClasses?.join(' ')}
      style={style}
      placeholder={placeholder}
      contentEditable={!disabled}
      onInput={setTargetPropsAndCallOnChange}
      onBlur={setTargetPropsAndCallOnChange}
      onKeyDown={preventLineBreaks && preventLineBreaksOnType}
      onPaste={preventLineBreaks && preventLineBreaksOnPaste}
      spellCheck={false}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  );
};
