import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --color-bg-cream: #F8F6F0;
    --color-bg-card: #FFFFFF;
    --color-text-main: #121826;
    --color-text-sub: #64748B;
    --color-border: #E2E8F0;
    --color-accent: #FFAB40;
    --color-accent-hover: #FF9800;
  }

  body.dark-mode {
    --color-bg-cream: #121826;
    --color-bg-card: #1E293B;
    --color-text-main: #F4F1EA;
    --color-text-sub: #94A3B8;
    --color-border: #2D3748;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: var(--color-bg-cream);
    color: var(--color-text-main);
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    background: none;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  /* 커스텀 토스트 수퍼 탑 z-index 배치 */
  #global-toast-container {
    position: fixed !important;
    top: 50% !important;
    left: 50% !important;
    bottom: auto !important;
    transform: translate(-50%, -50%) !important;
    z-index: 1000000 !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    gap: 10px !important;
    pointer-events: none !important;
    width: calc(100% - 40px) !important;
    max-width: 380px !important;
  }
`;
