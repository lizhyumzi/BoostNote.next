import React from 'react'
import CodeEditor from './CodeEditor'
import { usePreferences } from '../../lib/preferences'

interface CustomizedCodeEditorProps {
  value: string
  onChange?: (
    newValue: string,
    change: CodeMirror.EditorChangeLinkedList
  ) => void
  codeMirrorRef?: (codeMirror: CodeMirror.EditorFromTextArea) => void
  className?: string
  mode?: string
  readonly?: boolean
  onPaste?: (codeMirror: CodeMirror.Editor, event: ClipboardEvent) => void
  onDrop?: (codeMirror: CodeMirror.Editor, event: DragEvent) => void
  onCursorActivity?: (codeMirror: CodeMirror.Editor) => void
}

const CustomizedCodeEditor = ({
  onChange,
  value,
  codeMirrorRef,
  className,
  mode,
  readonly,
  onPaste,
  onDrop,
  onCursorActivity,
}: CustomizedCodeEditorProps) => {
  const { preferences } = usePreferences()
  return (
    <CodeEditor
      onChange={onChange}
      value={value}
      codeMirrorRef={codeMirrorRef}
      className={className}
      theme={preferences['editor.theme']}
      fontSize={preferences['editor.fontSize']}
      fontFamily={preferences['editor.fontFamily']}
      indentType={preferences['editor.indentType']}
      indentSize={preferences['editor.indentSize']}
      keyMap={preferences['editor.keyMap']}
      mode={mode}
      readonly={readonly}
      onPaste={onPaste}
      onDrop={onDrop}
      onCursorActivity={onCursorActivity}
    />
  )
}

export default CustomizedCodeEditor
