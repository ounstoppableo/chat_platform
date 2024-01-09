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
      boxShadow: {
        circle: ' 0 0 6px rgb(0,0,0,0.2)'
      },
      colors: {
        midGray: '#323543',
        lightGray: '#323644',
        deepGray: '#272a37',
        hoverColor: '#1d90f5',
        lightHoverColor: '#33435d',
        midHoverColor: '#2b5281',
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
        unOnline: '#dfdfdf',
        love: '#fe2c55',
        disLove: '#999999'
      },
      backdropBlur: {
        xs: '2px'
      },
      zIndex: {
        max: '9999'
      },
      backgroundImage: {
        temple: "url('@/assets/background.jpeg')"
      },
      minWidth: {
        minChatSpace: '450px',
        '100px': '100px'
      }
    }
  },
  plugins: []
};
