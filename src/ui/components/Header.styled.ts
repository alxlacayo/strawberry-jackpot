import styled from "styled-components";

const Container = styled.div`
    margin: 2rem 2rem 2rem;
    display: flex;
    justify-content: center;

    ul {
        flex-direction: column;

        @media (min-width: 768px) {
            flex-direction: row;
        }
    }

    ul li {
        text-align: left;

        @media (max-width: 768px) {
            margin: 0;
        }
    }

    li:first-child {
        margin-left: 0;
    }

    @media (min-width: 992px) {
        margin: 2rem 10rem 2rem;
    }
`;

export default Container;

