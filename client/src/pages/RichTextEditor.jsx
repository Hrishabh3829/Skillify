import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    // Extract plain text safely
    const plainText = content.replace(/<[^>]+>/g, "").trim();

    // Update state with both HTML & plain text
    setInput((prev) => ({
      ...prev,
      descriptionHtml: content,   // keep full HTML for editor
      description: plainText,     // store plain text for DB
    }));
  };

  return (
    <ReactQuill
      theme="snow"
      value={input.descriptionHtml || ""} // bind editor only to HTML
      onChange={handleChange}
    />
  );
};

export default RichTextEditor;
