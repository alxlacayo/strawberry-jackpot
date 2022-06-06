import styled from "styled-components";

const Container = styled.div`
    ul {
        margin-bottom: 0;
    }

    li {
        text-align: center;
        margin-bottom: 1rem;
        padding: 1.5rem 3rem;
        display: flex;
        align-items: center;
        font-weight: 600;
        border-radius: 3rem;
        font-size: 1.5rem;
        background: #f0f0f0;
        cursor: pointer;

        img {
            margin-right: 1.5rem;
            width: 2rem;
            height: 2rem;
        }
    }

    li:last-child {
        margin-bottom: 0;
    }
`;

export default Container;
