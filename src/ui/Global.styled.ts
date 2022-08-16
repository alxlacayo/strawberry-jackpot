import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Perfect-DOS-VGA-437';
        src:url('/assets/fonts/Perfect-DOS-VGA-437.ttf.woff') format('woff'),
            url('/assets/fonts/Perfect-DOS-VGA-437.ttf.svg#Perfect-DOS-VGA-437') format('svg'),
            url('/assets/fonts/Perfect-DOS-VGA-437.ttf.eot'),
            url('/assets/fonts/Perfect-DOS-VGA-437.ttf.eot?#iefix') format('embedded-opentype'); 
        font-weight: normal;
        font-style: normal;
    }

    html {
        font-size: 62.5%;
        height: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        height: 100%;
        font-family: 'Perfect-DOS-VGA-437';
        font-weight: 400;
        font-size: 1.5rem;
        line-height: 1.6;
        text-align: center;
        background: #000000;
        color: #FFFFFF;
    }

    h1 {
        margin: 0 0 2rem;
        font-size: 4.2rem;
        line-height: 1.1;
        letter-spacing: -.1rem;

        @media (min-width: 992px) {
            margin: 0 0 2rem;
            font-size: 4.2rem;
            line-height: -.1rem;
        }
    }

    h2 {
        margin: 0 0 2rem;
        font-size: 2.4rem;
        line-height: 1.3;
        letter-spacing: -0.05rem;

        @media (min-width: 992px) {
            margin: 0 0 2rem;
            font-size: 2.4rem;
            line-height: 1.3;
            letter-spacing: -0.05rem;
        }
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
    }

    p {
        margin: 0;
        padding: 0;
    }

    #app {
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
    }
`;

export default GlobalStyles;
