declare module 'react-flow' {
  export const ReactFlow: any;
  export const ReactFlowProvider: any;
  export const background: any;
  export const controls: any;
  export const miniMap: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      background: any;
      controls: any;
      miniMap: any;
    }
  }
}
