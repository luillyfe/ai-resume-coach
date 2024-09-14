import React, { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import ReactMarkdown from "react-markdown";

/**
 * @fileoverview This file contains the PDFGenerator component, which converts markdown text into a styled PDF document.
 * It uses react-pdf for PDF generation and react-markdown for parsing markdown content.
 */

// Register a custom font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

/**
 * Styles for the PDF document
 * @constant
 * @type {Object}
 */
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Roboto",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  text: {
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  heading1: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  heading2: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
    color: "#34495e",
  },
  heading3: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "bold",
    color: "#7f8c8d",
  },
  em: {
    fontStyle: "italic",
  },
  strong: {
    fontWeight: "bold",
  },
  ul: {
    marginBottom: 10,
  },
  ol: {
    marginBottom: 10,
  },
  li: {
    fontSize: 12,
    marginBottom: 4,
    flexDirection: "row",
  },
  bulletPoint: {
    width: 15,
    fontSize: 12,
  },
  listItemText: {
    flex: 1,
    fontSize: 12,
  },
  blockquote: {
    fontStyle: "italic",
    marginVertical: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#34495e",
    color: "#7f8c8d",
  },
  link: {
    color: "#3498db",
    textDecoration: "underline",
  },
  code: {
    fontFamily: "Courier",
    backgroundColor: "#f0f0f0",
    padding: 2,
  },
  codeBlock: {
    fontFamily: "Courier",
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
  },
});

/**
 * Counts the depth of nested lists
 * @param {ReactNode} node - The node to check for nesting
 * @returns {number} The depth of nesting
 */
const countListDepth = (node: ReactNode): number => {
  if (
    Array.isArray(node) &&
    node.length > 0 &&
    node[0] &&
    typeof node[0] === "object" &&
    "props" in node[0] &&
    node[0].props &&
    node[0].props.children
  ) {
    return 1 + countListDepth(node[0].props.children);
  }
  return 0;
};

/**
 * Custom renderers for markdown components
 * Each renderer function takes the children and any relevant props,
 * and returns a react-pdf component with appropriate styling
 * @constant
 * @type {Object}
 */
const renderers = {
  p: ({ children }: { children: ReactNode }) => (
    <Text style={styles.text}>{children}</Text>
  ),
  h1: ({ children }: { children: ReactNode }) => (
    <Text style={styles.heading1}>{children}</Text>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <Text style={styles.heading2}>{children}</Text>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <Text style={styles.heading3}>{children}</Text>
  ),
  em: ({ children }: { children: ReactNode }) => (
    <Text style={styles.em}>{children}</Text>
  ),
  strong: ({ children }: { children: ReactNode }) => (
    <Text style={styles.strong}>{children}</Text>
  ),
  ul: ({ children }: { children: ReactNode }) => {
    const depth = countListDepth(children);
    return (
      <View style={[styles.ul, { paddingLeft: depth * 10 }]}>{children}</View>
    );
  },
  ol: ({ children }: { children: ReactNode }) => {
    const depth = countListDepth(children);
    return (
      <View style={[styles.ol, { paddingLeft: depth * 10 }]}>{children}</View>
    );
  },
  li: ({
    children,
    ordered,
    index,
  }: {
    children: ReactNode;
    ordered?: boolean;
    index?: number;
  }) => {
    const bullet = ordered ? `${index}. ` : "• ";
    return (
      <View style={styles.li}>
        <Text style={styles.bulletPoint}>{bullet}</Text>
        <Text style={styles.listItemText}>{children}</Text>
      </View>
    );
  },
  blockquote: ({ children }: { children: ReactNode }) => (
    <View style={styles.blockquote}>
      <Text>{children}</Text>
    </View>
  ),
  a: ({ children }: { children: ReactNode; href?: string }) => (
    <Text style={styles.link}>{children}</Text>
  ),
  code: ({ children, inline }: { children: ReactNode; inline?: boolean }) => (
    <Text style={inline ? styles.code : styles.codeBlock}>{children}</Text>
  ),
};

/**
 * Props for the PDFGenerator component
 * @typedef {Object} PDFGeneratorProps
 * @property {string} feedback - The markdown text to be converted to PDF
 */
type PDFGeneratorProps = {
  feedback: string;
};

/**
 * PDFGenerator component
 * This component takes markdown text as input and generates a styled PDF document
 * @param {PDFGeneratorProps} props - The props for the component
 * @returns {React.ReactElement | null} A Document component from react-pdf, or null if no feedback is provided
 */
const PDFGenerator: React.FC<PDFGeneratorProps> = ({ feedback }) => {
  if (!feedback) {
    return null;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          {/* @ts-expect-error: components and renderers are not fully compatible. TODO: find a better type */}
          <ReactMarkdown components={renderers}>{feedback}</ReactMarkdown>
        </View>
      </Page>
    </Document>
  );
};

export default PDFGenerator;
