declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'camera-controls'?: boolean | string;
        'auto-rotate'?: boolean | string;
        'shadow-intensity'?: string;
        exposure?: string;
        style?: React.CSSProperties;
        onLoad?: React.ReactEventHandler<HTMLElement>;
      },
      HTMLElement
    >;
  }
}
