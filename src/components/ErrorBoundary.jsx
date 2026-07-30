import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Tag, You're It! crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'Nunito, sans-serif',
            background: '#FDFCF8',
            color: '#2C2C24',
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#78786C', marginBottom: '1.5rem' }}>
              Try reloading the page. If this keeps happening, please{' '}
              <a href="https://github.com/a-nooj/tag-youre-it/issues" style={{ color: '#5D7052' }}>
                open an issue
              </a>
              .
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#5D7052',
                color: '#F3F4F1',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.6rem 1.75rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
