import styled from "styled-components";

const Container = styled.div`
    margin: 5rem 1rem 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;

    div {
        width: 50%;

        @media (min-width: 992px) {
            width: 33.333333%;
        }
    }

    img {
        display: block;
        margin: 0 1rem 2rem;
        width: calc(100% - 2rem);
    }

    @media (min-width: 992px) {
        margin: 8rem 9rem 4rem;
    }
`;

export default Container;
