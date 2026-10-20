import { Component, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onReset: () => void;
  resource: string;
  fallbackClassName?: string;
};

type State = {
  hasError: boolean;
};

class QueryErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  handleRetry = () => {
    this.props.onReset();
    this.setState({ hasError: false });
  };

  render() {
    const { children, resource, fallbackClassName } = this.props;

    if (this.state.hasError) {
      return (
        <section
          className={
            fallbackClassName ??
            'flex min-h-40 flex-col items-center justify-center gap-3 rounded-md bg-card p-6 text-center'
          }
          role="alert"
        >
          <p>Could not load {resource}. The service may be unavailable.</p>
          <button
            className="rounded-md border px-4 py-2"
            onClick={this.handleRetry}
            type="button"
          >
            Retry
          </button>
        </section>
      );
    }

    return <div className="contents">{children}</div>;
  }
}

export default QueryErrorBoundary;
