import { useState, useEffect } from "react";
import { List, ListItem, Note } from "@contentful/forma-36-react-components";
import { SidebarExtensionSDK, EntryFieldAPI } from "@contentful/app-sdk";
import readingTime from "reading-time";

interface SidebarProps {
  sdk: SidebarExtensionSDK;
}

function consolidateRichTextFieldContent(content: any[]): string {
  let longString = "";

  content.forEach((node) => {
    node.content.forEach((nodeContent: any) => {
      longString += " " + nodeContent.value;
    });
  });

  return longString;
}

const Sidebar = (props: SidebarProps) => {
  // The sdk allows us to interact with the Contentful web app
  const { sdk } = props;

  // With the field ID we can reference individual fields from an entry
  const contentField: EntryFieldAPI = sdk.entry.fields["body"];

  // Get the current value from the blog post field and store it in React state
  const [blogText, setBlogText] = useState(contentField.getValue());

  // Listen for onChange events and update the value
  useEffect(() => {
    const detach = contentField.onValueChanged((value) => {
      setBlogText(value);
    });
    return () => detach();
  }, [contentField]);

  // Calculate the metrics based on the new value
  const consolidatedRichTextField = consolidateRichTextFieldContent(blogText.content);
  const stats = readingTime(consolidatedRichTextField || "");

  return (
    <>
      <Note style={{ marginBottom: "12px" }}>
        Blog Post Metrics
        <List style={{ marginBottom: "12px" }}>
          <ListItem>Word count: {stats.words}</ListItem>
          <ListItem>Reading time: {stats.text}</ListItem>
        </List>
      </Note>
    </>
  );
};

export default Sidebar;
