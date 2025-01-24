import { useCallback, useEffect, useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';
import { getInitialElements } from './initial-elements';
import { ProductNode } from './nodes/ProductNode';
import { AnnotationNode } from './nodes/AnnotationNode';

const nodeTypes = {
  product: ProductNode,
  annotation: AnnotationNode,
};

export const FlowCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    const initializeFlow = async () => {
      const elements = await getInitialElements();
      setNodes(elements.nodes);
      setEdges(elements.edges);
    };

    initializeFlow();
  }, []);

  const onNodesChange = useCallback((changes: any) => {
    setNodes((nds) => {
      return changes.reduce((acc: Node[], change: any) => {
        if (change.type === 'position' && change.dragging) {
          const node = acc.find((n) => n.id === change.id);
          if (node) {
            node.position = change.position;
          }
        }
        return acc;
      }, [...nds]);
    });
  }, []);

  return (
    <div className="h-[600px] w-full bg-white rounded-lg shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Controls />
      </ReactFlow>
    </div>
  );
};