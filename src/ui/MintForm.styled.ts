import styled from "styled-components";

export const MintControls = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 768px) {
        /* flex-direction: row; */
        justify-content: center;
    }
`;

export const QuantityInput = styled.div`
    margin-bottom: 1rem;
    /* padding: 0 .5rem; */
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background-color: #E8E8E8;
    box-sizing: border-box;
    border-radius: 3.2rem;
    user-select: none;

    @media (min-width: 768px) {
        /* margin: 0; */
    }
`;

export const Adjuster = styled.span`
    display: inline-flex;
    width: 6.4rem;
    height: 6.4rem;
    justify-content: center;
    background: #D3BFFF;
    border-radius: 3.2rem;
    box-sizing: border-box;
    cursor: pointer;

    img {
        width: 1rem;
    }
`;

export const Quantity = styled.span`
    padding: 2rem 0;
    font-weight: 600;
`;
