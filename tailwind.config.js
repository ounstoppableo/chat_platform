/** @type {import('tailwindcss').Config} */
export default {
  prefix: 'tw-',
  content: ['./index.html', './src/**/*.{html,js,tsx,jsx}'],
  theme: {
    extend: {
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
        chatInputActive: '#353845'
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
