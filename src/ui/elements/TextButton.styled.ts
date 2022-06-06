import styled from "styled-components";

const TextButton = styled.span`
    font-weight: 600;
    color: ${props => props.color || null };
    cursor: pointer;
    user-select: none;
`;

export default TextButton;
