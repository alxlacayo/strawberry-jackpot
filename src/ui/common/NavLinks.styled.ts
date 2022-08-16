import styled from "styled-components";

const Container = styled.ul`
    display: flex;

    & li {
        margin: 0 1.5rem;
        font-weight: 600;
        cursor: pointer;
        user-select: none;
    }
`;

export default Container;