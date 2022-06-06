import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    html {
        font-size: 62.5%;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: "Poppins", sans-serif;
        font-weight: 400;
        font-size: 1.5rem;
        line-height: 1.6;
        text-align: center;
        background: #D3BFFF;
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

    a {
        font-weight: 600;
        text-decoration: none;
        color: #000000;
    }
`;

export default GlobalStyles;
