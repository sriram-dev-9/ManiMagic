"use client";
import React, { useEffect, useRef } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import type { ViewUpdate } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, height = '400px' }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        python(),
        oneDark,
        EditorView.updateListener.of((update: ViewUpdate) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': {
            height: height,
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Menlo, Consolas, monospace',
          },
          '.cm-content': {
            padding: '16px',
            minHeight: height,
          },
          '.cm-focused': {
            outline: 'none',
          },
          '.cm-editor': {
            borderRadius: '8px',
          },
          '.cm-scroller': {
            lineHeight: '1.6',
          },
          '.cm-lineNumbers': {
            color: '#6b7280',
            backgroundColor: 'transparent',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '.cm-cursor': {
            borderLeftColor: '#60a5fa',
          },
          '.cm-selectionBackground': {
            backgroundColor: 'rgba(96, 165, 250, 0.3) !important',
          },
        }),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, []);

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== value) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} style={{ width: '100%', height }} />;
};

export default CodeEditor;
