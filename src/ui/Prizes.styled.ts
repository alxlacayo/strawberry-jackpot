import styled from "styled-components";

export const PrizesStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 2;
`;

export const PrizeMegaStyled = styled.div`
    padding: 1.6rem;
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    background: linear-gradient(0deg, #2A0E34, #9900FF);
    background: #51007e;

    > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 50%;
    }

    > div:first-child > span:first-child {
        font-size: 4.4rem;
        line-height: 1;
        font-weight: bold;
        color: #F300E8;
    }

    > div:first-child > span:last-child {
        font-size: 2rem;
    }

    > div:last-child > span {
        font-size: 3.2rem;
        line-height: 1;
        font-weight: bold;
        color: #FFF700;
    }
`;

export const PrizeMiniStyled = styled(PrizeMegaStyled)`
    /* background: linear-gradient(0deg, #0B0514, #202230); */
    background: #202230;

    > div:first-child > span:first-child {
    }

    > div:last-child > span {
        color: #FFFFFF;
    }
`;

export const PrizeAmountStyled = styled.span`
    font-size: 4rem;
    line-height: 1;
    font-weight: bold;
    color: ${props => props.color || "" };
`;
