import styled from "styled-components";

export const ReelsStyled = styled.div`
    display: flex;

    > img {
        margin-right: 1rem;
        border: 2px solid #FF00E5;
        display: block;
        width: calc((100% - 3rem - 16px) / 4);
        height: calc((100% - 3rem - 16px) / 4);
    }

    > img:last-child {
        margin-right: 0;
    }
`;

export const ReelImageStyled = styled.img`

`;
