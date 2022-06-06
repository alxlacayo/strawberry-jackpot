import styled from "styled-components";

const UnderlinedButton = styled.span`
    font-weight: 600;
    display: inline-flex;
    flex-direction: column;
    user-select: none;
    cursor: pointer;

    &:after {
        content: "";
        height: .2rem;
        width: 100%;
        background-color: #000;
    }
`;

export default UnderlinedButton;
