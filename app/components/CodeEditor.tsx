"use client";
import React, { useEffect, useRef } from 'react';
import { basicSetup } from 'codemirror';
import { EditorView, keymap, Decoration, DecorationSet, WidgetType } from '@codemirror/view';
import { EditorState, StateField, StateEffect } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentWithTab } from '@codemirror/commands';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';
import type { ViewUpdate } from '@codemirror/view';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: string;
  errorLine?: number;
  errorColumn?: number;
  errorMessage?: string;
  theme?: 'dark' | 'light';
}

// Error widget class
class ErrorWidget extends WidgetType {
  constructor(readonly message: string) {
    super();
  }

  eq(other: ErrorWidget): boolean {
    return other.message === this.message;
  }

  toDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'error-gutter';
    span.innerHTML = '⚠️';
    span.title = this.message;
    span.style.color = '#ef4444';
    span.style.marginLeft = '4px';
    return span;
  }
}

// Effect for setting error decorations
const setErrorEffect = StateEffect.define<{line: number, column?: number, message?: string} | null>();

// State field to manage error decorations
const errorField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    
    for (let effect of tr.effects) {
      if (effect.is(setErrorEffect)) {
        decorations = Decoration.none;
        if (effect.value) {
          const { line, column, message } = effect.value;
          if (line <= tr.state.doc.lines) {
            const linePos = tr.state.doc.line(line);
            
            // Highlight the entire error line
            const lineDecoration = Decoration.line({
              attributes: {
                class: 'error-line'
              }
            });
            
            // Add gutter marker
            const gutterDecoration = Decoration.widget({
              widget: new ErrorWidget(message || 'Syntax error on this line'),
              side: 1
            });
            
            decorations = decorations.update({
              add: [
                lineDecoration.range(linePos.from),
                gutterDecoration.range(linePos.from)
              ]
            });
          }
        }
      }
    }
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  value, 
  onChange, 
  height = '400px',
  errorLine,
  errorColumn,
  errorMessage,
  theme = 'dark'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        python(),
        ...(theme === 'dark' ? [oneDark] : []),
        errorField, // Add error highlighting support
        keymap.of([indentWithTab]), // Enable Tab for indentation
        indentationMarkers(), // Add visible indentation guides
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
          '.cm-editor.cm-focused': {
            outline: `2px solid ${theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(69, 72, 102, 0.3)'}`,
            outlineOffset: '-2px',
          },
          '.cm-scroller': {
            lineHeight: '1.6',
            fontFamily: 'JetBrains Mono, Fira Code, Monaco, Menlo, Consolas, monospace',
          },
          // Custom scrollbar styling
          '.cm-scroller::-webkit-scrollbar': {
            width: '12px',
          },
          '.cm-scroller::-webkit-scrollbar-track': {
            background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
            borderRadius: '6px',
          },
          '.cm-scroller::-webkit-scrollbar-thumb': {
            background: theme === 'dark' ? '#3b82f6' : '#94a3b8',
            borderRadius: '6px',
            border: `2px solid ${theme === 'dark' ? '#1e293b' : '#f1f5f9'}`,
          },
          '.cm-scroller::-webkit-scrollbar-thumb:hover': {
            background: theme === 'dark' ? '#2563eb' : '#64748b',
          },
          '.cm-scroller::-webkit-scrollbar-corner': {
            background: theme === 'dark' ? '#1e293b' : '#f1f5f9',
          },
          '.cm-lineNumbers': {
            color: theme === 'dark' ? '#6b7280' : '#9ca3af',
            backgroundColor: 'transparent',
            paddingRight: '8px',
          },
          '.cm-activeLineGutter': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          '.cm-activeLine': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
          // Error styling
          '.error-line': {
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderLeft: '3px solid #ef4444',
            paddingLeft: '13px',
          },
          '.error-gutter': {
            color: '#ef4444',
            fontWeight: 'bold',
            cursor: 'help',
          },
          '.cm-cursor': {
            borderLeftColor: theme === 'dark' ? '#60a5fa' : '#454866',
            borderLeftWidth: '2px',
          },
          '.cm-selectionBackground': {
            backgroundColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.3) !important' : 'rgba(69, 72, 102, 0.3) !important',
          },
          // Enhanced indentation markers
          '.cm-indent-markers .cm-indent-marker': {
            borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
            position: 'absolute',
            top: '0',
            bottom: '0',
            pointerEvents: 'none',
          },
          '.cm-indent-markers .cm-indent-marker.cm-indent-marker-active': {
            borderLeft: '1px solid rgba(96, 165, 250, 0.6)',
          },
          // Better tab size visualization
          '.cm-tab': {
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
          },
        }),
        // Prevent Tab from escaping the editor
        EditorView.domEventHandlers({
          keydown(event, view) {
            if (event.key === 'Tab') {
              event.stopPropagation();
              return false; // Let CodeMirror handle it
            }
            return false;
          }
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

  // Update error highlighting when error props change
  useEffect(() => {
    if (viewRef.current) {
      if (errorLine && errorLine > 0) {
        viewRef.current.dispatch({
          effects: setErrorEffect.of({
            line: errorLine,
            column: errorColumn,
            message: errorMessage
          })
        });
      } else {
        // Clear error highlighting
        viewRef.current.dispatch({
          effects: setErrorEffect.of(null)
        });
      }
    }
  }, [errorLine, errorColumn, errorMessage]);

  return (
    <div 
      ref={editorRef} 
      style={{ width: '100%', height }} 
      onKeyDown={(e) => {
        // Prevent Tab from bubbling up to parent elements
        if (e.key === 'Tab') {
          e.stopPropagation();
        }
      }}
    />
  );
};

export default CodeEditor;
