/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{html,js,tsx,jsx}'],
  theme: {
    extend: {
      keyframes: {
        hadMsg: {
          '0%': { backgroundColor: 'rgba(255,158,2,0.5)' },
          '50%': { backgroundColor: 'rgba(255,158,2,0.1)' },
          '100%': { backgroundColor: 'rgba(255,158,2,0.5)' }
        }
      },
      animation: {
        hadMsg: 'hadMsg 2s ease-in-out infinite'
      },
      colors: {
        lightGray: '#323644',
        deepGray: '#272a37',
        hoverColor: '#1d90f5',
        chatRelationActive: '#2c3e50',
        textGrayColor: '#999999',
        chatSpaceHeader: '#5b5e69',
        chatSpaceFooter: '#424654',
        onlineGreen: '#adff2f',
        messageBackground: '#383c4b',
        chatInputActive: '#353845',
        loginMask: 'rgba(0,0,0,0.4)',
        loginForm: '#141414',
        whiteTextColor: '#cfd3dc',
        greenTextColor: '#2aae67',
        unOnline: '#dfdfdf'
      },
      backdropBlur: {
        xs: '2px'
      },
      backgroundImage: {
        temple: "url('@/assets/background.jpeg')"
      },
      minWidth: {
        minChatSpace: '450px'
      }
    }
  },
  plugins: []
};
