import styled from "styled-components";

const ModalContent = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    padding: 5rem 3rem 4rem;
    background: #FFFFFF;

    .close {
        position: absolute;
        padding: 1rem;
        top: 0;
        right: 0;
        cursor: pointer;
    }

    @media (min-width: 576px) {
        top: 3rem;
        right: auto;
        left: auto;
        width: 320px;
    }

    @media (min-width: 992px) {
        top: 5rem;
    }
`;

export default ModalContent;
