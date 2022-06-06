import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .mint-button {
        margin-bottom: 1rem;
    }

    ul {
        margin-bottom: 3rem;
        font-size: 1.7rem;
    }
`;

export const Showcase = styled.div`
    display: flex;
    flex-wrap: wrap;
    img {
        width: 50%;
    }
`;

export const InnerContainer = styled.div`
    max-width: 40rem;
    background: #FFFFFF;
`;

export const DetailsContainer = styled.div`
    padding: 3rem 3rem 4rem;
`;

export const Description = styled.p`
    margin: 0 0 2rem;
    max-width: 65rem;
    font-size: 1.7rem;
        line-height: 1.5;
    /* @media (min-width: 992px) {
        margin-bottom: 2rem;
        font-size: 1.7rem;
        line-height: 1.5;
    } */
`;
