import styled from "styled-components";

interface Props {
    background?: string
}

const Button = styled.span<Props>`
    padding: 2rem 0;
    display: block;
    width: 100%;
    font-weight: 600;
    color: ${props => props.color || "#FFFFFF" };
    background: ${props => props.background || "#000000" };
    border-radius: 3.2rem;
    user-select: none;
    cursor: pointer;
`;

export default Button;
