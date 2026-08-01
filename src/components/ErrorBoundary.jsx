import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <main className="error-boundary">
          <div className="container text-center">
            <h1 className="page-title">發生錯誤</h1>
            <p className="error-boundary__message">頁面載入時發生問題，請稍後再試。</p>
            <Link to="/" className="btn-yellow" onClick={this.handleReset}>
              返回首頁
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
