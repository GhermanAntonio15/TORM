interface CodeViewerProps {
  code: string;
}

export function CodeViewer({ code }: CodeViewerProps) {
  return (
    <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-slate-100 text-sm">
      <code>{code}</code>
    </pre>
  );
}
