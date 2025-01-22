import { memo } from 'react';

interface AnnotationNodeData {
  label: string;
  level: number;
  arrowStyle?: React.CSSProperties;
}

export const AnnotationNode = memo(({ data }: { data: AnnotationNodeData }) => {
  return (
    <>
      <div className="annotation-content">
        <div className="annotation-level">{data.level}.</div>
        <div>{data.label}</div>
      </div>
      {data.arrowStyle && (
        <div className="annotation-arrow" style={data.arrowStyle}>
          ⤹
        </div>
      )}
    </>
  );
});

AnnotationNode.displayName = 'AnnotationNode';