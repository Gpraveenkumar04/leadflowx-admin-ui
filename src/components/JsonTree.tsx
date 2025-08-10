import React from 'react';
import { clsx } from 'clsx';

interface JsonTreeProps {
  data: any;
  initiallyExpanded?: number; // depth
  className?: string;
}

interface NodeProps {
  k: string | null;
  value: any;
  depth: number;
  initiallyExpanded: number;
}

const isObject = (v: any) => v && typeof v === 'object' && !Array.isArray(v);

const Node: React.FC<NodeProps> = ({ k, value, depth, initiallyExpanded }) => {
  const [open, setOpen] = React.useState(depth < initiallyExpanded);
  const toggle = () => setOpen(o => !o);
  const keyLabel = k !== null ? <span className="text-indigo-600 mr-1">{k}:</span> : null;

  if (isObject(value) || Array.isArray(value)) {
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);
    return (
      <div className="leading-relaxed">
        <div className="cursor-pointer select-none" onClick={toggle}>
          {keyLabel}
          <span className="text-gray-500">{Array.isArray(value) ? `Array(${value.length})` : 'Object'} {open ? '−' : '+'}</span>
        </div>
        {open && (
          <div className="pl-4 border-l border-gray-200 dark:border-secondary-700 mt-1 space-y-0.5">
            {entries.map(([ck, cv]) => (
              <Node key={ck} k={String(ck)} value={cv} depth={depth + 1} initiallyExpanded={initiallyExpanded} />
            ))}
          </div>
        )}
      </div>
    );
  }
  let display: React.ReactNode;
  switch (typeof value) {
    case 'string':
      display = <span className="text-emerald-600">&quot;{value}&quot;</span>; break;
    case 'number':
      display = <span className="text-purple-600">{value}</span>; break;
    case 'boolean':
      display = <span className="text-orange-600">{String(value)}</span>; break;
    default:
      display = value === null ? <span className="text-gray-400">null</span> : String(value);
  }
  return (
    <div>
      {keyLabel}{display}
    </div>
  );
};

export const JsonTree: React.FC<JsonTreeProps> = ({ data, initiallyExpanded = 1, className }) => {
  return (
    <div className={clsx('text-xs font-mono whitespace-pre-wrap break-words', className)}>
      <Node k={null} value={data} depth={0} initiallyExpanded={initiallyExpanded} />
    </div>
  );
};

export default JsonTree;
