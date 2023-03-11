import React, { useState, useRef, useMemo } from "react";
import JoditEditor from "jodit-react";
import { useEffect } from "react";

const ContentEditor = (props) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(props.content);
  }, [props.content]);

  /*const config = useMemo(
    {
      readonly: false, // all options from https://xdsoft.net/jodit/doc/,
      placeholder: placeholder || "Start typings...",
    },
    [placeholder]
  );*/

  const config = {
    height: props.editorHeight || "650px",
    width: props.editorWidth || "100%",
    toolbarButtonSize: "small",
  };

  const handleEditorChange = (newContent) => {
    if (props.onEditorChange) props.onEditorChange(newContent);
  };

  return (
    <>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={(newContent) => handleEditorChange(newContent)} // preferred to use only this option to update the content for performance reasons
      />
    </>
  );
};

export default ContentEditor;
